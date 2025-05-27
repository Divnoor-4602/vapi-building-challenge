import { query, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import {
  genderValidator,
  addressValidator,
  communicationPreferencesValidator,
  emergencyContactValidator,
  medicalHistoryValidator,
  insuranceValidator,
  consentsValidator,
  userValidator,
  profileValidator,
} from "../lib/convex/validators";

// Helper function to ensure one-to-one relationship between user and profile
async function ensureUniqueProfile(ctx: MutationCtx, userId: Id<"users">) {
  const existingProfile = await ctx.db
    .query("profiles")
    .withIndex("byUserId", (q) => q.eq("userId", userId))
    .unique();

  if (existingProfile) {
    throw new Error(
      "User already has a profile. Each user can only have one profile."
    );
  }
}

export const getUserProfileByEmail = query({
  args: {
    email: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      user: userValidator,
      profile: v.union(v.null(), profileValidator),
    })
  ),
  handler: async (ctx, args) => {
    // First, find the user by email using the index
    const user = await ctx.db
      .query("users")
      .withIndex("byEmail", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      return null;
    }

    // Then get the corresponding profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .unique();

    return {
      user,
      profile: profile ?? null,
    };
  },
});

export const createUserProfileByEmail = internalMutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    dateOfBirth: v.string(),
    gender: genderValidator,
    phoneNumber: v.string(),
    address: v.optional(addressValidator),
    communicationPreferences: v.optional(communicationPreferencesValidator),
    emergencyContact: v.optional(emergencyContactValidator),
    medicalHistory: v.optional(medicalHistoryValidator),
    insurance: v.optional(insuranceValidator),
    consents: v.optional(consentsValidator),
  },
  returns: v.union(
    v.null(),
    v.object({
      user: userValidator,
      profile: v.id("profiles"),
    })
  ),
  handler: async (ctx, args) => {
    // Check if the user exists
    const user = await ctx.db
      .query("users")
      .withIndex("byEmail", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      return null;
    }

    // Ensure one-to-one relationship: throw error if profile already exists
    await ensureUniqueProfile(ctx, user._id);

    // Check if profile should be marked as complete
    const isComplete = !!(
      args.firstName &&
      args.lastName &&
      args.dateOfBirth &&
      args.phoneNumber &&
      args.address &&
      args.communicationPreferences &&
      args.medicalHistory &&
      args.consents
    );

    // Create the profile
    const newProfile = await ctx.db.insert("profiles", {
      userId: user._id,
      firstName: args.firstName,
      lastName: args.lastName,
      dateOfBirth: args.dateOfBirth,
      gender: args.gender,
      phoneNumber: args.phoneNumber ?? "",
      address: args.address,
      communicationPreferences: args.communicationPreferences ?? {
        email: false,
        sms: false,
        phone: false,
      },
      emergencyContact: args.emergencyContact,
      medicalHistory: args.medicalHistory,
      insurance: args.insurance,
      consents: args.consents,
      isProfileComplete: isComplete,
    });

    return { user, profile: newProfile };
  },
});

