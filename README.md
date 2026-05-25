# Suburb Intel AU - Web App

Australian Property Intelligence Platform with AI-Powered Smart Property Brain

## 🧠 Smart Property Brain

**The most comprehensive AI-powered property analysis system in Australia**, providing institutional-grade investment insights for every suburb.

### Key Features

#### 📊 Smart Property Score (0-100)
- **6-component algorithm** analyzing 68+ data points
- Real-time calculation across Growth, Supply, Rental, Demographics, Development, and Affordability
- Grade rating system (A+ to D) with visual gauge components
- Powered by GPT-4 Turbo for predictive analysis

#### 🎯 Investment Intelligence
- **11 Premium UI Components**: HeroStats, SmartScoreGauge, GrowthChart, RentVsBuySimulator, SupplyDemandBars, VacancyCards, DemographicsPanel, InfrastructureTimeline, InvestmentBreakdown, AIAnalysisPanel, CompareNearby
- **Opportunity Map**: Filter by persona, budget, yield, growth with intelligent matching
- **Persona-Based Recommendations**: 7 buyer personas with custom scoring algorithms
- **Side-by-Side Comparator**: Detailed metric-by-metric suburb comparison

#### 🤖 AI-Powered Features
- GPT-4 generated insights with investment grade ratings (A+ to F)
- Risk warnings and 12-month predictions
- Comparable suburb analysis
- Investment strategy recommendations
- Executive summaries and detailed explanations

#### 📈 Data Integration
- **5 ETL Pipelines**: ABS Census, NSW Valuer-General, VIC Property, Infrastructure Projects, Development Approvals
- Automated daily/weekly data updates
- High-quality government sources
- Real-time market intelligence

#### 🔔 Email Alert System
- Price change notifications (customizable threshold)
- New listing alerts
- Smart Score changes
- Daily/weekly digest emails
- Market update summaries

---

## 🚀 Features

### Core Features
- 📊 **Market Trends**: Real-time price movements and rental yields
- 🤖 **AI Insights**: GPT-4 powered property analysis with 68+ data points
- 📈 **Suburb Comparison**: Side-by-side detailed comparison
- 🔔 **Smart Alerts**: Personalized email notifications for price changes & market updates
- 🗺️ **Opportunity Map**: Discover investment opportunities by persona and criteria
- 💯 **Smart Property Score**: Comprehensive 0-100 scoring across 6 components

### Premium Analytics
- 💰 **ROI Calculator**: Interactive investment breakdown with cash flow projections
- 🏠 **Rent vs Buy Simulator**: Financial comparison calculator
- 📊 **Growth Visualizations**: Multi-period growth charts (6m, 1y, 3y, 5y, 10y)
- 📍 **Infrastructure Timeline**: Future projects and impact analysis
- 👥 **Demographics Panel**: Population, income, education, employment data
- 🔄 **Supply & Demand Analysis**: Market balance indicators

### Data & Insights
- 🏗️ **Development Pipeline**: Apartment, townhouse, and house approvals
- ⚠️ **Risk Assessment**: Oversupply risk, volatility, and market stability scores
- 📈 **Rental Analytics**: Vacancy rates, yields, and growth trends
- 🎯 **Persona Matching**: Tailored recommendations for 7 buyer types
- 📧 **Email Digests**: Daily and weekly market summaries

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v3
- **Database**: PostgreSQL with Prisma ORM
- **AI Engine**: OpenAI GPT-4 Turbo (JSON Mode)
- **Email**: SendGrid / AWS SES with Nodemailer
- **Hosting**: Google Cloud Run / App Engine
- **ETL Jobs**: TypeScript with Axios, scheduled via cron/Task Scheduler
- **Testing**: Playwright for E2E tests

## 📊 Database Schema

### Smart Property Brain Fields (50+ new fields)
- **Pricing**: medianHousePrice, medianUnitPrice, priceGrowth3m/6m/12m/3y/5y/10y, priceVolatilityScore
- **Rental**: grossYieldHouse/Unit, rentalGrowth12m, rentalVacancyRate, rentalRiskScore
- **Market**: listingsCurrent, listingsTrend3m, daysOnMarket, stockOnMarketPct, salesVolumeMonthly, demandScore, auctionClearanceRate
- **Development**: dwellingApprovalsYTD, apartmentPipeline, landSubdivisionActivity, oversupplyRiskScore, developmentActivity
- **Demographics**: populationGrowthRate, ageDistribution (JSON), educationLevelIndex, unemploymentRate, employmentRate, medianHouseholdIncome, renterPercentage
- **Lifestyle**: crimeRateIndex, schoolQualityScore, publicTransportScore, greenspaceScore, distanceToCBD, walkabilityScore, futureInfrastructureProjects (JSON array)
- **Scores**: overallSmartPropertyScore, suburbGrowthScore, suburbRiskScore, suburbOpportunityScore
- **AI Insights**: aiShortSummary, aiInvestmentExplanation, aiRiskWarning, aiFuturePrediction, aiComparableSuburbs, aiBuyerPersona, aiInvestmentStrategy, aiInvestmentGrade

### Indexes (Performance Optimized)
```prisma
@@index([overallSmartPropertyScore(sort: Desc)])
@@index([suburbGrowthScore(sort: Desc)])
@@index([suburbRiskScore(sort: Asc)])
@@index([suburbOpportunityScore(sort: Desc)])
@@index([demandScore(sort: Desc)])
@@index([priceVolatilityScore(sort: Asc)])
@@index([oversupplyRiskScore(sort: Asc)])
```

