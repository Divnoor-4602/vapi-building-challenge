export type VapiToolHandler = (
  args: Record<string, unknown>,
  toolCallId: string
) => Promise<{
  results: Array<{
    toolCallId: string;
    result:
      | string
      | {
          type: string;
          object: unknown;
        };
  }>;
}>;

export interface PatientProfileArgs {
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  communicationPreferences?: {
    email: boolean;
    sms: boolean;
    phone: boolean;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
}

export interface VapiToolCall {
  arguments: Record<string, unknown>;
  toolCallId: string;
  functionName: string;
}

export type PatientProfileFunction =
  | "checkPatientProfile"
  | "getProfileMissingFields"
  | "createPatientProfile"
  | "updatePatientProfile"
  | "createPatient";
