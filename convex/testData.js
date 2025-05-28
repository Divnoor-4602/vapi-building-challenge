import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create comprehensive test data for a user by email
 * This includes profile, patient records, medical tickets, and prescriptions
 */
export const createTestDataForUser = mutation({
  args: {
    email: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    data: v.optional(
      v.object({
        userId: v.id("users"),
        profileId: v.id("profiles"),
        patientIds: v.array(v.id("patients")),
        medicalTicketIds: v.array(v.id("medicalTickets")),
        prescriptionIds: v.array(v.id("prescriptions")),
      })
    ),
  }),
  handler: async (ctx, args) => {
    try {
      // Find the user by email
      const user = await ctx.db
        .query("users")
        .withIndex("byEmail", (q) => q.eq("email", args.email))
        .unique();

      if (!user) {
        return {
          success: false,
          message: `User with email ${args.email} not found`,
        };
      }

      // Check if profile already exists
      let profile = await ctx.db
        .query("profiles")
        .withIndex("byUserId", (q) => q.eq("userId", user._id))
        .unique();

      // Create profile if it doesn't exist
      if (!profile) {
        const profileId = await ctx.db.insert("profiles", {
          userId: user._id,
          firstName: "Lakshay",
          lastName: "Manchanda",
          dateOfBirth: "1995-03-15",
          phoneNumber: "+1-555-0123",
          gender: "male",
          address: {
            street: "123 Main Street",
            city: "Vancouver",
            state: "British Columbia",
            zipCode: "V6B 1A1",
            country: "Canada",
          },
          emergencyContact: {
            name: "Priya Manchanda",
            phoneNumber: "+1-555-0124",
            relationship: "Spouse",
          },
          insurance: {
            provider: "Blue Cross Blue Shield",
            policyNumber: "BC123456789",
            groupNumber: "GRP001",
            subscriberName: "Lakshay Manchanda",
            relationshipToSubscriber: "Self",
          },
          medicalHistory: {
            allergies: ["Penicillin", "Shellfish"],
            chronicConditions: ["Hypertension", "Type 2 Diabetes"],
            currentMedications: [
              {
                name: "Metformin",
                dosage: "500mg",
                frequency: "Twice daily",
              },
              {
                name: "Lisinopril",
                dosage: "10mg",
                frequency: "Once daily",
              },
            ],
            previousSurgeries: [
              {
                procedure: "Appendectomy",
                year: "2018",
              },
            ],
            familyHistory: ["Heart Disease", "Diabetes"],
          },
          communicationPreferences: {
            email: true,
            phone: true,
            sms: false,
          },
          consents: {
            treatmentConsent: true,
            dataProcessingConsent: true,
            marketingConsent: false,
            consentTimestamp: Date.now(),
          },
          isProfileComplete: true,
        });

        profile = await ctx.db.get(profileId);
      }

      // Create test patient records
      const patientIds = [];

      // Patient 1: Respiratory infection
      const patient1Id = await ctx.db.insert("patients", {
        userId: user._id,
        profileId: profile._id,
        chiefComplaint: "Persistent cough and fever",
        currentSymptoms: [
          {
            symptom: "Dry cough",
            severity: "moderate",
            duration: "5 days",
            notes: "Worse at night, no blood",
          },
          {
            symptom: "Fever",
            severity: "mild",
            duration: "3 days",
            notes: "Temperature around 100.5°F",
          },
          {
            symptom: "Fatigue",
            severity: "moderate",
            duration: "4 days",
            notes: "Feeling tired throughout the day",
          },
        ],
        requiresFollowUp: true,
        followUpNotes:
          "Monitor symptoms, return if fever persists beyond 7 days",
        recommendedAction: "prescription_consultation",
        assignedProviderId: "dr_smith_001",
      });
      patientIds.push(patient1Id);

      // Patient 2: Digestive issues
      const patient2Id = await ctx.db.insert("patients", {
        userId: user._id,
        profileId: profile._id,
        chiefComplaint: "Stomach pain and nausea",
        currentSymptoms: [
          {
            symptom: "Abdominal pain",
            severity: "severe",
            duration: "2 days",
            notes: "Sharp pain in upper abdomen, worse after eating",
          },
          {
            symptom: "Nausea",
            severity: "moderate",
            duration: "2 days",
            notes: "Especially after meals",
          },
        ],
        requiresFollowUp: true,
        followUpNotes: "Consider gastroenterology referral if symptoms persist",
        recommendedAction: "schedule_appointment",
        assignedProviderId: "dr_johnson_002",
      });
      patientIds.push(patient2Id);

      // Patient 3: Routine checkup
      const patient3Id = await ctx.db.insert("patients", {
        userId: user._id,
        profileId: profile._id,
        chiefComplaint: "Annual physical examination",
        currentSymptoms: [
          {
            symptom: "No specific symptoms",
            severity: "mild",
            duration: "N/A",
            notes: "Routine health maintenance visit",
          },
        ],
        requiresFollowUp: false,
        followUpNotes: "Schedule next annual physical in 12 months",
        recommendedAction: "schedule_appointment",
        assignedProviderId: "dr_williams_003",
      });
      patientIds.push(patient3Id);

      // Create medical tickets
      const medicalTicketIds = [];
      const currentTime = Date.now();

      // Ticket 1: For respiratory infection (completed)
      const ticket1Id = await ctx.db.insert("medicalTickets", {
        userId: user._id,
        profileId: profile._id,
        patientId: patient1Id,
        status: "completed",
        notes:
          "Patient diagnosed with upper respiratory infection. Prescribed antibiotics and rest.",
        nextSteps: "vapi_prescription",
        createdAt: currentTime - 86400000, // 1 day ago
      });
      medicalTicketIds.push(ticket1Id);

      // Ticket 2: For digestive issues (in progress)
      const ticket2Id = await ctx.db.insert("medicalTickets", {
        userId: user._id,
        profileId: profile._id,
        patientId: patient2Id,
        status: "in_progress",
        notes:
          "Investigating abdominal pain. Ordered blood work and ultrasound.",
        nextSteps: "vapi_appointment",
        createdAt: currentTime - 43200000, // 12 hours ago
      });
      medicalTicketIds.push(ticket2Id);

      // Ticket 3: For routine checkup (completed)
      const ticket3Id = await ctx.db.insert("medicalTickets", {
        userId: user._id,
        profileId: profile._id,
        patientId: patient3Id,
        status: "completed",
        notes:
          "Annual physical completed. All vitals normal. Updated vaccinations.",
        nextSteps: "vapi_appointment",
        createdAt: currentTime - 172800000, // 2 days ago
      });
      medicalTicketIds.push(ticket3Id);

      // Create prescriptions
      const prescriptionIds = [];

      // Prescription 1: For respiratory infection
      const prescription1Id = await ctx.db.insert("prescriptions", {
        ticketId: ticket1Id,
        patientId: patient1Id,
        prescriptionDetails: {
          medication: "Amoxicillin",
          dosage: "500mg",
          frequency: "Three times daily",
          instructions:
            "Take with food. Complete full course even if feeling better. Avoid alcohol.",
        },
        notes:
          "7-day course for upper respiratory infection. Follow up if symptoms worsen.",
      });
      prescriptionIds.push(prescription1Id);

      // Prescription 2: Cough suppressant for respiratory infection
      const prescription2Id = await ctx.db.insert("prescriptions", {
        ticketId: ticket1Id,
        patientId: patient1Id,
        prescriptionDetails: {
          medication: "Dextromethorphan",
          dosage: "15mg",
          frequency: "Every 4 hours as needed",
          instructions:
            "For dry cough. Do not exceed 6 doses in 24 hours. May cause drowsiness.",
        },
        notes: "Over-the-counter cough suppressant for symptom relief.",
      });
      prescriptionIds.push(prescription2Id);

      // Prescription 3: Antacid for digestive issues (temporary relief)
      const prescription3Id = await ctx.db.insert("prescriptions", {
        ticketId: ticket2Id,
        patientId: patient2Id,
        prescriptionDetails: {
          medication: "Omeprazole",
          dosage: "20mg",
          frequency: "Once daily before breakfast",
          instructions:
            "Take 30 minutes before first meal. May take 1-4 days for full effect.",
        },
        notes:
          "Proton pump inhibitor for acid reduction while investigating underlying cause.",
      });
      prescriptionIds.push(prescription3Id);

      return {
        success: true,
        message: `Successfully created comprehensive test data for ${args.email}`,
        data: {
          userId: user._id,
          profileId: profile._id,
          patientIds,
          medicalTicketIds,
          prescriptionIds,
        },
      };
    } catch (error) {
      console.error("Error creating test data:", error);
      return {
        success: false,
        message: `Failed to create test data: ${error.message}`,
      };
    }
  },
});

