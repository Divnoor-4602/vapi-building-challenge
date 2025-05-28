# VAPI Routes Structure

## Overview

The VAPI endpoints have been reorganized into three separate domains for better maintainability and separation of concerns:

1. **Patient Profile Management**
2. **Medical Ticket Operations**
3. **Prescription Management**

## New Route Structure

```
app/api/vapi/
├── patient-profile/          # Patient profile management
│   ├── route.ts             # Main route handler
│   ├── router.ts            # Function routing logic
│   └── handlers/            # Individual function handlers
│       ├── index.ts
│       ├── checkPatientProfile.ts
│       ├── createPatientProfileAction.ts
│       ├── updatePatientProfileAction.ts
│       ├── getProfileMissingFields.ts
│       └── createPatient.ts
├── medical-ticket/           # Medical ticket operations
│   ├── route.ts             # Main route handler
│   ├── router.ts            # Function routing logic
│   └── handlers/            # Individual function handlers
│       ├── index.ts
│       ├── createMedicalTicket.ts
│       └── checkMedicalTicketStatus.ts
└── prescription/             # Prescription management
    ├── route.ts             # Main route handler
    ├── router.ts            # Function routing logic
    └── handlers/            # Individual function handlers
        ├── index.ts
        └── getPrescription.ts
```

## New VAPI Endpoint URLs

### 1. Patient Profile Management

**Base URL**: `/api/vapi/patient-profile`

**Available Functions**:

- `checkPatientProfile` - Verify if patient profile exists using email
- `createPatientProfile` - Create new patient profile with collected demographics
- `updatePatientProfile` - Update existing patient profile information
- `getProfileMissingFields` - Get list of missing required profile fields
- `createPatient` - Create patient record with symptoms and medical information

### 2. Medical Ticket Operations

**Base URL**: `/api/vapi/medical-ticket`

**Available Functions**:

- `createMedicalTicket` - Create intake ticket with symptoms and patient information
- `checkMedicalTicketStatus` - Monitor ticket review status by medical team (with polling)

### 3. Prescription Management

**Base URL**: `/api/vapi/prescription`

**Available Functions**:

- `getPrescription` - Retrieve prescription details for a medical ticket

## VAPI Configuration Updates Required

Update your VAPI assistant configurations to use the new endpoints:

### Patient Intake Specialist (Maddie 1)

```json
{
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "checkPatientProfile",
        "url": "https://your-domain.com/api/vapi/patient-profile"
      }
    },
    {
      "type": "function",
      "function": {
        "name": "createPatientProfile",
        "url": "https://your-domain.com/api/vapi/patient-profile"
      }
    },
    {
      "type": "function",
      "function": {
        "name": "updatePatientProfile",
        "url": "https://your-domain.com/api/vapi/patient-profile"
      }
    },
    {
      "type": "function",
      "function": {
        "name": "getProfileMissingFields",
        "url": "https://your-domain.com/api/vapi/patient-profile"
      }
    },
    {
      "type": "function",
      "function": {
        "name": "createPatient",
        "url": "https://your-domain.com/api/vapi/patient-profile"
      }
    }
  ]
}
```

### Medical Review Specialist (Maddie 2)

```json
{
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "createMedicalTicket",
        "url": "https://your-domain.com/api/vapi/medical-ticket"
      }
    },
    {
      "type": "function",
      "function": {
        "name": "checkMedicalTicketStatus",
        "url": "https://your-domain.com/api/vapi/medical-ticket"
      }
    }
  ]
}
```

### Pharmacy Specialist (Anna)

```json
{
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "getPrescription",
        "url": "https://your-domain.com/api/vapi/prescription"
      }
    }
  ]
}
```

## Benefits of New Structure

### 1. **Separation of Concerns**

- Each domain has its own dedicated route and handlers
- Easier to maintain and debug specific functionality
- Clear boundaries between different business logic areas

### 2. **Improved Maintainability**

- Smaller, focused files that are easier to understand
- Reduced coupling between different functional areas
- Easier to add new functionality within each domain

### 3. **Better Error Handling**

- Domain-specific error handling and logging
- Easier to trace issues to specific functional areas
- More targeted debugging capabilities

### 4. **Scalability**

- Each domain can be scaled independently
- Easier to add new functions within existing domains
- Clear pattern for adding new domains in the future

### 5. **Team Development**

- Different team members can work on different domains
- Reduced merge conflicts
- Clear ownership of different functional areas

## Migration Notes

1. **Update VAPI Assistant Configurations**: Change the URL endpoints in your VAPI assistant tool configurations to use the new routes.

2. **Test Each Domain**: Test each domain separately to ensure all functions work correctly with the new structure.

3. **Monitor Logs**: The new structure includes improved logging with domain-specific prefixes for easier debugging.

4. **Backward Compatibility**: The old `/api/vapi/patient-profile` route still exists but only handles patient profile related functions. Medical ticket and prescription functions have been moved to their respective new routes.

## Function Parameter Requirements

All function parameters remain the same as before. Only the endpoint URLs have changed. Refer to the individual handler files for specific parameter requirements for each function.
