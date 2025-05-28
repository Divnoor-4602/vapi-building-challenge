"use client";

import React from "react";
import { useQuery, useAction } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Zod schema that matches our form structure exactly
const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const today = new Date();
      const birthDate = new Date(date);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 120;
    }, "Please enter a valid date of birth"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Phone number must be at least 10 digits"),

  // Address fields - transform empty strings to undefined
  street: z
    .string()
    .max(200, "Street address is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  city: z
    .string()
    .max(100, "City name is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  state: z
    .string()
    .max(50, "State name is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  zipCode: z
    .string()
    .max(20, "ZIP code is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  country: z
    .string()
    .max(100, "Country name is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),

  // Communication preferences (booleans)
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  phoneNotifications: z.boolean(),

  // Emergency contact
  emergencyName: z
    .string()
    .max(100, "Emergency contact name is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  emergencyRelationship: z
    .string()
    .max(50, "Relationship is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  emergencyPhone: z
    .string()
    .max(20, "Emergency phone number is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),

  // Medical history (text fields that we'll split into arrays)
  allergies: z
    .string()
    .max(1000, "Allergies list is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  chronicConditions: z
    .string()
    .max(1000, "Chronic conditions list is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  familyHistory: z
    .string()
    .max(1000, "Family history is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),

  // Insurance
  insuranceProvider: z
    .string()
    .max(100, "Insurance provider name is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  policyNumber: z
    .string()
    .max(50, "Policy number is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  subscriberName: z
    .string()
    .max(100, "Subscriber name is too long")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),

  // Consents (booleans)
  treatmentConsent: z.boolean(),
  dataProcessingConsent: z.boolean(),
  marketingConsent: z.boolean(),
});

// Type inference from schema
type ProfileFormData = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { user: clerkUser } = useUser();
  const userProfile = useQuery(api.profiles.getCurrentUserProfile);
  const updateProfile = useAction(api.profiles.updatePatientProfileAction);

  // Initialize form with Zod resolver
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phoneNumber: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      emailNotifications: false,
      smsNotifications: false,
      phoneNotifications: false,
      emergencyName: "",
      emergencyRelationship: "",
      emergencyPhone: "",
      allergies: "",
      chronicConditions: "",
      familyHistory: "",
      insuranceProvider: "",
      policyNumber: "",
      subscriberName: "",
      treatmentConsent: false,
      dataProcessingConsent: false,
      marketingConsent: false,
    },
  });

  // Load existing data
  React.useEffect(() => {
    if (userProfile?.profile) {
      const profile = userProfile.profile;
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender,
        phoneNumber: profile.phoneNumber || "",
        street: profile.address?.street || "",
        city: profile.address?.city || "",
        state: profile.address?.state || "",
        zipCode: profile.address?.zipCode || "",
        country: profile.address?.country || "",
        emailNotifications: profile.communicationPreferences?.email || false,
        smsNotifications: profile.communicationPreferences?.sms || false,
        phoneNotifications: profile.communicationPreferences?.phone || false,
        emergencyName: profile.emergencyContact?.name || "",
        emergencyRelationship: profile.emergencyContact?.relationship || "",
        emergencyPhone: profile.emergencyContact?.phoneNumber || "",
        allergies: profile.medicalHistory?.allergies?.join(", ") || "",
        chronicConditions:
          profile.medicalHistory?.chronicConditions?.join(", ") || "",
        familyHistory: profile.medicalHistory?.familyHistory?.join(", ") || "",
        insuranceProvider: profile.insurance?.provider || "",
        policyNumber: profile.insurance?.policyNumber || "",
        subscriberName: profile.insurance?.subscriberName || "",
        treatmentConsent: profile.consents?.treatmentConsent || false,
        dataProcessingConsent: profile.consents?.dataProcessingConsent || false,
        marketingConsent: profile.consents?.marketingConsent || false,
      });
    }
  }, [userProfile, form]);

  // Form submission handler
  async function onSubmit(values: ProfileFormData) {
    if (!clerkUser?.emailAddresses[0]?.emailAddress) {
      toast.error("User email not found");
      return;
    }

    try {
      // Transform form data to match Convex schema
      const profileData = {
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        phoneNumber: values.phoneNumber,
        address: {
          street: values.street || "",
          city: values.city || "",
          state: values.state || "",
          zipCode: values.zipCode || "",
          country: values.country || "",
        },
        communicationPreferences: {
          email: values.emailNotifications,
          sms: values.smsNotifications,
          phone: values.phoneNotifications,
        },
        emergencyContact: {
          name: values.emergencyName || "",
          relationship: values.emergencyRelationship || "",
          phoneNumber: values.emergencyPhone || "",
        },
        medicalHistory: {
          allergies: values.allergies
            ? values.allergies.split(",").map((s) => s.trim())
            : [],
          currentMedications: [],
          chronicConditions: values.chronicConditions
            ? values.chronicConditions.split(",").map((s) => s.trim())
            : [],
          previousSurgeries: [],
          familyHistory: values.familyHistory
            ? values.familyHistory.split(",").map((s) => s.trim())
            : [],
        },
        insurance: {
          provider: values.insuranceProvider || "",
          policyNumber: values.policyNumber || "",
          groupNumber: "",
          subscriberName: values.subscriberName || "",
          relationshipToSubscriber: "",
        },
        consents: {
          treatmentConsent: values.treatmentConsent,
          dataProcessingConsent: values.dataProcessingConsent,
          marketingConsent: values.marketingConsent,
          consentTimestamp: Date.now(),
        },
      };

      await updateProfile(profileData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  }

  if (userProfile === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-gray-900">Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-gray-700 font-medium"
                >
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...form.register("firstName")}
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700 font-medium">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...form.register("lastName")}
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="dateOfBirth"
                  className="text-gray-700 font-medium"
                >
                  Date of Birth *
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...form.register("dateOfBirth")}
                />
                {form.formState.errors.dateOfBirth && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-700 font-medium">
                  Gender
                </Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue(
                      "gender",
                      value as
                        | "male"
                        | "female"
                        | "other"
                        | "prefer_not_to_say",
                      { shouldDirty: true }
                    )
                  }
                >
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="text-gray-700 font-medium"
              >
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                placeholder="+1 (555) 123-4567"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                {...form.register("phoneNumber")}
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Address
            </h3>

            <div className="space-y-2">
              <Label htmlFor="street" className="text-gray-700 font-medium">
                Street Address
              </Label>
              <Input
                id="street"
                placeholder="123 Main St"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                {...form.register("street")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-gray-700 font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="New York"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...form.register("city")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-gray-700 font-medium">
                  State
                </Label>
                <Input
                  id="state"
                  placeholder="NY"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...form.register("state")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-gray-700 font-medium">
                  ZIP Code
                </Label>
                <Input
                  id="zipCode"
                  placeholder="10001"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...form.register("zipCode")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-gray-700 font-medium">
                Country
              </Label>
              <Input
                id="country"
                placeholder="United States"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                {...form.register("country")}
              />
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Communication Preferences
            </h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                <Checkbox
                  id="emailNotifications"
                  className="border-gray-300"
                  checked={form.watch("emailNotifications")}
                  onCheckedChange={(checked) =>
                    form.setValue("emailNotifications", !!checked, {
                      shouldDirty: true,
                    })
                  }
                />
                <Label
                  htmlFor="emailNotifications"
                  className="text-gray-700 font-medium cursor-pointer"
                >
                  Email notifications
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                <Checkbox
                  id="smsNotifications"
                  className="border-gray-300"
                  checked={form.watch("smsNotifications")}
                  onCheckedChange={(checked) =>
                    form.setValue("smsNotifications", !!checked, {
                      shouldDirty: true,
                    })
                  }
                />
                <Label
                  htmlFor="smsNotifications"
                  className="text-gray-700 font-medium cursor-pointer"
                >
                  SMS notifications
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                <Checkbox
                  id="phoneNotifications"
                  className="border-gray-300"
                  checked={form.watch("phoneNotifications")}
                  onCheckedChange={(checked) =>
                    form.setValue("phoneNotifications", !!checked, {
                      shouldDirty: true,
                    })
                  }
                />
                <Label
                  htmlFor="phoneNotifications"
                  className="text-gray-700 font-medium cursor-pointer"
                >
                  Phone notifications
                </Label>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Emergency Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="emergencyName"
                  className="text-gray-700 font-medium"
                >
                  Name
                </Label>
                <Input
                  id="emergencyName"
                  placeholder="Jane Doe"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...form.register("emergencyName")}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="emergencyRelationship"
                  className="text-gray-700 font-medium"
                >
                  Relationship
                </Label>
                <Input
                  id="emergencyRelationship"
                  placeholder="Spouse"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...form.register("emergencyRelationship")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="emergencyPhone"
                className="text-gray-700 font-medium"
              >
                Phone Number
              </Label>
              <Input
                id="emergencyPhone"
                placeholder="+1 (555) 987-6543"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                {...form.register("emergencyPhone")}
              />
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Medical History
            </h3>

            <div className="space-y-2">
              <Label htmlFor="allergies" className="text-gray-700 font-medium">
                Allergies
              </Label>
              <Textarea
                id="allergies"
                placeholder="List any allergies, separated by commas"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                {...form.register("allergies")}
              />
              <p className="text-sm text-gray-500">
                Separate multiple allergies with commas.
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="chronicConditions"
                className="text-gray-700 font-medium"
              >
                Chronic Conditions
              </Label>
              <Textarea
                id="chronicConditions"
                placeholder="List any chronic conditions, separated by commas"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                {...form.register("chronicConditions")}
              />
              <p className="text-sm text-gray-500">
                Separate multiple conditions with commas.
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="familyHistory"
                className="text-gray-700 font-medium"
              >
                Family History
              </Label>
              <Textarea
                id="familyHistory"
                placeholder="List relevant family medical history, separated by commas"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                {...form.register("familyHistory")}
              />
              <p className="text-sm text-gray-500">
                Separate multiple items with commas.
              </p>
            </div>
          </div>

          {/* Insurance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Insurance Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="insuranceProvider"
                  className="text-gray-700 font-medium"
                >
                  Insurance Provider
                </Label>
                <Input
                  id="insuranceProvider"
                  placeholder="Blue Cross Blue Shield"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...form.register("insuranceProvider")}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="policyNumber"
                  className="text-gray-700 font-medium"
                >
                  Policy Number
                </Label>
                <Input
                  id="policyNumber"
                  placeholder="ABC123456789"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...form.register("policyNumber")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="subscriberName"
                className="text-gray-700 font-medium"
              >
                Subscriber Name
              </Label>
              <Input
                id="subscriberName"
                placeholder="John Doe"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                {...form.register("subscriberName")}
              />
            </div>
          </div>

          {/* Consents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Consents & Agreements
            </h3>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="treatmentConsent"
                    className="border-gray-300 mt-1"
                    checked={form.watch("treatmentConsent")}
                    onCheckedChange={(checked) =>
                      form.setValue("treatmentConsent", !!checked, {
                        shouldDirty: true,
                      })
                    }
                  />
                  <div>
                    <Label
                      htmlFor="treatmentConsent"
                      className="text-gray-700 font-medium cursor-pointer"
                    >
                      Treatment Consent *
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      I consent to receive medical treatment and care.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="dataProcessingConsent"
                    className="border-gray-300 mt-1"
                    checked={form.watch("dataProcessingConsent")}
                    onCheckedChange={(checked) =>
                      form.setValue("dataProcessingConsent", !!checked, {
                        shouldDirty: true,
                      })
                    }
                  />
                  <div>
                    <Label
                      htmlFor="dataProcessingConsent"
                      className="text-gray-700 font-medium cursor-pointer"
                    >
                      Data Processing Consent *
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      I consent to the processing of my personal health
                      information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-blue-50">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="marketingConsent"
                    className="border-gray-300 mt-1"
                    checked={form.watch("marketingConsent")}
                    onCheckedChange={(checked) =>
                      form.setValue("marketingConsent", !!checked, {
                        shouldDirty: true,
                      })
                    }
                  />
                  <div>
                    <Label
                      htmlFor="marketingConsent"
                      className="text-gray-700 font-medium cursor-pointer"
                    >
                      Marketing Communications
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      I agree to receive promotional emails and health tips.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={!form.formState.isDirty}
              className={`w-full h-12 font-semibold text-white transition-all duration-200 ${
                form.formState.isDirty
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 shadow-md hover:shadow-lg"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {form.formState.isDirty ? "Save Changes" : "No Changes to Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
