import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";

export const current = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      lastLoginAt: v.optional(v.number()),
      clerkId: v.string(),
      name: v.string(),
      email: v.string(),
      avatarUrl: v.optional(v.string()),
      userType: v.union(
        v.literal("user"),
        v.literal("doctor"),
        v.literal("admin")
      ),
      isActive: v.boolean(),
    })
  ),
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const updateUserType = mutation({
  args: {
    userId: v.id("users"),
    userType: v.union(
      v.literal("user"),
      v.literal("doctor"),
      v.literal("admin")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Check if current user is admin
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser || currentUser.userType !== "admin") {
      throw new Error("Only admins can update user types");
    }

    await ctx.db.patch(args.userId, {
      userType: args.userType,
    });
    return null;
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  returns: v.null(),
  async handler(ctx, { data }) {
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      clerkId: data.id,
      email: data.email_addresses[0].email_address,
      avatarUrl: data.image_url || undefined,
      userType: "user" as const,
      isActive: true,
    };

    const user = await userByClerkId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
    return null;
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  returns: v.null(),
  async handler(ctx, { clerkUserId }) {
    const user = await userByClerkId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
    return null;
  },
});

export const getUsersByUserType = query({
  args: {
    userType: v.union(
      v.literal("user"),
      v.literal("doctor"),
      v.literal("admin")
    ),
  },
  returns: v.array(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      lastLoginAt: v.optional(v.number()),
      clerkId: v.string(),
      name: v.string(),
      email: v.string(),
      avatarUrl: v.optional(v.string()),
      userType: v.union(
        v.literal("user"),
        v.literal("doctor"),
        v.literal("admin")
      ),
      isActive: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("byUserType", (q) => q.eq("userType", args.userType))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

/**
 * Get the assigned doctor for a user
 * First tries to get the doctor from the most recent appointment
 * If no appointments exist, returns the first available doctor
 */
export const getAssignedDoctorForUser = query({
  args: {
    clerkId: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      lastLoginAt: v.optional(v.number()),
      clerkId: v.string(),
      name: v.string(),
      email: v.string(),
      avatarUrl: v.optional(v.string()),
      userType: v.union(
        v.literal("user"),
        v.literal("doctor"),
        v.literal("admin")
      ),
      isActive: v.boolean(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    // First, find the user by Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      return null;
    }

    // Try to get the doctor from the most recent appointment
    const mostRecentAppointment = await ctx.db
      .query("appointments")
      .withIndex("byPatientId", (q) => q.eq("patientId", user._id))
      .order("desc")
      .first();

    if (mostRecentAppointment) {
      // Get the doctor from the most recent appointment
      const doctor = await ctx.db.get(mostRecentAppointment.doctorId);
      if (doctor && doctor.userType === "doctor" && doctor.isActive) {
        return doctor;
      }
    }

    // If no appointment exists or the doctor is not available, get the first available doctor
    const doctors = await ctx.db
      .query("users")
      .withIndex("byUserType", (q) => q.eq("userType", "doctor"))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    if (doctors.length > 0) {
      return doctors[0];
    }

    return null;
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByClerkId(ctx, identity.subject);
}

async function userByClerkId(ctx: QueryCtx, clerkId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byClerkId", (q) => q.eq("clerkId", clerkId))
    .unique();
}
