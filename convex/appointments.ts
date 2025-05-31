import { query, mutation, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

/**
 * Get all appointments for a specific user (patient)
 */
export const getUserAppointments = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.array(
    v.object({
      _id: v.id("appointments"),
      _creationTime: v.number(),
      doctorId: v.id("users"),
      patientId: v.id("users"),
      profileId: v.id("profiles"),
      patientRecordId: v.id("patients"),
      ticketId: v.optional(v.id("medicalTickets")),
      googleCalendarEventId: v.optional(v.string()),
      googleCalendarResponse: v.optional(v.any()),
      summary: v.string(),
      startDateTime: v.string(),
      endDateTime: v.string(),
      timeZone: v.string(),
      attendees: v.array(v.string()),
      status: v.union(
        v.literal("cancelled"),
        v.literal("completed"),
        v.literal("confirmed")
      ),
      notes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("byPatientId", (q) => q.eq("patientId", args.userId))
      .collect();
  },
});

/**
 * Get all appointments for a specific doctor
 */
export const getDoctorAppointments = query({
  args: {
    doctorId: v.id("users"),
  },
  returns: v.array(
    v.object({
      _id: v.id("appointments"),
      _creationTime: v.number(),
      doctorId: v.id("users"),
      patientId: v.id("users"),
      profileId: v.id("profiles"),
      patientRecordId: v.id("patients"),
      ticketId: v.optional(v.id("medicalTickets")),
      googleCalendarEventId: v.optional(v.string()),
      googleCalendarResponse: v.optional(v.any()),
      summary: v.string(),
      startDateTime: v.string(),
      endDateTime: v.string(),
      timeZone: v.string(),
      attendees: v.array(v.string()),
      status: v.union(
        v.literal("cancelled"),
        v.literal("completed"),
        v.literal("confirmed")
      ),
      notes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    // Verify the user is actually a doctor
    const doctor = await ctx.db.get(args.doctorId);
    if (!doctor || doctor.userType !== "doctor") {
      throw new Error("User is not a doctor");
    }

    return await ctx.db
      .query("appointments")
      .withIndex("byDoctorId", (q) => q.eq("doctorId", args.doctorId))
      .collect();
  },
});

/**
 * Get appointments for all users with userType "doctor"
 */
export const getAllDoctorAppointments = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("appointments"),
      _creationTime: v.number(),
      doctorId: v.id("users"),
      patientId: v.id("users"),
      profileId: v.id("profiles"),
      patientRecordId: v.id("patients"),
      ticketId: v.optional(v.id("medicalTickets")),
      googleCalendarEventId: v.optional(v.string()),
      googleCalendarResponse: v.optional(v.any()),
      summary: v.string(),
      startDateTime: v.string(),
      endDateTime: v.string(),
      timeZone: v.string(),
      attendees: v.array(v.string()),
      status: v.union(
        v.literal("cancelled"),
        v.literal("completed"),
        v.literal("confirmed")
      ),
      notes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx) => {
    // Get all doctors
    const doctors = await ctx.db
      .query("users")
      .withIndex("byUserType", (q) => q.eq("userType", "doctor"))
      .collect();

    const allAppointments = [];

    // Get appointments for all doctors
    for (const doctor of doctors) {
      const doctorAppointments = await ctx.db
        .query("appointments")
        .withIndex("byDoctorId", (q) => q.eq("doctorId", doctor._id))
        .collect();
      allAppointments.push(...doctorAppointments);
    }

    return allAppointments;
  },
});

/**
 * Internal mutation to create an appointment
 */
