import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Base user table - for all authenticated users (not all are patients)
  users: defineTable({
    // Clerk authentication
    clerkId: v.string(), // This is the clerkId of the user

    // Basic user information
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()), // Profile picture from Clerk

    // User role/type
    userType: v.union(
      v.literal("user"),
      v.literal("doctor"),
      v.literal("admin")
    ),

    // Account status
    isActive: v.boolean(),

    // Timestamps
    lastLoginAt: v.optional(v.number()),
  })
    .index("byClerkId", ["clerkId"])
    .index("byEmail", ["email"])
    .index("byUserType", ["userType"]),

  // Extended profile information for users
  // Note: One-to-one relationship with users table is enforced at application level
  // Each user can have only one profile (enforced in mutations)
  profiles: defineTable({
    // Reference to user
    userId: v.id("users"),

    // Personal information
    firstName: v.string(),
    lastName: v.string(),
    dateOfBirth: v.string(), // ISO date string
    gender: v.optional(
      v.union(
        v.literal("male"),
        v.literal("female"),
        v.literal("other"),
        v.literal("prefer_not_to_say")
      )
    ),

    // Contact information
    phoneNumber: v.string(),
    address: v.optional(
      v.object({
        street: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        zipCode: v.optional(v.string()),
        country: v.optional(v.string()),
      })
    ),

    // Communication preferences
    communicationPreferences: v.object({
      email: v.boolean(),
      sms: v.boolean(),
      phone: v.boolean(),
    }),

    // Emergency contact
    emergencyContact: v.optional(
      v.object({
        name: v.string(),
        relationship: v.string(),
        phoneNumber: v.string(),
      })
    ),

    // Medical history basics - MOVED FROM PATIENTS TABLE
    medicalHistory: v.optional(
      v.object({
        allergies: v.array(v.string()), // Empty array if none
        currentMedications: v.array(
          v.object({
            name: v.string(),
            dosage: v.string(),
            frequency: v.string(),
          })
        ), // Empty array if none

        // Chronic conditions
        chronicConditions: v.array(v.string()), // Empty array if none
        previousSurgeries: v.array(
          v.object({
            procedure: v.string(),
            year: v.string(),
          })
        ), // Empty array if none
        familyHistory: v.optional(v.array(v.string())), // Optional field
      })
    ),

    // Insurance information - MOVED FROM PATIENTS TABLE
    insurance: v.optional(
      v.object({
        provider: v.string(),
        policyNumber: v.string(),
        groupNumber: v.optional(v.string()),
        subscriberName: v.string(),
        relationshipToSubscriber: v.string(),
      })
    ),

    // Consent and privacy - MOVED FROM PATIENTS TABLE
    consents: v.optional(
      v.object({
        treatmentConsent: v.boolean(),
        dataProcessingConsent: v.boolean(),
        marketingConsent: v.boolean(),
        consentTimestamp: v.number(),
      })
    ),

    // Profile completion status
    isProfileComplete: v.boolean(),
  }).index("byUserId", ["userId"]),

  // Patient-specific information (subset of users who become patients)
  // Now focused on visit-specific information
  patients: defineTable({
    // Reference to user and profile
    userId: v.id("users"),

    // Reference to profile
    // A profile can be linked to multiple patients
    // Since the same person can visit multiple times
    profileId: v.id("profiles"),

    // Chief complaint and symptoms - VISIT SPECIFIC
    chiefComplaint: v.string(), // Primary reason for visit

    // Symptoms - VISIT SPECIFIC
    currentSymptoms: v.array(
      v.object({
        symptom: v.string(),
        severity: v.union(
          v.literal("mild"),
          v.literal("moderate"),
          v.literal("severe")
        ),
        duration: v.string(), // "2 days", "1 week", etc.
        notes: v.optional(v.string()),
      })
    ),

    // Next steps
    recommendedAction: v.optional(
      v.union(
        v.literal("schedule_appointment"),
        v.literal("urgent_care"),
        v.literal("emergency"),
        v.literal("prescription_consultation")
      )
    ),

    // Provider assignment
    assignedProviderId: v.optional(v.string()),

    // Follow-up needed
    requiresFollowUp: v.boolean(),
    followUpNotes: v.optional(v.string()),
  })
    .index("byUserId", ["userId"])
    .index("byProfileId", ["profileId"])
    .index("byAssignedProvider", ["assignedProviderId"]),

  // medical ticket linked to the patients
  medicalTickets: defineTable({
    // ticket linked to the user
    userId: v.id("users"),

    // ticket linked to the profile
    profileId: v.id("profiles"),

    // ticket linked to the patient
    patientId: v.id("patients"),

    // status of the ticket
    status: v.union(
      v.literal("cancelled"),
      v.literal("completed"),
      v.literal("in_progress"),
      v.literal("on_hold")
    ),

    // where does it go from here? (determined by medical staff after review)
    nextSteps: v.optional(
      v.union(v.literal("vapi_appointment"), v.literal("vapi_prescription"))
    ),

    // notes about the ticket
    notes: v.optional(v.string()),

    // timestamp of the ticket
    createdAt: v.number(),
  })
    .index("byUserId", ["userId"])
    .index("byProfileId", ["profileId"])
    .index("byPatientId", ["patientId"])
    .index("byStatus", ["status"])
    .index("byUserIdAndStatus", ["userId", "status"])
    .index("byCreatedAt", ["createdAt"]),

  prescriptions: defineTable({
    // prescription linked to the patient
    patientId: v.id("patients"),

    // prescription linked to the ticket
    ticketId: v.id("medicalTickets"),

    // prescription details
    prescriptionDetails: v.object({
      medication: v.string(),
      dosage: v.string(),
      frequency: v.string(),
      instructions: v.string(),
    }),

    // prescription notes
    notes: v.optional(v.string()),
  })
    .index("byPatientId", ["patientId"])
    .index("byTicketId", ["ticketId"]),

  // Appointments - linking doctors and patients with Google Calendar integration
  appointments: defineTable({
    // User references
    doctorId: v.id("users"), // Must be userType "doctor"
    patientId: v.id("users"), // Must be userType "user"
    profileId: v.id("profiles"), // Patient's profile
    patientRecordId: v.id("patients"), // Patient record

    // Optional medical ticket reference - not all appointments come from tickets
    ticketId: v.optional(v.id("medicalTickets")),

    // Google Calendar Integration
    googleCalendarEventId: v.optional(v.string()),
    googleCalendarResponse: v.optional(v.any()), // Raw Google Calendar API response

    // Appointment Details (matching Google Calendar Create Event structure)
    summary: v.string(), // Title/description of the appointment
    startDateTime: v.string(), // ISO format date-time
    endDateTime: v.string(), // ISO format date-time
    timeZone: v.string(), // Timezone for the appointment

    // Attendees
    attendees: v.array(v.string()), // Array of email addresses

    // Appointment Status
    status: v.union(
      v.literal("cancelled"),
      v.literal("completed"),
      v.literal("confirmed")
    ),

    // Additional Information
    notes: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("byDoctorId", ["doctorId"])
    .index("byPatientId", ["patientId"])
    .index("byProfileId", ["profileId"])
    .index("byPatientRecordId", ["patientRecordId"])
    .index("byTicketId", ["ticketId"])
    .index("byStatus", ["status"])
    .index("byDoctorIdAndStatus", ["doctorId", "status"])
    .index("byPatientIdAndStatus", ["patientId", "status"])
    .index("byStartDateTime", ["startDateTime"])
    .index("byGoogleCalendarEventId", ["googleCalendarEventId"]),
});
