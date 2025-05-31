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

// Create multiple prescriptions for a medical ticket
export const createMultiplePrescriptions = mutation({
  args: {
    patientId: v.id("patients"),
    ticketId: v.id("medicalTickets"),
    prescriptions: v.array(
      v.object({
        medication: v.string(),
        dosage: v.string(),
        frequency: v.string(),
        instructions: v.string(),
      })
    ),
    notes: v.optional(v.string()),
  },
  returns: v.array(v.id("prescriptions")),
  handler: async (ctx, args) => {
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

    // Create all prescriptions
    const prescriptionIds = [];
    for (const prescriptionData of args.prescriptions) {
      const prescriptionId = await ctx.db.insert("prescriptions", {
        patientId: args.patientId,
        ticketId: args.ticketId,
        prescriptionDetails: prescriptionData,
        notes: args.notes,
      });
      prescriptionIds.push(prescriptionId);
    }

    return prescriptionIds;
  },
});

// Get prescriptions for a user by Clerk ID (for the most recent medical tickets)
export const getPrescriptionsForUser = query({
  args: {
    clerkId: v.string(),
    limit: v.optional(v.number()), // Optional limit, defaults to 3
  },
  returns: v.array(
    v.object({
      _id: v.id("prescriptions"),
      _creationTime: v.number(),
      prescriptionDetails: v.object({
        medication: v.string(),
        dosage: v.string(),
        frequency: v.string(),
        instructions: v.string(),
      }),
      notes: v.optional(v.string()),

      // Ticket information
      ticket: v.object({
        _id: v.id("medicalTickets"),
        _creationTime: v.number(),
        status: v.union(
          v.literal("cancelled"),
          v.literal("completed"),
          v.literal("in_progress"),
          v.literal("on_hold")
        ),
        createdAt: v.number(),
      }),

      // Patient information (chief complaint)
      patient: v.object({
        _id: v.id("patients"),
        chiefComplaint: v.string(),
      }),

      // Profile information (prescribing context)
      profile: v.object({
        firstName: v.string(),
        lastName: v.string(),
      }),
    })
  ),
  handler: async (ctx, args) => {
    const prescriptionLimit = args.limit ?? 3; // Default to 3 prescriptions

    // First, find the user by Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      // Return empty array if user not found
      return [];
    }

    // Get a larger number of recent medical tickets to ensure we have enough prescriptions
    const recentTickets = await ctx.db
      .query("medicalTickets")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(10); // Get more tickets to ensure we have enough prescriptions

    // Get prescriptions for these tickets
    const prescriptionsWithContext = [];

    for (const ticket of recentTickets) {
      // Get prescriptions for this ticket
      const prescriptions = await ctx.db
        .query("prescriptions")
        .withIndex("byTicketId", (q) => q.eq("ticketId", ticket._id))
        .collect();

      // Get patient and profile data for context
      const patient = await ctx.db.get(ticket.patientId);
      const profile = await ctx.db.get(ticket.profileId);

      if (!patient || !profile) {
        continue; // Skip if we can't get the required data
      }

      // Add each prescription with context
      for (const prescription of prescriptions) {
        prescriptionsWithContext.push({
          _id: prescription._id,
          _creationTime: prescription._creationTime,
          prescriptionDetails: prescription.prescriptionDetails,
          notes: prescription.notes,
          ticket: {
            _id: ticket._id,
            _creationTime: ticket._creationTime,
            status: ticket.status,
            createdAt: ticket.createdAt,
          },
          patient: {
            _id: patient._id,
            chiefComplaint: patient.chiefComplaint,
          },
          profile: {
            firstName: profile.firstName,
            lastName: profile.lastName,
          },
        });
      }
    }

    // Sort by creation time (most recent first) and limit to the requested number
    prescriptionsWithContext.sort((a, b) => b._creationTime - a._creationTime);

    // Return only the requested number of prescriptions
    return prescriptionsWithContext.slice(0, prescriptionLimit);
  },
});

// Check for recent prescription creation (for polling during VAPI calls)
export const checkRecentPrescriptionCreation = query({
  args: {
    userId: v.id("users"),
    profileId: v.id("profiles"),
    afterTimestamp: v.number(), // Only check prescriptions created after this timestamp
  },
  returns: v.union(
    v.null(),
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
        chiefComplaint: v.string(),
      }),
      ticket: v.object({
        _id: v.id("medicalTickets"),
        status: v.union(
          v.literal("cancelled"),
          v.literal("completed"),
          v.literal("in_progress"),
          v.literal("on_hold")
        ),
        createdAt: v.number(),
      }),
    })
  ),
  handler: async (ctx, args) => {
    const { userId, profileId, afterTimestamp } = args;

    // Find prescriptions created after the timestamp for this user/profile
    // First get the user's medical tickets
    const userTickets = await ctx.db
      .query("medicalTickets")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("profileId"), profileId))
      .collect();

    if (userTickets.length === 0) {
      return null;
    }

    // Find the most recent prescription created after the timestamp
    let mostRecentPrescription = null;
    let associatedPatient = null;
    let associatedTicket = null;

    for (const ticket of userTickets) {
      const prescriptions = await ctx.db
        .query("prescriptions")
        .withIndex("byTicketId", (q) => q.eq("ticketId", ticket._id))
        .filter((q) => q.gt(q.field("_creationTime"), afterTimestamp))
        .order("desc")
        .collect();

      if (prescriptions.length > 0) {
        const latestPrescription = prescriptions[0];

        if (
          !mostRecentPrescription ||
          latestPrescription._creationTime >
            mostRecentPrescription._creationTime
        ) {
          mostRecentPrescription = latestPrescription;
          associatedTicket = ticket;

          // Get patient information
          const patient = await ctx.db.get(ticket.patientId);
          if (patient) {
            associatedPatient = patient;
          }
        }
      }
    }

    if (!mostRecentPrescription || !associatedPatient || !associatedTicket) {
      return null;
    }

    return {
      prescription: {
        _id: mostRecentPrescription._id,
        _creationTime: mostRecentPrescription._creationTime,
        patientId: mostRecentPrescription.patientId,
        ticketId: mostRecentPrescription.ticketId,
        prescriptionDetails: mostRecentPrescription.prescriptionDetails,
        notes: mostRecentPrescription.notes,
      },
      patient: {
        _id: associatedPatient._id,
        chiefComplaint: associatedPatient.chiefComplaint,
      },
      ticket: {
        _id: associatedTicket._id,
        status: associatedTicket.status,
        createdAt: associatedTicket.createdAt,
      },
    };
  },
});