## 📦 Installation & Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd suburb-intel-web

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# Required environment variables:
# DATABASE_URL="postgresql://user:password@localhost:5432/suburb_intel"
# OPENAI_API_KEY="sk-..."
# SENDGRID_API_KEY="SG..." (optional for emails)
# NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# 4. Database setup
npx prisma db push
npx prisma generate

# 5. Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🤖 Smart Property Brain Usage

### Fetch AI Data for a Suburb
```bash
npm run smart-brain:fetch -- --suburb "Parramatta" --state "NSW"
```

### Run ETL Jobs
```bash
# Run all ETL jobs
npm run etl:all

# Run individual jobs
npm run etl:abs          # ABS Census data
npm run etl:nsw          # NSW property data
npm run etl:vic          # VIC property data
npm run etl:infrastructure  # Infrastructure projects
npm run etl:approvals    # Development approvals
```

### API Endpoints

#### POST /api/suburbs/fetch-smart-data
Trigger AI data fetch for a suburb
```json
{
  "name": "Parramatta",
  "state": "NSW"
}
```

#### GET /api/suburbs/[id]/smart-score
Calculate Smart Property Score
```
Response: { total: 85, rating: "A+", components: {...} }
```

#### GET /api/opportunity-map
Filter investment opportunities
```
?persona=investor-growth&minBudget=500000&maxBudget=1000000&minYield=4&state=NSW
```

#### POST /api/persona/recommendations
Get personalized recommendations
```json
{
  "persona": "first-home-buyer",
  "budget": 800000,
  "state": "NSW"
}
```

#### POST /api/alerts/setup
Set up email alerts
```json
{
  "email": "user@example.com",
  "suburbIds": ["..."],
  "alertTypes": ["price-change", "smart-score-change"],
  "frequency": "daily"
}
```

## 📅 Scheduled ETL Jobs

### Windows (Task Scheduler)
```powershell
# Run as Administrator
.\scripts\etl\setup-cron-windows.ps1
```

### Linux/macOS (Cron)
```bash
chmod +x scripts/etl/setup-cron-linux.sh
./scripts/etl/setup-cron-linux.sh
```

**Schedules:**
- NSW Property Data: Daily at 2:00 AM
- VIC Property Data: Daily at 2:30 AM
- ABS Census: Weekly (Sundays) at 3:00 AM
- Development Approvals: Weekly (Sundays) at 3:30 AM
- Infrastructure Projects: Monthly (1st) at 4:00 AM

## 🚀 Deployment to Google Cloud

### Prerequisites
1. Google Cloud account with billing enabled
2. Google Cloud SDK installed (`gcloud` command)
3. Docker installed (for container builds)

### Option 1: Google Cloud Run (Recommended)

```bash
# 1. Authenticate with Google Cloud
gcloud auth login

# 2. Set your project ID
gcloud config set project YOUR_PROJECT_ID

# 3. Build and push Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/suburb-intel-web

# 4. Deploy to Cloud Run
gcloud run deploy suburb-intel-web \
  --image gcr.io/YOUR_PROJECT_ID/suburb-intel-web \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 2Gi \
  --min-instances 1 \
  --max-instances 10

# 5. Set environment variables
gcloud run services update suburb-intel-web \
  --set-env-vars="NODE_ENV=production,NEXTAUTH_SECRET=your-secret"
```

### Option 2: Google App Engine

```bash
# 1. Initialize App Engine
gcloud app create --region=us-central

# 2. Deploy application
gcloud app deploy

# 3. View your app
gcloud app browse
```

### Option 3: CI/CD with Cloud Build

```bash
# 1. Connect your GitHub repository to Cloud Build
gcloud builds triggers create github \
  --repo-name=suburb-intel-web \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml

# 2. Push to main branch to trigger automatic deployment
git push origin main
```

## 🔐 Environment Variables

Create `.env.local` for development or set in Google Cloud for production:

```bash
# For Cloud Run
gcloud run services update suburb-intel-web \
  --set-env-vars="DATABASE_URL=your-db-url" \
  --set-env-vars="NEXTAUTH_SECRET=your-secret" \
  --set-env-vars="STRIPE_SECRET_KEY=your-key"

# For App Engine (edit app.yaml)
```

## 📊 Database Setup

```bash
# Create Cloud SQL PostgreSQL instance
gcloud sql instances create suburb-intel-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create suburb_intel \
  --instance=suburb-intel-db

# Set up Prisma
npx prisma generate
npx prisma migrate deploy
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build production bundle
npm run build
```

## 📁 Project Structure

```
suburb-intel-web/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── features/          # Feature pages
├── components/            # Reusable components
├── lib/                   # Utility functions
├── public/               # Static assets
├── prisma/               # Database schema
├── Dockerfile            # Container config
├── app.yaml              # App Engine config
├── cloudbuild.yaml       # Cloud Build config
└── next.config.js        # Next.js config
```

## 🌐 Custom Domain

```bash
# Map custom domain to Cloud Run
gcloud run domain-mappings create \
  --service suburb-intel-web \
  --domain suburbintel.com.au \
  --region us-central1
```

## 📈 Monitoring

- **Logs**: `gcloud logging read` or Google Cloud Console
- **Metrics**: Cloud Monitoring dashboard
- **Alerts**: Set up in Cloud Console

## 🤝 Contributing

See CONTRIBUTING.md

## 📄 License

© 2025 Smart Calculator Hubs. All rights reserved.

## 🆘 Support

- Email: support@suburbintel.com.au
- Docs: https://docs.suburbintel.com.au
- Status: https://status.suburbintel.com.au
