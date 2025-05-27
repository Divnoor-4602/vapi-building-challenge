import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a prescription linked to a medical ticket
export const createPrescription = mutation({
  args: {
    patientId: v.id("patients"),
    ticketId: v.id("medicalTickets"),
    prescriptionDetails: v.object({
      medication: v.string(),
      dosage: v.string(),
      frequency: v.string(),
      instructions: v.string(),
    }),
    notes: v.optional(v.string()),
  },
  returns: v.id("prescriptions"),
  handler: async (ctx, args) => {
    // Check if prescription already exists for this ticket
    const existingPrescription = await ctx.db
      .query("prescriptions")
      .withIndex("byTicketId", (q) => q.eq("ticketId", args.ticketId))
      .unique();

    if (existingPrescription) {
      throw new Error("Prescription already exists for this medical ticket");
    }

    // Verify the ticket exists
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Medical ticket not found");
    }

    // Verify the patient exists
    const patient = await ctx.db.get(args.patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    // Create the prescription
    const prescriptionId = await ctx.db.insert("prescriptions", {
      patientId: args.patientId,
      ticketId: args.ticketId,
      prescriptionDetails: args.prescriptionDetails,
      notes: args.notes,
    });

    return prescriptionId;
  },
});

// Get prescription details by ticket ID
export const getPrescription = query({
  args: {
    ticketId: v.id("medicalTickets"),
  },
  returns: v.union(
    v.object({
      prescription: v.object({
        _id: v.id("prescriptions"),
        _creationTime: v.number(),
        patientId: v.id("patients"),
        ticketId: v.id("medicalTickets"),
        prescriptionDetails: v.object({
          medication: v.string(),
          dosage: v.string(),
          frequency: v.string(),
          instructions: v.string(),
        }),
        notes: v.optional(v.string()),
      }),
      patient: v.object({
        _id: v.id("patients"),
        _creationTime: v.number(),
        userId: v.id("users"),
        profileId: v.id("profiles"),
        chiefComplaint: v.string(),
        currentSymptoms: v.array(
          v.object({
            symptom: v.string(),
            severity: v.union(
              v.literal("mild"),
              v.literal("moderate"),
              v.literal("severe")
            ),
            duration: v.string(),
            notes: v.optional(v.string()),
          })
        ),
        recommendedAction: v.optional(
          v.union(
            v.literal("schedule_appointment"),
            v.literal("urgent_care"),
            v.literal("emergency"),
            v.literal("prescription_consultation")
          )
        ),
        assignedProviderId: v.optional(v.string()),
        requiresFollowUp: v.boolean(),
        followUpNotes: v.optional(v.string()),
      }),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    // Get prescription by ticket ID
    const prescription = await ctx.db
      .query("prescriptions")
      .withIndex("byTicketId", (q) => q.eq("ticketId", args.ticketId))
      .unique();

    if (!prescription) {
      return null;
    }

    // Get patient details
    const patient = await ctx.db.get(prescription.patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    return {
      prescription,
      patient,
    };
  },
});

// Test function to create a sample prescription
export const createTestPrescription = mutation({
  args: {
    ticketId: v.id("medicalTickets"),
  },
  returns: v.id("prescriptions"),
  handler: async (ctx, args) => {
    // Get the ticket to find the patient
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Medical ticket not found");
    }

    // Check if prescription already exists
    const existingPrescription = await ctx.db
      .query("prescriptions")
      .withIndex("byTicketId", (q) => q.eq("ticketId", args.ticketId))
      .unique();

    if (existingPrescription) {
      return existingPrescription._id;
    }

    // Create sample prescription data
    const samplePrescriptions = [
      {
        medication: "Amoxicillin",
        dosage: "500mg",
        frequency: "three times daily",
        instructions:
          "Take with food. Complete the full course even if you feel better.",
      },
      {
        medication: "Ibuprofen",
        dosage: "400mg",
        frequency: "every 6-8 hours as needed",
        instructions:
          "Take with food or milk to prevent stomach upset. Do not exceed 1200mg in 24 hours.",
      },
      {
        medication: "Lisinopril",
        dosage: "10mg",
        frequency: "once daily",
        instructions:
          "Take at the same time each day. Monitor blood pressure regularly.",
      },
    ];

    // Select a random prescription for testing
    const randomPrescription =
      samplePrescriptions[
        Math.floor(Math.random() * samplePrescriptions.length)
      ];

    // Create the test prescription
    const prescriptionId = await ctx.db.insert("prescriptions", {
      patientId: ticket.patientId,
      ticketId: args.ticketId,
      prescriptionDetails: randomPrescription,
      notes:
        "Sample prescription created for testing purposes. Please consult with your doctor for any questions.",
    });

    return prescriptionId;
  },
});