export const createAppointmentInternalMutation = internalMutation({
  args: {
    doctorId: v.id("users"),
    patientId: v.id("users"),
    profileId: v.id("profiles"),
    patientRecordId: v.id("patients"),
    ticketId: v.optional(v.id("medicalTickets")),
    googleCalendarEventId: v.optional(v.string()),
    googleCalendarResponse: v.optional(v.any()),
    summary: v.string(),
    startDateTime: v.string(),
    endDateTime: v.string(),
    timeZone: v.string(),
    attendees: v.array(v.string()),
    notes: v.optional(v.string()),
  },
  returns: v.id("appointments"),
  handler: async (ctx, args) => {
    const now = Date.now();

    // Validate doctor exists and is a doctor
    const doctor = await ctx.db.get(args.doctorId);
    if (!doctor || doctor.userType !== "doctor") {
      throw new Error("Invalid doctor ID or user is not a doctor");
    }

    // Validate patient exists and is a user
    const patient = await ctx.db.get(args.patientId);
    if (!patient || patient.userType !== "user") {
      throw new Error("Invalid patient ID or user is not a patient");
    }

    // Validate profile exists
    const profile = await ctx.db.get(args.profileId);
    if (!profile) {
      throw new Error("Profile not found");
    }

    // Validate patient record exists
    const patientRecord = await ctx.db.get(args.patientRecordId);
    if (!patientRecord) {
      throw new Error("Patient record not found");
    }

    // Validate ticket if provided
    if (args.ticketId) {
      const ticket = await ctx.db.get(args.ticketId);
      if (!ticket) {
        throw new Error("Medical ticket not found");
      }
    }

    const appointmentId = await ctx.db.insert("appointments", {
      doctorId: args.doctorId,
      patientId: args.patientId,
      profileId: args.profileId,
      patientRecordId: args.patientRecordId,
      ticketId: args.ticketId,
      googleCalendarEventId: args.googleCalendarEventId,
      googleCalendarResponse: args.googleCalendarResponse,
      summary: args.summary,
      startDateTime: args.startDateTime,
      endDateTime: args.endDateTime,
      timeZone: args.timeZone,
      attendees: args.attendees,
      status: "confirmed",
      notes: args.notes,
      createdAt: now,
    });

    return appointmentId;
  },
});

/**
 * Public action to create an appointment (for VAPI integration)
 */
export const createAppointmentAction = action({
  args: {
    doctorId: v.id("users"),
    patientId: v.id("users"),
    profileId: v.id("profiles"),
    patientRecordId: v.id("patients"),
    ticketId: v.optional(v.id("medicalTickets")),
    googleCalendarEventId: v.optional(v.string()),
    googleCalendarResponse: v.optional(v.any()),
    summary: v.string(),
    startDateTime: v.string(),
    endDateTime: v.string(),
    timeZone: v.string(),
    attendees: v.array(v.string()),
    notes: v.optional(v.string()),
  },
  returns: v.object({
    appointmentId: v.id("appointments"),
    status: v.string(),
    message: v.string(),
  }),
  handler: async (
    ctx,
    args
  ): Promise<{
    appointmentId: Id<"appointments">;
    status: string;
    message: string;
  }> => {
    try {
      const appointmentId: Id<"appointments"> = await ctx.runMutation(
        internal.appointments.createAppointmentInternalMutation,
        args
      );

      return {
        appointmentId,
        status: "success",
        message: "Appointment created successfully",
      };
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw new Error(`Failed to create appointment: ${error}`);
    }
  },
});

/**
 * Get a specific appointment by ID
 */
