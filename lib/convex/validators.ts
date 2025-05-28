import { v } from "convex/values";

// Gender validator
export const genderValidator = v.union(
  v.literal("male"),
  v.literal("female"),
  v.literal("other"),
  v.literal("prefer_not_to_say")
);

// Address validator
export const addressValidator = v.object({
  street: v.optional(v.string()),
  city: v.optional(v.string()),
  state: v.optional(v.string()),
  zipCode: v.optional(v.string()),
  country: v.optional(v.string()),
});

// Communication preferences validator
export const communicationPreferencesValidator = v.object({
  email: v.boolean(),
  sms: v.boolean(),
  phone: v.boolean(),
});

// Emergency contact validator
export const emergencyContactValidator = v.object({
  name: v.string(),
  relationship: v.string(),
  phoneNumber: v.string(),
});

// Medication validator
export const medicationValidator = v.object({
  name: v.string(),
  dosage: v.string(),
  frequency: v.string(),
});

// Surgery validator
export const surgeryValidator = v.object({
  procedure: v.string(),
  year: v.string(),
});

// Medical history validator
export const medicalHistoryValidator = v.object({
  allergies: v.array(v.string()),
  currentMedications: v.array(medicationValidator),
  chronicConditions: v.array(v.string()),
  previousSurgeries: v.array(surgeryValidator),
  familyHistory: v.optional(v.array(v.string())),
});

// Insurance validator
export const insuranceValidator = v.object({
  provider: v.string(),
  policyNumber: v.string(),
  groupNumber: v.optional(v.string()),
  subscriberName: v.string(),
  relationshipToSubscriber: v.string(),
});

// Consents validator
export const consentsValidator = v.object({
  treatmentConsent: v.boolean(),
  dataProcessingConsent: v.boolean(),
  marketingConsent: v.boolean(),
  consentTimestamp: v.number(),
});

// User validator
export const userValidator = v.object({
  _id: v.id("users"),
  clerkId: v.string(),
  name: v.string(),
  email: v.string(),
  avatarUrl: v.optional(v.string()),
  userType: v.union(
    v.literal("user"),
    v.literal("patient"),
    v.literal("admin")
  ),
  isActive: v.boolean(),
  lastLoginAt: v.optional(v.number()),
  _creationTime: v.number(),
});

// Profile validator
export const profileValidator = v.object({
  _id: v.id("profiles"),
  userId: v.id("users"),
  firstName: v.string(),
  lastName: v.string(),
  dateOfBirth: v.string(),
  gender: v.optional(genderValidator),
  phoneNumber: v.string(),
  address: v.optional(addressValidator),
  communicationPreferences: communicationPreferencesValidator,
  emergencyContact: v.optional(emergencyContactValidator),
  medicalHistory: v.optional(medicalHistoryValidator),
  insurance: v.optional(insuranceValidator),
  consents: v.optional(consentsValidator),
  isProfileComplete: v.boolean(),
  _creationTime: v.number(),
});

// Medical ticket status validator
export const medicalTicketStatusValidator = v.union(
  v.literal("cancelled"),
  v.literal("completed"),
  v.literal("in_progress"),
  v.literal("on_hold")
);

// Medical ticket next steps validator
export const medicalTicketNextStepsValidator = v.union(
  v.literal("vapi_appointment"),
  v.literal("vapi_prescription")
);

// Medical ticket validator
export const medicalTicketValidator = v.object({
  _id: v.id("medicalTickets"),
  userId: v.id("users"),
  profileId: v.id("profiles"),
  patientId: v.id("patients"),
  status: medicalTicketStatusValidator,
  nextSteps: v.optional(medicalTicketNextStepsValidator),
  notes: v.optional(v.string()),
  createdAt: v.number(),
  _creationTime: v.number(),
});
