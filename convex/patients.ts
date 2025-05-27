import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// Symptom validator for patient records
const symptomValidator = v.object({
  symptom: v.string(),
  severity: v.union(
    v.literal("mild"),
    v.literal("moderate"),
    v.literal("severe")
  ),
  duration: v.string(),
  notes: v.optional(v.string()),
});

export const createPatient = internalMutation({
  args: {
    userId: v.id("users"),
    profileId: v.id("profiles"),
    chiefComplaint: v.string(),
    currentSymptoms: v.array(symptomValidator),
    requiresFollowUp: v.optional(v.boolean()),
    followUpNotes: v.optional(v.string()),
  },
  returns: v.id("patients"),
  handler: async (ctx, args) => {
    // Verify that the user and profile exist
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const profile = await ctx.db.get(args.profileId);
    if (!profile) {
      throw new Error("Profile not found");
    }

    // Create the patient record
    const patientId = await ctx.db.insert("patients", {
      userId: args.userId,
      profileId: args.profileId,
      chiefComplaint: args.chiefComplaint,
      currentSymptoms: args.currentSymptoms,
      requiresFollowUp: args.requiresFollowUp ?? false,
      followUpNotes: args.followUpNotes,
    });

    return patientId;
  },
});

export const createPatientAction = action({
  args: {
    userId: v.id("users"),
    profileId: v.id("profiles"),
    chiefComplaint: v.string(),
    currentSymptoms: v.array(symptomValidator),
    requiresFollowUp: v.optional(v.boolean()),
    followUpNotes: v.optional(v.string()),
  },
  returns: v.id("patients"),
  handler: async (ctx, args): Promise<Id<"patients">> => {
    console.log("createPatientAction called with args:", args);

    // Call the internal mutation
    const patientId: Id<"patients"> = await ctx.runMutation(
      internal.patients.createPatient,
      args
    );

    console.log("createPatientAction result:", patientId);
    return patientId;
  },
});
