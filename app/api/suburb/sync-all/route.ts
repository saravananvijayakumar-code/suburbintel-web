import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { z } from 'zod'
import { validateBody, ValidationError, sanitizeForLog } from '@/lib/security';

/**
 * API Route: /api/suburb/sync-all
 * 
 * Triggers complete ETL pipeline for ALL states and datasets
 * 
 * Method: POST
 * Auth: Admin only (or Cloud Scheduler service account)
 * 
 * Request Body:
 * {
 *   "force": boolean (optional - skip change detection),
 *   "notify": boolean (optional - send email when complete)
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "jobId": "etl-all-20240115-123456",
 *   "status": "queued",
 *   "message": "Full sync started for all states"
 * }
 */

// Validation schema
const SyncAllRequestSchema = z.object({
  force: z.boolean().default(false),
  notify: z.boolean().default(false),
})

const JobIdQuerySchema = z.object({
  jobId: z.string().max(50).regex(/^[a-zA-Z0-9\-_]+$/).optional(),
})

interface SyncAllResponse {
  success: boolean;
  jobId?: string;
  status?: string;
  message: string;
  error?: string;
}

// Job storage (use Redis/DB in production)
const fullSyncJobs = new Map<string, {
  status: 'queued' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  nswStatus?: string;
  vicStatus?: string;
  error?: string;
}>();

export async function POST(request: NextRequest): Promise<NextResponse<SyncAllResponse>> {
  try {
    // Authentication
    const authHeader = request.headers.get('authorization');
    const isScheduler = authHeader?.includes('Bearer') && authHeader?.includes('accounts.google.com');
    
    if (!isScheduler) {
      const userEmail = request.headers.get('x-user-email');
      if (!userEmail || !isAdmin(userEmail)) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized. Admin access required.' },
          { status: 401 }
        );
      }
    }

    // Parse and validate request
    const { force, notify } = await validateBody(request, SyncAllRequestSchema);

    // Generate job ID
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const jobId = `etl-all-${timestamp}`;

    // Check for existing full sync job
    const runningJob = Array.from(fullSyncJobs.values()).find(
      job => job.status === 'queued' || job.status === 'running'
    );

    if (runningJob && !force) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Full sync already in progress. Use force=true to override.',
          status: runningJob.status
        },
        { status: 409 }
      );
    }

    // Register job
    fullSyncJobs.set(jobId, {
      status: 'queued',
      startedAt: new Date()
    });

    // Execute full sync asynchronously
    executeFullSync(jobId, force, notify)
      .catch(error => {
        console.error(`Full sync ${jobId} failed:`, sanitizeForLog(error));
        const job = fullSyncJobs.get(jobId);
        if (job) {
          job.status = 'failed';
          job.error = 'Sync process failed';
          job.completedAt = new Date();
        }
      });

    return NextResponse.json({
      success: true,
      jobId,
      status: 'queued',
      message: 'Full sync started for all states'
    });

  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, message: 'Invalid request', error: error.message },
        { status: 400 }
      );
    }
    
    console.error('Full sync error:', sanitizeForLog(error));
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/suburb/sync-all?jobId=etl-all-20240115-123456
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const jobIdParam = searchParams.get('jobId');
  
  // Validate jobId if provided
  if (jobIdParam) {
    const validation = JobIdQuerySchema.safeParse({ jobId: jobIdParam });
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid job ID format' },
        { status: 400 }
      );
    }
    
    // Return specific job
    const job = fullSyncJobs.get(jobIdParam);
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      jobId: jobIdParam,
      ...job
    });
  }

  // Return all full sync jobs
  const jobs = Array.from(fullSyncJobs.entries()).map(([id, job]) => ({
    jobId: id,
    ...job
  }));

  return NextResponse.json({
    success: true,
    jobs
  });
}

/**
 * Execute full sync for all states
 */
async function executeFullSync(
  jobId: string,
  force: boolean,
  notify: boolean
): Promise<void> {
  const job = fullSyncJobs.get(jobId);
  if (!job) return;

  job.status = 'running';

  try {
    console.log(`[${jobId}] Starting full sync for all states`);

    // Build command
    const args = ['etl/orchestrator.py', '--all'];
    
    if (force) {
      args.push('--force');
    }

    // Get database URL
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      args.push('--db', databaseUrl);
    }

    console.log(`[${jobId}] Command:`, args.join(' '));

    // Execute
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
      const output = data.toString();
      stdout += output;
      console.log(`[${jobId}]`, output);

      // Track state progress
      if (output.includes('NSW pipeline')) {
        job.nswStatus = 'running';
      } else if (output.includes('NSW pipeline completed')) {
        job.nswStatus = 'completed';
      } else if (output.includes('VIC pipeline')) {
        job.vicStatus = 'running';
      } else if (output.includes('VIC pipeline completed')) {
        job.vicStatus = 'completed';
      }
    });

    pythonProcess.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
      console.error(`[${jobId}] ERROR:`, data.toString());
    });

    pythonProcess.on('close', async (code: number) => {
      if (code === 0) {
        job.status = 'completed';
        job.completedAt = new Date();
        console.log(`[${jobId}] Full sync completed successfully`);

        // Send notification if requested
        if (notify) {
          await sendNotification(jobId, 'success', job);
        }
      } else {
        job.status = 'failed';
        job.error = `Process exited with code ${code}. ${stderr}`;
        job.completedAt = new Date();
        console.error(`[${jobId}] Full sync failed with code ${code}`);

        // Always notify on failure
        await sendNotification(jobId, 'failure', job);
      }
    });

  } catch (error: any) {
    job.status = 'failed';
    job.error = error.message;
    job.completedAt = new Date();

    // Notify on error
    await sendNotification(jobId, 'error', job);
    
    throw error;
  }
}

/**
 * Send notification email (implement with SendGrid, Resend, etc.)
 */
async function sendNotification(
  jobId: string,
  status: 'success' | 'failure' | 'error',
  job: any
): Promise<void> {
  try {
    const adminEmail = 'saravanavijay.v1986@gmail.com';
    
    const subject = status === 'success' 
      ? `✅ SuburbIntelAU Full Data Sync Completed`
      : `❌ SuburbIntelAU Full Data Sync Failed`;

    const body = `
Job ID: ${jobId}
Status: ${status}
Started: ${job.startedAt.toISOString()}
Completed: ${job.completedAt?.toISOString() || 'N/A'}
Duration: ${job.completedAt ? Math.round((job.completedAt - job.startedAt) / 1000) : 0}s

NSW Status: ${job.nswStatus || 'N/A'}
VIC Status: ${job.vicStatus || 'N/A'}

${job.error ? `Error: ${job.error}` : ''}

View logs: https://console.cloud.google.com/logs
Dashboard: https://suburb-intel-web-a56w6ktzsa-as.a.run.app/admin
    `.trim();

    console.log(`[${jobId}] Notification:`, { to: adminEmail, subject, body });

    // TODO: Implement actual email sending
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'etl@suburbintel.au',
    //   to: adminEmail,
    //   subject,
    //   text: body
    // });

  } catch (error) {
    console.error(`[${jobId}] Failed to send notification:`, error);
  }
}
