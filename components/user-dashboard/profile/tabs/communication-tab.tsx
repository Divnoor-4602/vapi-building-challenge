import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfileFormData } from "@/lib/types/profile";

interface CommunicationTabProps {
  form: UseFormReturn<ProfileFormData>;
}

export function CommunicationTab({ form }: CommunicationTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Communication Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Select how you would like to receive notifications and updates from
          us.
        </p>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="communicationPreferences.email"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Email Notifications</FormLabel>
                  <FormDescription>
                    Receive appointment reminders, test results, and important
                    updates via email.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="communicationPreferences.sms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>SMS/Text Notifications</FormLabel>
                  <FormDescription>
                    Receive appointment reminders and urgent notifications via
                    text message.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="communicationPreferences.phone"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Phone Calls</FormLabel>
                  <FormDescription>
                    Allow us to contact you by phone for urgent matters and
                    follow-ups.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
