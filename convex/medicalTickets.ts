import { action, internalMutation, query, mutation } from "./_generated/server";
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

    // Verify that the ticket is in progress or on hold and has no next steps assigned
    if (ticket.status !== "in_progress" && ticket.status !== "on_hold") {
      throw new Error(
        "Can only assign next steps to tickets that are in progress or on hold"
      );
    }

    if (ticket.nextSteps !== undefined) {
      throw new Error("This ticket already has next steps assigned");
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

// Get active medical tickets for a user
export const getActiveTicketsForUser = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.array(
    v.object({
      _id: v.id("medicalTickets"),
      _creationTime: v.number(),
      userId: v.id("users"),
      profileId: v.id("profiles"),
      patientId: v.id("patients"),
      status: medicalTicketStatusValidator,
      nextSteps: v.optional(medicalTicketNextStepsValidator),
      notes: v.optional(v.string()),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    // Get all active tickets (in_progress or on_hold) for the user
    const activeTickets = await ctx.db
      .query("medicalTickets")
      .withIndex("byUserIdAndStatus", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "in_progress"),
          q.eq(q.field("status"), "on_hold")
        )
      )
      .order("desc")
      .collect();

    return activeTickets;
  },
});

// Get all medical tickets for a user with comprehensive data
export const getAllTicketsForUser = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.array(
    v.object({
      // Ticket information
      _id: v.id("medicalTickets"),
      _creationTime: v.number(),
      userId: v.id("users"),
      profileId: v.id("profiles"),
      patientId: v.id("patients"),
      status: medicalTicketStatusValidator,
      nextSteps: v.optional(medicalTicketNextStepsValidator),
      notes: v.optional(v.string()),
      createdAt: v.number(),

      // Patient information
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

      // Profile information
      profile: v.object({
        _id: v.id("profiles"),
        _creationTime: v.number(),
        userId: v.id("users"),
        firstName: v.string(),
        lastName: v.string(),
        dateOfBirth: v.string(),
        gender: v.optional(
          v.union(
            v.literal("male"),
            v.literal("female"),
            v.literal("other"),
            v.literal("prefer_not_to_say")
          )
        ),
        phoneNumber: v.string(),
        address: v.optional(
          v.object({
            street: v.optional(v.string()),
            city: v.optional(v.string()),
            state: v.optional(v.string()),
            zipCode: v.optional(v.string()),
            country: v.optional(v.string()),
          })
        ),
        communicationPreferences: v.object({
          email: v.boolean(),
          sms: v.boolean(),
          phone: v.boolean(),
        }),
        emergencyContact: v.optional(
          v.object({
            name: v.string(),
            relationship: v.string(),
            phoneNumber: v.string(),
          })
        ),
        medicalHistory: v.optional(
          v.object({
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
          })
        ),
        insurance: v.optional(
          v.object({
            provider: v.string(),
            policyNumber: v.string(),
            groupNumber: v.optional(v.string()),
            subscriberName: v.string(),
            relationshipToSubscriber: v.string(),
          })
        ),
        consents: v.optional(
          v.object({
            treatmentConsent: v.boolean(),
            dataProcessingConsent: v.boolean(),
            marketingConsent: v.boolean(),
            consentTimestamp: v.number(),
          })
        ),
        isProfileComplete: v.boolean(),
      }),

      // Prescriptions (if any)
      prescriptions: v.array(
        v.object({
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
        })
      ),
    })
  ),
  handler: async (ctx, args) => {
    // Get all tickets for the user
    const tickets = await ctx.db
      .query("medicalTickets")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    // Fetch related data for each ticket
    const ticketsWithData = await Promise.all(
      tickets.map(async (ticket) => {
        // Get patient data
        const patient = await ctx.db.get(ticket.patientId);
        if (!patient) {
          throw new Error(`Patient not found for ticket ${ticket._id}`);
        }

        // Get profile data
        const profile = await ctx.db.get(ticket.profileId);
        if (!profile) {
          throw new Error(`Profile not found for ticket ${ticket._id}`);
        }

        // Get prescriptions for this ticket
        const prescriptions = await ctx.db
          .query("prescriptions")
          .withIndex("byTicketId", (q) => q.eq("ticketId", ticket._id))
          .collect();

        return {
          ...ticket,
          patient,
          profile,
          prescriptions,
        };
      })
    );

    return ticketsWithData;
  },
});