/**
 * Clean up test data for a user by email
 */
export const cleanupTestDataForUser = mutation({
  args: {
    email: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      // Find the user by email
      const user = await ctx.db
        .query("users")
        .withIndex("byEmail", (q) => q.eq("email", args.email))
        .unique();

      if (!user) {
        return {
          success: false,
          message: `User with email ${args.email} not found`,
        };
      }

      // Delete prescriptions
      const prescriptions = await ctx.db.query("prescriptions").collect();

      for (const prescription of prescriptions) {
        const patient = await ctx.db.get(prescription.patientId);
        if (patient && patient.userId === user._id) {
          await ctx.db.delete(prescription._id);
        }
      }

      // Delete medical tickets
      const medicalTickets = await ctx.db
        .query("medicalTickets")
        .withIndex("byUserId", (q) => q.eq("userId", user._id))
        .collect();

      for (const ticket of medicalTickets) {
        await ctx.db.delete(ticket._id);
      }

      // Delete patients
      const patients = await ctx.db
        .query("patients")
        .withIndex("byUserId", (q) => q.eq("userId", user._id))
        .collect();

      for (const patient of patients) {
        await ctx.db.delete(patient._id);
      }

      // Delete profile
      const profile = await ctx.db
        .query("profiles")
        .withIndex("byUserId", (q) => q.eq("userId", user._id))
        .unique();

      if (profile) {
        await ctx.db.delete(profile._id);
      }

      return {
        success: true,
        message: `Successfully cleaned up test data for ${args.email}`,
      };
    } catch (error) {
      console.error("Error cleaning up test data:", error);
      return {
        success: false,
        message: `Failed to clean up test data: ${error.message}`,
      };
    }
  },
});
