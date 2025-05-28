# Team Development Setup Guide

## Shared Development Environment

This project uses a shared Convex development deployment to enable collaborative development.

### Prerequisites

- Node.js 18+ installed
- Git access to this repository
- Convex account (team members will be invited)

### Setup Instructions for New Team Members

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hospital-voice-agent-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Copy the shared environment variables (provided separately for security):

   ```bash
   # Create .env.local with shared development credentials
   cp .env.example .env.local
   # Update with shared values provided by team lead
   ```

4. **Verify Convex Connection**
   ```bash
   npx convex dev --once
   ```

### Shared Environment Variables

```bash
# Development Deployment (Shared)
CONVEX_DEPLOYMENT=brainy-possum-26
NEXT_PUBLIC_CONVEX_URL=https://brainy-possum-26.convex.cloud

# Clerk Authentication (Shared Dev)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<shared-dev-key>
CLERK_WEBHOOK_SECRET=<shared-dev-secret>

# VAPI Configuration (Shared Dev)
NEXT_PUBLIC_VAPI_API_KEY=<shared-dev-key>
VAPI_PRIVATE_KEY=<shared-dev-key>
VAPI_ORG_ID=<shared-org-id>

# Pinecone (Shared Dev)
PINECONE_API_KEY=<shared-dev-key>
```

### Development Workflow

#### Running the Application

```bash
# Start the development server
npm run dev

# In a separate terminal, run Convex development
npx convex dev
```

#### Database Operations

All team members share the same database tables:

- `users` - User accounts and profiles
- `profiles` - Detailed user profile information
- `patients` - Patient intake records
- `medicalTickets` - Medical consultation tickets
- `prescriptions` - Prescription records

#### Best Practices

1. **Data Isolation**: Use user-specific data when testing
2. **Test Data**: Use the test data functions for development:

   ```bash
   # Create test data for your email
   npx convex run testData:createTestDataForUser '{"email": "your-email@example.com"}'

   # Clean up test data when done
   npx convex run testData:cleanupTestDataForUser '{"email": "your-email@example.com"}'
   ```

3. **Schema Changes**: Coordinate schema changes with the team
4. **Function Deployment**: All function changes are immediately shared

### Troubleshooting

#### Common Issues

1. **Authentication Errors**

   - Verify environment variables are correct
   - Check Convex dashboard for deployment status

2. **Database Access Issues**

   - Ensure you're added to the Convex project team
   - Verify deployment URL matches

3. **Function Errors**
   - Check Convex logs: `npx convex logs`
   - Verify function syntax follows Convex guidelines

#### Getting Help

1. Check Convex logs: `npx convex logs`
2. View database in dashboard: [dashboard.convex.dev](https://dashboard.convex.dev)
3. Ask team lead for access issues

### Security Notes

- Never commit `.env.local` to version control
- Use separate API keys for production
- Rotate shared development keys periodically
- Each developer should use their own test user accounts