// Get all medical tickets for a user with comprehensive data using Clerk ID
export const getAllTicketsForUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  returns: v.array(
    v.object({
      // Ticket information
      _id: v.id("medicalTickets"),
      _creationTime: v.number(),
      userId: v.id("users"),
      profileId: v.id("profiles"),
      patientId: v.id("patients"),
      status: medicalTicketStatusValidator,
      nextSteps: v.optional(medicalTicketNextStepsValidator),
      notes: v.optional(v.string()),
      createdAt: v.number(),

      // Patient information
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

      // Profile information
      profile: v.object({
        _id: v.id("profiles"),
        _creationTime: v.number(),
        userId: v.id("users"),
        firstName: v.string(),
        lastName: v.string(),
        dateOfBirth: v.string(),
        gender: v.optional(
          v.union(
            v.literal("male"),
            v.literal("female"),
            v.literal("other"),
            v.literal("prefer_not_to_say")
          )
        ),
        phoneNumber: v.string(),
        address: v.optional(
          v.object({
            street: v.optional(v.string()),
            city: v.optional(v.string()),
            state: v.optional(v.string()),
            zipCode: v.optional(v.string()),
            country: v.optional(v.string()),
          })
        ),
        communicationPreferences: v.object({
          email: v.boolean(),
          sms: v.boolean(),
          phone: v.boolean(),
        }),
        emergencyContact: v.optional(
          v.object({
            name: v.string(),
            relationship: v.string(),
            phoneNumber: v.string(),
          })
        ),
        medicalHistory: v.optional(
          v.object({
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
          })
        ),
        insurance: v.optional(
          v.object({
            provider: v.string(),
            policyNumber: v.string(),
            groupNumber: v.optional(v.string()),
            subscriberName: v.string(),
            relationshipToSubscriber: v.string(),
          })
        ),
        consents: v.optional(
          v.object({
            treatmentConsent: v.boolean(),
            dataProcessingConsent: v.boolean(),
            marketingConsent: v.boolean(),
            consentTimestamp: v.number(),
          })
        ),
        isProfileComplete: v.boolean(),
      }),

      // Prescriptions (if any)
      prescriptions: v.array(
        v.object({
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
        })
      ),
    })
  ),
  handler: async (ctx, args) => {
    // First, find the user by Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      // Return empty array if user not found
      return [];
    }

    // Get all tickets for the user
    const tickets = await ctx.db
      .query("medicalTickets")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    // Fetch related data for each ticket
    const ticketsWithData = await Promise.all(
      tickets.map(async (ticket) => {
        // Get patient data
        const patient = await ctx.db.get(ticket.patientId);
        if (!patient) {
          throw new Error(`Patient not found for ticket ${ticket._id}`);
        }

        // Get profile data
        const profile = await ctx.db.get(ticket.profileId);
        if (!profile) {
          throw new Error(`Profile not found for ticket ${ticket._id}`);
        }

        // Get prescriptions for this ticket
        const prescriptions = await ctx.db
          .query("prescriptions")
          .withIndex("byTicketId", (q) => q.eq("ticketId", ticket._id))
          .collect();

        return {
          ...ticket,
          patient,
          profile,
          prescriptions,
        };
      })
    );

    return ticketsWithData;
  },
});

// Get incoming medical tickets for doctors (in_progress with no next steps)
export const getIncomingTicketsForDoctors = query({
  args: {},
  returns: v.array(
    v.object({
      // Ticket information
      _id: v.id("medicalTickets"),
      _creationTime: v.number(),
      userId: v.id("users"),
      profileId: v.id("profiles"),
      patientId: v.id("patients"),
      status: medicalTicketStatusValidator,
      nextSteps: v.optional(medicalTicketNextStepsValidator),
      notes: v.optional(v.string()),
      createdAt: v.number(),

      // Patient information
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

      // Profile information
      profile: v.object({
        _id: v.id("profiles"),
        _creationTime: v.number(),
        userId: v.id("users"),
        firstName: v.string(),
        lastName: v.string(),
        dateOfBirth: v.string(),
        gender: v.optional(
          v.union(
            v.literal("male"),
            v.literal("female"),
            v.literal("other"),
            v.literal("prefer_not_to_say")
          )
        ),
        phoneNumber: v.string(),
        address: v.optional(
          v.object({
            street: v.optional(v.string()),
            city: v.optional(v.string()),
            state: v.optional(v.string()),
            zipCode: v.optional(v.string()),
            country: v.optional(v.string()),
          })
        ),
        communicationPreferences: v.object({
          email: v.boolean(),
          sms: v.boolean(),
          phone: v.boolean(),
        }),
        emergencyContact: v.optional(
          v.object({
            name: v.string(),
            relationship: v.string(),
            phoneNumber: v.string(),
          })
        ),
        medicalHistory: v.optional(
          v.object({
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
          })
        ),
        insurance: v.optional(
          v.object({
            provider: v.string(),
            policyNumber: v.string(),
            groupNumber: v.optional(v.string()),
            subscriberName: v.string(),
            relationshipToSubscriber: v.string(),
          })
        ),
        consents: v.optional(
          v.object({
            treatmentConsent: v.boolean(),
            dataProcessingConsent: v.boolean(),
            marketingConsent: v.boolean(),
            consentTimestamp: v.number(),
          })
        ),
        isProfileComplete: v.boolean(),
      }),
    })
  ),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handler: async (ctx, _args) => {
    // Get all tickets that are in_progress OR on_hold and have no next steps assigned
    const incomingTickets = await ctx.db
      .query("medicalTickets")
      .filter((q) =>
        q.and(
          q.or(
            q.eq(q.field("status"), "in_progress"),
            q.eq(q.field("status"), "on_hold")
          ),
          q.eq(q.field("nextSteps"), undefined)
        )
      )
      .order("desc")
      .collect();

    // Fetch related data for each ticket
    const ticketsWithData = await Promise.all(
      incomingTickets.map(async (ticket) => {
        // Get patient data
        const patient = await ctx.db.get(ticket.patientId);
        if (!patient) {
          throw new Error(`Patient not found for ticket ${ticket._id}`);
        }

        // Get profile data
        const profile = await ctx.db.get(ticket.profileId);
        if (!profile) {
          throw new Error(`Profile not found for ticket ${ticket._id}`);
        }

        return {
          ...ticket,
          patient,
          profile,
        };
      })
    );

    return ticketsWithData;
  },
});

