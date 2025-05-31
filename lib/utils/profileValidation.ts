import { type Doc } from "@/convex/_generated/dataModel";

type Profile = Doc<"profiles">;

export interface ProfileValidationResult {
  isComplete: boolean;
  missingFields: string[];
  missingCriticalFields: string[];
}

export function validateProfileForAppointment(
  profile: Profile | null
): ProfileValidationResult {
  if (!profile) {
    return {
      isComplete: false,
      missingFields: ["Complete profile required"],
      missingCriticalFields: ["Complete profile required"],
    };
  }

  const missingFields: string[] = [];
  const missingCriticalFields: string[] = [];

  // Critical fields for appointment booking
  if (!profile.firstName) {
    missingFields.push("First Name");
    missingCriticalFields.push("First Name");
  }

  if (!profile.lastName) {
    missingFields.push("Last Name");
    missingCriticalFields.push("Last Name");
  }

  if (!profile.phoneNumber) {
    missingFields.push("Phone Number");
    missingCriticalFields.push("Phone Number");
  }

  if (!profile.dateOfBirth) {
    missingFields.push("Date of Birth");
    missingCriticalFields.push("Date of Birth");
  }

  // Important but not critical fields
  if (!profile.gender) {
    missingFields.push("Gender");
  }

  if (
    !profile.address ||
    !profile.address.street ||
    !profile.address.city ||
    !profile.address.state
  ) {
    missingFields.push("Complete Address");
  }

  if (
    !profile.medicalHistory ||
    ((!profile.medicalHistory.allergies ||
      profile.medicalHistory.allergies.length === 0) &&
      (!profile.medicalHistory.currentMedications ||
        profile.medicalHistory.currentMedications.length === 0) &&
      (!profile.medicalHistory.chronicConditions ||
        profile.medicalHistory.chronicConditions.length === 0))
  ) {
    missingFields.push("Medical History");
  }

  if (
    !profile.insurance ||
    !profile.insurance.provider ||
    !profile.insurance.policyNumber
  ) {
    missingFields.push("Insurance Information");
  }

  if (
    !profile.emergencyContact ||
    !profile.emergencyContact.name ||
    !profile.emergencyContact.phoneNumber
  ) {
    missingFields.push("Emergency Contact");
  }

  if (
    !profile.consents?.treatmentConsent ||
    !profile.consents?.dataProcessingConsent
  ) {
    missingFields.push("Required Consents");
    missingCriticalFields.push("Required Consents");
  }

  const isComplete = missingCriticalFields.length === 0;

  return {
    isComplete,
    missingFields,
    missingCriticalFields,
  };
}

export function getProfileCompletionMessage(
  validation: ProfileValidationResult
): string {
  if (validation.isComplete) {
    return "Your profile is complete and ready for appointment booking.";
  }

  if (validation.missingCriticalFields.length > 0) {
    return `Please complete these required fields: ${validation.missingCriticalFields.join(", ")}. You can update your profile or complete the patient intake process.`;
  }

  if (validation.missingFields.length > 0) {
    return `For the best experience, please complete: ${validation.missingFields.join(", ")}. You can update your profile to add this information.`;
  }

  return "Please complete your profile to book appointments.";
}

export function getProfileCompletionPercentage(
  validation: ProfileValidationResult
): number {
  const totalFields = 8; // firstName, lastName, phone, dob, gender, address, medical, insurance, emergency
  const completedFields = totalFields - validation.missingFields.length;
  return Math.round((completedFields / totalFields) * 100);
}