export const getAppointmentById = query({
  args: {
    appointmentId: v.id("appointments"),
  },
  returns: v.union(
    v.object({
      _id: v.id("appointments"),
      _creationTime: v.number(),
      doctorId: v.id("users"),
      patientId: v.id("users"),
      profileId: v.id("profiles"),
      patientRecordId: v.id("patients"),
      ticketId: v.optional(v.id("medicalTickets")),
      googleCalendarEventId: v.optional(v.string()),
      googleCalendarResponse: v.optional(v.any()),
      summary: v.string(),
      startDateTime: v.string(),
      endDateTime: v.string(),
      timeZone: v.string(),
      attendees: v.array(v.string()),
      status: v.union(
        v.literal("cancelled"),
        v.literal("completed"),
        v.literal("confirmed")
      ),
      notes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.appointmentId);
  },
});

/**
 * Update appointment status
 */
export const updateAppointmentStatus = mutation({
  args: {
    appointmentId: v.id("appointments"),
    status: v.union(
      v.literal("cancelled"),
      v.literal("completed"),
      v.literal("confirmed")
    ),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const appointment = await ctx.db.get(args.appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    await ctx.db.patch(args.appointmentId, {
      status: args.status,
      notes: args.notes || appointment.notes,
      updatedAt: Date.now(),
    });

    return null;
  },
});

export const checkRecentAppointmentCreation = query({
  args: {
    userId: v.id("users"),
    profileId: v.id("profiles"),
    afterTimestamp: v.number(), // Only check appointments created after this timestamp
  },
  returns: v.union(
    v.null(),
    v.object({
      appointment: v.object({
        _id: v.id("appointments"),
        _creationTime: v.number(),
        summary: v.string(),
        startDateTime: v.string(),
        endDateTime: v.string(),
        status: v.union(
          v.literal("cancelled"),
          v.literal("completed"),
          v.literal("confirmed")
        ),
        doctorId: v.id("users"),
        notes: v.optional(v.string()),
      }),
      doctorEmail: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const { userId, profileId, afterTimestamp } = args;

    // Find the most recent appointment for this user/profile created after the timestamp
    const recentAppointment = await ctx.db
      .query("appointments")
      .withIndex("byPatientId", (q) => q.eq("patientId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("profileId"), profileId),
          q.gt(q.field("_creationTime"), afterTimestamp)
        )
      )
      .order("desc")
      .first();

    if (!recentAppointment) {
      return null;
    }

    // Get doctor information
    const doctor = await ctx.db.get(recentAppointment.doctorId);
    if (!doctor) {
      return null;
    }

    return {
      appointment: {
        _id: recentAppointment._id,
        _creationTime: recentAppointment._creationTime,
        summary: recentAppointment.summary,
        startDateTime: recentAppointment.startDateTime,
        endDateTime: recentAppointment.endDateTime,
        status: recentAppointment.status,
        doctorId: recentAppointment.doctorId,
        notes: recentAppointment.notes,
      },
      doctorEmail: doctor.email,
    };
  },
});

/**
 * Get appointments for a user by Clerk ID with comprehensive data
 */
export const getAppointmentsByClerkId = query({
  args: {
    clerkId: v.string(),
    limit: v.optional(v.number()), // Optional limit, defaults to 10
  },
  returns: v.array(
    v.object({
      _id: v.id("appointments"),
      _creationTime: v.number(),
      summary: v.string(),
      startDateTime: v.string(),
      endDateTime: v.string(),
      timeZone: v.string(),
      status: v.union(
        v.literal("cancelled"),
        v.literal("completed"),
        v.literal("confirmed")
      ),
      notes: v.optional(v.string()),
      createdAt: v.number(),

      // Doctor information
      doctor: v.object({
        _id: v.id("users"),
        name: v.string(),
        email: v.string(),
      }),

      // Patient information
      patient: v.object({
        _id: v.id("users"),
        name: v.string(),
        email: v.string(),
      }),

      // Patient profile information
      profile: v.object({
        _id: v.id("profiles"),
        firstName: v.string(),
        lastName: v.string(),
      }),
    })
  ),
  handler: async (ctx, args) => {
    const appointmentLimit = args.limit ?? 10; // Default to 10 appointments

    // First, find the user by Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      // Return empty array if user not found
      return [];
    }

    // Get appointments for this user (as patient)
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("byPatientId", (q) => q.eq("patientId", user._id))
      .order("desc")
      .take(appointmentLimit);

    // Get comprehensive data for each appointment
    const appointmentsWithData = [];

    for (const appointment of appointments) {
      // Get doctor information
      const doctor = await ctx.db.get(appointment.doctorId);
      if (!doctor) {
        continue; // Skip if we can't get doctor data
      }

      // Get patient information (the user themselves)
      const patient = await ctx.db.get(appointment.patientId);
      if (!patient) {
        continue; // Skip if we can't get patient data
      }

      // Get profile information
      const profile = await ctx.db.get(appointment.profileId);
      if (!profile) {
        continue; // Skip if we can't get profile data
      }

      appointmentsWithData.push({
        _id: appointment._id,
        _creationTime: appointment._creationTime,
        summary: appointment.summary,
        startDateTime: appointment.startDateTime,
        endDateTime: appointment.endDateTime,
        timeZone: appointment.timeZone,
        status: appointment.status,
        notes: appointment.notes,
        createdAt: appointment.createdAt,
        doctor: {
          _id: doctor._id,
          name: doctor.name,
          email: doctor.email,
        },
        patient: {
          _id: patient._id,
          name: patient.name,
          email: patient.email,
        },
        profile: {
          _id: profile._id,
          firstName: profile.firstName,
          lastName: profile.lastName,
        },
      });
    }

    // Sort by creation time (most recent first)
    appointmentsWithData.sort((a, b) => b._creationTime - a._creationTime);

    return appointmentsWithData;
  },
});
