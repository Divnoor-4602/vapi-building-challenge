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
      v.literal("patient"),
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
    phoneNumber: v.optional(v.string()),
    address: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
        country: v.optional(v.string()),
      })
    ),

    // Communication preferences
    preferredLanguage: v.optional(v.string()), // "en", "es", etc.
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

    // Profile completion status
    isProfileComplete: v.boolean(),
  }).index("byUserId", ["userId"]),

  // Patient-specific information (subset of users who become patients)
  patients: defineTable({
    // Reference to user and profile
    userId: v.id("users"),
    profileId: v.id("profiles"),

    // Patient identifier
    patientId: v.string(), // Internal patient ID (e.g., "PAT-2024-001")

    // Chief complaint and symptoms
    chiefComplaint: v.string(), // Primary reason for visit
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

    // Medical history basics
    medicalHistory: v.object({
      allergies: v.array(v.string()),
      currentMedications: v.array(
        v.object({
          name: v.string(),
          dosage: v.string(),
          frequency: v.string(),
        })
      ),
      chronicConditions: v.array(v.string()),
      previousSurgeries: v.array(
        v.object({
          procedure: v.string(),
          year: v.string(),
        })
      ),
      familyHistory: v.optional(v.array(v.string())),
    }),

    // Insurance information
    insurance: v.optional(
      v.object({
        provider: v.string(),
        policyNumber: v.string(),
        groupNumber: v.optional(v.string()),
        subscriberName: v.string(),
        relationshipToSubscriber: v.string(),
      })
    ),

    // Appointment preferences
    appointmentPreferences: v.object({
      preferredTimeSlots: v.array(v.string()), // ["morning", "afternoon", "evening"]
      preferredDays: v.array(v.string()), // ["monday", "tuesday", etc.]
      preferredProviderGender: v.optional(v.string()),
      isUrgent: v.boolean(),
      willingToWaitForPreferredProvider: v.boolean(),
    }),

    // Consent and privacy
    consents: v.object({
      treatmentConsent: v.boolean(),
      dataProcessingConsent: v.boolean(),
      marketingConsent: v.boolean(),
      consentTimestamp: v.number(),
    }),

    // Intake status
    intakeStatus: v.union(
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("needs_review"),
      v.literal("approved")
    ),

    // Next steps
    recommendedAction: v.optional(
      v.union(
        v.literal("schedule_appointment"),
        v.literal("urgent_care"),
        v.literal("emergency"),
        v.literal("telehealth"),
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
    .index("byPatientId", ["patientId"])
    .index("byIntakeStatus", ["intakeStatus"])
    .index("byAssignedProvider", ["assignedProviderId"]),
});