// Assign next steps to a medical ticket (for doctors)
export const assignNextStepsToTicket = mutation({
  args: {
    ticketId: v.id("medicalTickets"),
    nextSteps: medicalTicketNextStepsValidator,
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Verify that the ticket exists
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Medical ticket not found");
    }

    // Verify that the ticket is in progress or on hold and has no next steps assigned
    if (ticket.status !== "in_progress" && ticket.status !== "on_hold") {
      throw new Error(
        "Can only assign next steps to tickets that are in progress or on hold"
      );
    }

    if (ticket.nextSteps !== undefined) {
      throw new Error("This ticket already has next steps assigned");
    }

    // Build update object
    const updateData: {
      nextSteps: "vapi_appointment" | "vapi_prescription";
      notes?: string;
    } = {
      nextSteps: args.nextSteps,
    };

    if (args.notes !== undefined) {
      updateData.notes = args.notes;
    }

    // Update the ticket
    await ctx.db.patch(args.ticketId, updateData);

    return null;
  },
});

// Complete a ticket and assign appointment next steps
export const completeTicketWithAppointment = mutation({
  args: {
    ticketId: v.id("medicalTickets"),
    appointmentType: v.string(),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Verify that the ticket exists
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Medical ticket not found");
    }

    // Verify that the ticket is in progress or on hold
    if (ticket.status !== "in_progress" && ticket.status !== "on_hold") {
      throw new Error(
        "Can only complete tickets that are in progress or on hold"
      );
    }

    // Update the ticket with appointment next steps and completed status
    await ctx.db.patch(args.ticketId, {
      nextSteps: "vapi_appointment",
      status: "completed",
      notes: args.notes,
    });

    return null;
  },
});

// Complete a ticket and assign prescription next steps
export const completeTicketWithPrescription = mutation({
  args: {
    ticketId: v.id("medicalTickets"),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Verify that the ticket exists
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Medical ticket not found");
    }

    // Verify that the ticket is in progress or on hold
    if (ticket.status !== "in_progress" && ticket.status !== "on_hold") {
      throw new Error(
        "Can only complete tickets that are in progress or on hold"
      );
    }

    // Update the ticket with prescription next steps and completed status
    await ctx.db.patch(args.ticketId, {
      nextSteps: "vapi_prescription",
      status: "completed",
      notes: args.notes,
    });

    return null;
  },
});

// Debug query to check actual ticket status in database
export const debugTicketStatus = query({
  args: {
    ticketId: v.id("medicalTickets"),
  },
  returns: v.union(
    v.object({
      _id: v.id("medicalTickets"),
      status: medicalTicketStatusValidator,
      nextSteps: v.optional(medicalTicketNextStepsValidator),
      notes: v.optional(v.string()),
      _creationTime: v.number(),
      createdAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      return null;
    }

    return {
      _id: ticket._id,
      status: ticket.status,
      nextSteps: ticket.nextSteps,
      notes: ticket.notes,
      _creationTime: ticket._creationTime,
      createdAt: ticket.createdAt,
    };
  },
});
