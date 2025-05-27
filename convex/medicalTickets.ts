import { action, internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import {
  medicalTicketStatusValidator,
  medicalTicketNextStepsValidator,
} from "../lib/convex/validators";

export const createMedicalTicket = internalMutation({
  args: {
    userId: v.id("users"),
    profileId: v.id("profiles"),
    patientId: v.id("patients"),
    status: v.optional(medicalTicketStatusValidator),
    nextSteps: v.optional(medicalTicketNextStepsValidator),
    notes: v.optional(v.string()),
  },
  returns: v.id("medicalTickets"),
  handler: async (ctx, args) => {
    // Verify that the user exists and is active
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.isActive) {
      throw new Error("User account is not active");
    }

    // Verify that the profile exists
    const profile = await ctx.db.get(args.profileId);
    if (!profile) {
      throw new Error("Profile not found");
    }

    // Verify that the patient exists
    const patient = await ctx.db.get(args.patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    // Verify that the profile belongs to the user
    if (profile.userId !== args.userId) {
      throw new Error("Profile does not belong to the specified user");
    }

    // Verify that the patient belongs to the user and profile
    if (
      patient.userId !== args.userId ||
      patient.profileId !== args.profileId
    ) {
      throw new Error(
        "Patient does not belong to the specified user and profile"
      );
    }

    // Check if the patient already has an active ticket
    const existingActiveTicket = await ctx.db
      .query("medicalTickets")
      .withIndex("byPatientId", (q) => q.eq("patientId", args.patientId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "in_progress"),
          q.eq(q.field("status"), "on_hold")
        )
      )
      .first();

    if (existingActiveTicket) {
      throw new Error(
        "Patient already has an active medical ticket. Only one active ticket is allowed per patient"
      );
    }

    // Set default status to "in_progress" if not provided
    const ticketStatus = args.status ?? "in_progress";

    // Create the medical ticket record
    const ticketId = await ctx.db.insert("medicalTickets", {
      userId: args.userId,
      profileId: args.profileId,
      patientId: args.patientId,
      status: ticketStatus,
      nextSteps: args.nextSteps,
      notes: args.notes,
      createdAt: Date.now(),
    });

    return ticketId;
  },
});

export const createMedicalTicketAction = action({
  args: {
    userId: v.id("users"),
    profileId: v.id("profiles"),
    patientId: v.id("patients"),
    status: v.optional(medicalTicketStatusValidator),
    nextSteps: v.optional(medicalTicketNextStepsValidator),
    notes: v.optional(v.string()),
  },
  returns: v.id("medicalTickets"),
  handler: async (ctx, args): Promise<Id<"medicalTickets">> => {
    console.log("createMedicalTicketAction called with args:", args);

    // Call the internal mutation
    const ticketId: Id<"medicalTickets"> = await ctx.runMutation(
      internal.medicalTickets.createMedicalTicket,
      args
    );

    console.log("createMedicalTicketAction result:", ticketId);
    return ticketId;
  },
});

export const checkMedicalTicketStatus = query({
  args: {
    ticketId: v.id("medicalTickets"),
  },
  handler: async (ctx, args) => {
    const { ticketId } = args;

    if (!ticketId) {
      throw new Error("Ticket ID is required");
    }

    const ticket = await ctx.db.get(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    return { status: ticket.status, ticket };
  },
});

export const updateMedicalTicketNextSteps = internalMutation({
  args: {
    ticketId: v.id("medicalTickets"),
    nextSteps: medicalTicketNextStepsValidator,
    status: v.optional(medicalTicketStatusValidator),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Verify that the ticket exists
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Medical ticket not found");
    }

    // Build update object
    const updateData: {
      nextSteps: "vapi_appointment" | "vapi_prescription";
      status?: "cancelled" | "completed" | "in_progress" | "on_hold";
      notes?: string;
    } = {
      nextSteps: args.nextSteps,
    };

    if (args.status !== undefined) {
      updateData.status = args.status;
    }

    if (args.notes !== undefined) {
      updateData.notes = args.notes;
    }

    // Update the ticket
    await ctx.db.patch(args.ticketId, updateData);

    return null;
  },
});
