import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';

/**
 * API Route: /api/suburb/sync
 * 
 * Triggers ETL pipeline for government data ingestion
 * 
 * Method: POST
 * Auth: Admin only (or Cloud Scheduler service account)
 * 
 * Request Body:
 * {
 *   "state": "NSW" | "VIC",
 *   "datasets": ["property_sales", "rental_bonds", ...],
 *   "force": boolean (optional - skip change detection)
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "jobId": "etl-nsw-20240115-123456",
 *   "state": "NSW",
 *   "datasets": [...],
 *   "status": "queued" | "running",
 *   "message": "ETL job started successfully"
 * }
 */

interface ETLRequest {
  state: 'NSW' | 'VIC';
  datasets?: string[];
  force?: boolean;
}

interface ETLResponse {
  success: boolean;
  jobId?: string;
  state?: string;
  datasets?: string[];
  status?: string;
  message: string;
  error?: string;
}

// Store running jobs in memory (use Redis/DB in production)
const runningJobs = new Map<string, {
  state: string;
  datasets: string[];
  status: 'queued' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}>();

export async function POST(request: NextRequest): Promise<NextResponse<ETLResponse>> {
  try {
    // Authentication check
    const authHeader = request.headers.get('authorization');
    const isScheduler = authHeader?.includes('Bearer') && authHeader?.includes('accounts.google.com');
    
    // For manual triggers, require admin access
    if (!isScheduler) {
      const userEmail = request.headers.get('x-user-email');
      if (!userEmail || !isAdmin(userEmail)) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized. Admin access required.' },
          { status: 401 }
        );
      }
    }

    // Parse request body
    const body = await request.json() as ETLRequest;
    const { state, datasets, force = false } = body;

    // Validation
    if (!state || !['NSW', 'VIC'].includes(state)) {
      return NextResponse.json(
        { success: false, message: 'Invalid state. Must be NSW or VIC.' },
        { status: 400 }
      );
    }

    // Generate job ID
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const jobId = `etl-${state.toLowerCase()}-${timestamp}`;

    // Check if job already running for this state
    const existingJob = Array.from(runningJobs.values()).find(
      job => job.state === state && (job.status === 'queued' || job.status === 'running')
    );

    if (existingJob && !force) {
      return NextResponse.json(
        { 
          success: false, 
          message: `ETL job already running for ${state}. Use force=true to override.`,
          status: existingJob.status
        },
        { status: 409 }
      );
    }

    // Register job
    runningJobs.set(jobId, {
      state,
      datasets: datasets || [],
      status: 'queued',
      startedAt: new Date()
    });

    // Execute ETL pipeline asynchronously
    executeETLPipeline(jobId, state, datasets, force)
      .catch(error => {
        console.error(`ETL job ${jobId} failed:`, error);
        const job = runningJobs.get(jobId);
        if (job) {
          job.status = 'failed';
          job.error = error.message;
          job.completedAt = new Date();
        }
      });

    return NextResponse.json({
      success: true,
      jobId,
      state,
      datasets: datasets || [],
      status: 'queued',
      message: `ETL job started successfully for ${state}`
    });

  } catch (error: any) {
    console.error('ETL sync error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/suburb/sync?jobId=etl-nsw-20240115-123456
 * 
 * Check status of ETL job
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    // Return all jobs
    const jobs = Array.from(runningJobs.entries()).map(([id, job]) => ({
      jobId: id,
      ...job
    }));

    return NextResponse.json({
      success: true,
      jobs
    });
  }

  // Return specific job
  const job = runningJobs.get(jobId);
  if (!job) {
    return NextResponse.json(
      { success: false, message: 'Job not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    jobId,
    ...job
  });
}

/**
 * Execute ETL pipeline
 * 
 * This spawns a Python subprocess to run the orchestrator
 * In production, this should use Cloud Run Jobs or Cloud Tasks
 */
async function executeETLPipeline(
  jobId: string,
  state: string,
  datasets?: string[],
  force: boolean = false
): Promise<void> {
  const job = runningJobs.get(jobId);
  if (!job) return;

  job.status = 'running';

  try {
    // Build command
    const args = ['etl/orchestrator.py', '--state', state];
    
    if (datasets && datasets.length > 0) {
      args.push('--datasets', ...datasets);
    }

    if (force) {
      args.push('--force');
    }

    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      args.push('--db', databaseUrl);
    }

    console.log(`[${jobId}] Starting ETL pipeline:`, args.join(' '));

    // Execute Python script
    // Note: In production, use Cloud Run Jobs instead of subprocess
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', args, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PYTHONUNBUFFERED: '1'
      }
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
      console.log(`[${jobId}]`, data.toString());
    });

    pythonProcess.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
      console.error(`[${jobId}] ERROR:`, data.toString());
    });

    pythonProcess.on('close', (code: number) => {
      if (code === 0) {
        job.status = 'completed';
        job.completedAt = new Date();
        console.log(`[${jobId}] ETL pipeline completed successfully`);
      } else {
        job.status = 'failed';
        job.error = `Process exited with code ${code}. ${stderr}`;
        job.completedAt = new Date();
        console.error(`[${jobId}] ETL pipeline failed with code ${code}`);
      }
    });

  } catch (error: any) {
    job.status = 'failed';
    job.error = error.message;
    job.completedAt = new Date();
    throw error;
  }
}
