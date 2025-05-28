import { z } from "zod";

// Gender schema
export const genderSchema = z.enum([
  "male",
  "female",
  "other",
  "prefer_not_to_say",
]);

// Address schema
export const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string(),
});

// Communication preferences schema
export const communicationPreferencesSchema = z.object({
  email: z.boolean(),
  sms: z.boolean(),
  phone: z.boolean(),
});

// Emergency contact schema
export const emergencyContactSchema = z.object({
  name: z.string(),
  relationship: z.string(),
  phoneNumber: z.string(),
});

// Medication schema
export const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
});

// Surgery schema
export const surgerySchema = z.object({
  procedure: z.string().min(1, "Procedure name is required"),
  year: z
    .string()
    .min(1, "Year is required")
    .regex(/^\d{4}$/, "Please enter a valid year (e.g., 2020)"),
});

// Medical history schema
export const medicalHistorySchema = z.object({
  allergies: z.array(z.string()).default([]),
  currentMedications: z.array(medicationSchema).default([]),
  chronicConditions: z.array(z.string()).default([]),
  previousSurgeries: z.array(surgerySchema).default([]),
  familyHistory: z.array(z.string()).default([]),
});

// Insurance schema
export const insuranceSchema = z.object({
  provider: z.string(),
  policyNumber: z.string(),
  groupNumber: z.string(),
  subscriberName: z.string(),
  relationshipToSubscriber: z.string(),
});

// Consents schema
export const consentsSchema = z.object({
  treatmentConsent: z.boolean().refine((val) => val === true, {
    message: "Treatment consent is required to proceed",
  }),
  dataProcessingConsent: z.boolean().refine((val) => val === true, {
    message: "Data processing consent is required to proceed",
  }),
  marketingConsent: z.boolean(),
  consentTimestamp: z.number().default(() => Date.now()),
});

// Complete profile form schema
export const profileFormSchema = z.object({
  // Personal Information - Required
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const today = new Date();
      const birthDate = new Date(date);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 120;
    }, "Please enter a valid date of birth (age must be between 13-120)"),
  gender: genderSchema.optional(),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),

  // Address - Has defaults in form
  address: addressSchema,

  // Communication Preferences - Required
  communicationPreferences: communicationPreferencesSchema,

  // Emergency Contact - Has defaults in form
  emergencyContact: emergencyContactSchema,

  // Medical History - Has defaults in form
  medicalHistory: medicalHistorySchema,

  // Insurance - Has defaults in form
  insurance: insuranceSchema,

  // Consents - Required
  consents: consentsSchema,
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type Gender = z.infer<typeof genderSchema>;
export type Address = z.infer<typeof addressSchema>;
export type CommunicationPreferences = z.infer<
  typeof communicationPreferencesSchema
>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;
export type Medication = z.infer<typeof medicationSchema>;
export type Surgery = z.infer<typeof surgerySchema>;
export type MedicalHistory = z.infer<typeof medicalHistorySchema>;
export type Insurance = z.infer<typeof insuranceSchema>;
export type Consents = z.infer<typeof consentsSchema>;