export const updateUserProfileByEmail = internalMutation({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(genderValidator),
    phoneNumber: v.optional(v.string()),
    address: v.optional(addressValidator),
    communicationPreferences: v.optional(communicationPreferencesValidator),
    emergencyContact: v.optional(emergencyContactValidator),
    medicalHistory: v.optional(medicalHistoryValidator),
    insurance: v.optional(insuranceValidator),
    consents: v.optional(consentsValidator),
  },
  returns: v.union(
    v.null(),
    v.object({
      user: userValidator,
      profile: profileValidator,
    })
  ),
  handler: async (ctx, args) => {
    console.log("updateUserProfileByEmail called with args:", args);

    // Find the user by email
    const user = await ctx.db
      .query("users")
      .withIndex("byEmail", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      console.log("User not found for email:", args.email);
      return null;
    }

    console.log("User found:", user._id);

    // Find the existing profile
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .unique();

    if (!existingProfile) {
      console.log("Profile not found for user:", user._id);
      return null;
    }

    console.log("Existing profile found:", existingProfile._id);

    // Build update object with only provided fields
    const updateData: Partial<{
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: "male" | "female" | "other" | "prefer_not_to_say";
      phoneNumber: string;
      address: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
      };
      communicationPreferences: {
        email: boolean;
        sms: boolean;
        phone: boolean;
      };
      emergencyContact: {
        name: string;
        relationship: string;
        phoneNumber: string;
      };
      medicalHistory: {
        allergies: string[];
        currentMedications: {
          name: string;
          dosage: string;
          frequency: string;
        }[];
        chronicConditions: string[];
        previousSurgeries: {
          procedure: string;
          year: string;
        }[];
        familyHistory?: string[];
      };
      insurance: {
        provider: string;
        policyNumber: string;
        groupNumber?: string;
        subscriberName: string;
        relationshipToSubscriber: string;
      };
      consents: {
        treatmentConsent: boolean;
        dataProcessingConsent: boolean;
        marketingConsent: boolean;
        consentTimestamp: number;
      };
      isProfileComplete: boolean;
    }> = {};

    if (args.firstName !== undefined) updateData.firstName = args.firstName;
    if (args.lastName !== undefined) updateData.lastName = args.lastName;
    if (args.dateOfBirth !== undefined)
      updateData.dateOfBirth = args.dateOfBirth;
    if (args.gender !== undefined) updateData.gender = args.gender;
    if (args.phoneNumber !== undefined)
      updateData.phoneNumber = args.phoneNumber;
    if (args.address !== undefined) updateData.address = args.address;
    if (args.communicationPreferences !== undefined) {
      updateData.communicationPreferences = args.communicationPreferences;
    }
    if (args.emergencyContact !== undefined) {
      updateData.emergencyContact = args.emergencyContact;
    }
    if (args.medicalHistory !== undefined) {
      updateData.medicalHistory = args.medicalHistory;
    }
    if (args.insurance !== undefined) {
      updateData.insurance = args.insurance;
    }
    if (args.consents !== undefined) {
      updateData.consents = args.consents;
    }

    console.log("Update data to be applied:", updateData);

    // Check if we have any data to update
    if (Object.keys(updateData).length === 0) {
      console.log("No update data provided, returning existing profile");
      return {
        user,
        profile: existingProfile,
      };
    }

    // Check if profile should be marked as complete
    const updatedProfile = { ...existingProfile, ...updateData };
    const isComplete = !!(
      updatedProfile.firstName &&
      updatedProfile.lastName &&
      updatedProfile.dateOfBirth &&
      updatedProfile.phoneNumber &&
      updatedProfile.address &&
      updatedProfile.communicationPreferences &&
      updatedProfile.medicalHistory &&
      updatedProfile.consents
    );

    updateData.isProfileComplete = isComplete;

    console.log("Profile completeness check:", {
      firstName: !!updatedProfile.firstName,
      lastName: !!updatedProfile.lastName,
      dateOfBirth: !!updatedProfile.dateOfBirth,
      phoneNumber: !!updatedProfile.phoneNumber,
      address: !!updatedProfile.address,
      communicationPreferences: !!updatedProfile.communicationPreferences,
      medicalHistory: !!updatedProfile.medicalHistory,
      consents: !!updatedProfile.consents,
      isComplete,
    });

    // Update the profile
    console.log("Patching profile with:", updateData);
    await ctx.db.patch(existingProfile._id, updateData);

    // Return the updated profile
    const profile = await ctx.db.get(existingProfile._id);
    if (!profile) {
      console.log("Failed to retrieve updated profile");
      return null;
    }

    console.log("Successfully updated profile:", profile);

    return {
      user,
      profile,
    };
  },
});

