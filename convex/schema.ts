import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Clerk authentication
    clerkId: v.string(), // This is the clerkId of the user

    // Basic user information
    name: v.string(),
  }).index("byClerkId", ["clerkId"]),
});
