import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// Create a new appointment
export const createAppointment = mutation({
  args: {
    userId: v.id("users"),
    profileId: v.id("profiles"),
    ticketId: v.optional(v.id("medicalTickets")),
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    doctorId: v.string(),
    doctorName: v.string(),
    doctorSpecialty: v.string(),
    type: v.union(
      v.literal("checkup"),
      v.literal("consultation"),
      v.literal("follow_up"),
      v.literal("emergency"),
      v.literal("other")
    ),
    location: v.union(
      v.literal("in_person"),
      v.literal("virtual")
    ),
    meetingLink: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  returns: v.id("appointments"),
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

    // Verify that the profile belongs to the user
    if (profile.userId !== args.userId) {
      throw new Error("Profile does not belong to the specified user");
    }

    // If a ticket ID is provided, verify it exists
    if (args.ticketId) {
      const ticket = await ctx.db.get(args.ticketId);
      if (!ticket) {
        throw new Error("Medical ticket not found");
      }
    }

    // Create the appointment
    const appointmentId = await ctx.db.insert("appointments", {
      userId: args.userId,
      profileId: args.profileId,
      ticketId: args.ticketId,
      title: args.title,
      description: args.description,
      startTime: args.startTime,
      endTime: args.endTime,
      doctorId: args.doctorId,
      doctorName: args.doctorName,
      doctorSpecialty: args.doctorSpecialty,
      status: "scheduled",
      type: args.type,
      location: args.location,
      meetingLink: args.meetingLink,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return appointmentId;
  },
});

// Get appointments for a user
export const getUserAppointments = query({
  args: {
    userId: v.id("users"),
    status: v.optional(v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    )),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("appointments"),
    _creationTime: v.number(),
    userId: v.id("users"),
    profileId: v.id("profiles"),
    ticketId: v.optional(v.id("medicalTickets")),
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    doctorId: v.string(),
    doctorName: v.string(),
    doctorSpecialty: v.string(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),
    type: v.union(
      v.literal("checkup"),
      v.literal("consultation"),
      v.literal("follow_up"),
      v.literal("emergency"),
      v.literal("other")
    ),
    location: v.union(
      v.literal("in_person"),
      v.literal("virtual")
    ),
    meetingLink: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("appointments")
      .filter((q) => q.eq(q.field("userId"), args.userId));

    if (args.status) {
      query = query.filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("status"), args.status)
        )
      );
    }

    if (args.startTime !== undefined) {
      const startTime = args.startTime as number;
      query = query.filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.gte(q.field("startTime"), startTime)
        )
      );
    }

    if (args.endTime !== undefined) {
      const endTime = args.endTime as number;
      query = query.filter((q) => q.lte(q.field("endTime"), endTime));
    }

    return await query.collect();
  },
});

// Get appointments for a doctor
export const getDoctorAppointments = query({
  args: {
    doctorId: v.string(),
    status: v.optional(v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    )),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("appointments"),
    _creationTime: v.number(),
    userId: v.id("users"),
    profileId: v.id("profiles"),
    ticketId: v.optional(v.id("medicalTickets")),
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    doctorId: v.string(),
    doctorName: v.string(),
    doctorSpecialty: v.string(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),
    type: v.union(
      v.literal("checkup"),
      v.literal("consultation"),
      v.literal("follow_up"),
      v.literal("emergency"),
      v.literal("other")
    ),
    location: v.union(
      v.literal("in_person"),
      v.literal("virtual")
    ),
    meetingLink: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("appointments")
      .filter((q) => q.eq(q.field("doctorId"), args.doctorId));

    if (args.status) {
      query = query.filter((q) => 
        q.and(
          q.eq(q.field("doctorId"), args.doctorId),
          q.eq(q.field("status"), args.status)
        )
      );
    }

    if (args.startTime !== undefined) {
      const startTime = args.startTime as number;
      query = query.filter((q) => 
        q.and(
          q.eq(q.field("doctorId"), args.doctorId),
          q.gte(q.field("startTime"), startTime)
        )
      );
    }

    if (args.endTime !== undefined) {
      const endTime = args.endTime as number;
      query = query.filter((q) => q.lte(q.field("endTime"), endTime));
    }

    return await query.collect();
  },
});

// Update appointment status
export const updateAppointmentStatus = mutation({
  args: {
    appointmentId: v.id("appointments"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Verify that the appointment exists
    const appointment = await ctx.db.get(args.appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Update the appointment
    await ctx.db.patch(args.appointmentId, {
      status: args.status,
      notes: args.notes,
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Create appointment from medical ticket
export const createAppointmentFromTicket = mutation({
  args: {
    ticketId: v.id("medicalTickets"),
    startTime: v.number(),
    endTime: v.number(),
    doctorId: v.string(),
    doctorName: v.string(),
    doctorSpecialty: v.string(),
    type: v.union(
      v.literal("checkup"),
      v.literal("consultation"),
      v.literal("follow_up"),
      v.literal("emergency"),
      v.literal("other")
    ),
    location: v.union(
      v.literal("in_person"),
      v.literal("virtual")
    ),
    meetingLink: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  returns: v.id("appointments"),
  handler: async (ctx, args) => {
    // Get the medical ticket
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Medical ticket not found");
    }

    // Create the appointment using the internal mutation
    const appointmentId = await ctx.db.insert("appointments", {
      userId: ticket.userId,
      profileId: ticket.profileId,
      ticketId: args.ticketId,
      title: "Follow-up Appointment",
      description: "Appointment scheduled from medical ticket",
      startTime: args.startTime,
      endTime: args.endTime,
      doctorId: args.doctorId,
      doctorName: args.doctorName,
      doctorSpecialty: args.doctorSpecialty,
      status: "scheduled",
      type: args.type,
      location: args.location,
      meetingLink: args.meetingLink,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update the ticket status
    await ctx.db.patch(args.ticketId, {
      status: "completed",
      nextSteps: "vapi_appointment",
      notes: "Appointment scheduled",
    });

    return appointmentId;
  },
}); 