export const getProfileMissingFields = query({
  args: {
    email: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      missingFields: v.array(v.string()),
      isProfileComplete: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    // Get the user profile
    const userProfile = await ctx.db
      .query("users")
      .withIndex("byEmail", (q) => q.eq("email", args.email))
      .unique();

    if (!userProfile) {
      return null;
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("byUserId", (q) => q.eq("userId", userProfile._id))
      .unique();

    if (!profile) {
      return null;
    }

    const missingFields: Array<string> = [];

    // Check required demographic fields
    if (!profile.firstName) missingFields.push("firstName");
    if (!profile.lastName) missingFields.push("lastName");
    if (!profile.dateOfBirth) missingFields.push("dateOfBirth");
    if (!profile.phoneNumber) missingFields.push("phoneNumber");

    // Check optional but important demographic fields
    if (!profile.address) missingFields.push("address");
    if (
      !profile.communicationPreferences ||
      (!profile.communicationPreferences.email &&
        !profile.communicationPreferences.sms &&
        !profile.communicationPreferences.phone)
    ) {
      missingFields.push("communicationPreferences");
    }

    // Check medical history fields
    if (!profile.medicalHistory) {
      missingFields.push("medicalHistory");
    }

    // Check consents
    if (!profile.consents) {
      missingFields.push("consents");
    }

    return {
      missingFields,
      isProfileComplete: missingFields.length === 0,
    };
  },
});

// Actions for API integration (these call the mutations internally)
export const createPatientProfileAction = action({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    dateOfBirth: v.string(),
    gender: genderValidator,
    phoneNumber: v.string(),
    address: v.optional(addressValidator),
    communicationPreferences: v.optional(communicationPreferencesValidator),
    emergencyContact: v.optional(emergencyContactValidator),
    medicalHistory: v.optional(medicalHistoryValidator),
    insurance: v.optional(insuranceValidator),
    consents: v.optional(consentsValidator),
  },
  returns: v.union(
    v.null(),
    v.object({
      user: userValidator,
      profile: v.id("profiles"),
    })
  ),
  handler: async (
    ctx,
    args
  ): Promise<{
    user: {
      _id: Id<"users">;
      clerkId: string;
      name: string;
      email: string;
      avatarUrl?: string;
      userType: "user" | "patient" | "admin";
      isActive: boolean;
      lastLoginAt?: number;
      _creationTime: number;
    };
    profile: Id<"profiles">;
  } | null> => {
    console.log("createPatientProfileAction called with args:", args);

    // Call the internal mutation
    const result = await ctx.runMutation(
      internal.profiles.createUserProfileByEmail,
      args
    );

    console.log("createPatientProfileAction result:", result);
    return result;
  },
});

export const updatePatientProfileAction = action({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(genderValidator),
    phoneNumber: v.optional(v.string()),
    address: v.optional(addressValidator),
    communicationPreferences: v.optional(communicationPreferencesValidator),
    emergencyContact: v.optional(emergencyContactValidator),
    medicalHistory: v.optional(medicalHistoryValidator),
    insurance: v.optional(insuranceValidator),
    consents: v.optional(consentsValidator),
  },
  returns: v.union(
    v.null(),
    v.object({
      user: userValidator,
      profile: profileValidator,
    })
  ),
  handler: async (
    ctx,
    args
  ): Promise<{
    user: {
      _id: Id<"users">;
      clerkId: string;
      name: string;
      email: string;
      avatarUrl?: string;
      userType: "user" | "patient" | "admin";
      isActive: boolean;
      lastLoginAt?: number;
      _creationTime: number;
    };
    profile: {
      _id: Id<"profiles">;
      userId: Id<"users">;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender?: "male" | "female" | "other" | "prefer_not_to_say";
      phoneNumber: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
      };
      communicationPreferences: {
        email: boolean;
        sms: boolean;
        phone: boolean;
      };
      emergencyContact?: {
        name: string;
        relationship: string;
        phoneNumber: string;
      };
      medicalHistory?: {
        allergies: string[];
        currentMedications: {
          name: string;
          dosage: string;
          frequency: string;
        }[];
        chronicConditions: string[];
        previousSurgeries: {
          procedure: string;
          year: string;
        }[];
        familyHistory?: string[];
      };
      insurance?: {
        provider: string;
        policyNumber: string;
        groupNumber?: string;
        subscriberName: string;
        relationshipToSubscriber: string;
      };
      consents?: {
        treatmentConsent: boolean;
        dataProcessingConsent: boolean;
        marketingConsent: boolean;
        consentTimestamp: number;
      };
      isProfileComplete: boolean;
      _creationTime: number;
    };
  } | null> => {
    console.log("updatePatientProfileAction called with args:", args);

    // Call the internal mutation
    const result = await ctx.runMutation(
      internal.profiles.updateUserProfileByEmail,
      args
    );

    console.log("updatePatientProfileAction result:", result);
    return result;
  },
});
