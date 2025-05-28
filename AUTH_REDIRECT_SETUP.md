# Conditional Authentication Redirects

This project implements conditional redirects after authentication based on user types stored in the Convex database.

## How It Works

### 1. User Types

Users in the system can have one of three types:

- `user` - Regular users (default) → redirected to `/user-dashboard`
- `doctor` - Medical professionals → redirected to `/doctor-dashboard`
- `admin` - Administrators → redirected to `/admin-dashboard`

### 2. Authentication Flow

1. **Sign In/Sign Up**: Users authenticate through Clerk
2. **Webhook Processing**: Clerk webhook creates/updates user in Convex with default type "user"
3. **Redirect Logic**: Custom `AuthRedirect` component checks user type and redirects accordingly
4. **Dashboard Access**: Users land on their appropriate dashboard

### 3. Key Components

#### `components/auth/AuthRedirect.tsx`

- Waits for both Clerk and Convex to load user data
- Handles webhook processing delays
- Redirects based on `userType` from Convex database

#### `app/auth-redirect/page.tsx`

- Landing page after authentication
- Simply renders the `AuthRedirect` component

#### `hooks/use-current-user.ts`

- Custom hook for accessing current user data
- Provides loading states and authentication status

### 4. Updated Auth Pages

Both sign-in and sign-up pages now:

- Check if user is already authenticated
- Show redirect component for authenticated users
- Use `/auth-redirect` as the `forceRedirectUrl`

### 5. Changing User Types

Admins can update user types using the `updateUserType` mutation:

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const updateUserType = useMutation(api.users.updateUserType);

// Usage (only admins can do this)
await updateUserType({
  userId: "user_id_here",
  userType: "doctor", // or "admin" or "user"
});
```

### 6. Security Notes

- Only authenticated users can access `/auth-redirect`
- User type changes require admin privileges
- Webhook processing delays are handled gracefully
- All redirects use `router.replace()` to prevent back navigation

### 7. Testing the Setup

1. Sign up as a new user → should redirect to `/user-dashboard`
2. Have an admin change your type to "doctor" → next login redirects to `/doctor-dashboard`
3. Admin users → redirect to `/admin-dashboard`

### 8. Troubleshooting

- **Stuck on loading**: Webhook might be delayed, page will auto-refresh after 2 seconds
- **Wrong redirect**: Check user type in Convex database
- **No redirect**: Ensure all dashboard routes exist and are accessible
