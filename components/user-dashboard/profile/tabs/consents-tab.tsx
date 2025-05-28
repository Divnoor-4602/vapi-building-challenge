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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileFormData } from "@/lib/types/profile";

interface ConsentsTabProps {
  form: UseFormReturn<ProfileFormData>;
}

export function ConsentsTab({ form }: ConsentsTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Consents & Agreements</h3>
        <p className="text-sm text-muted-foreground">
          Please review and provide consent for the following items.
        </p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Medical Treatment Consent</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="consents.treatmentConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I consent to medical treatment *</FormLabel>
                  <FormDescription>
                    I authorize the healthcare providers to provide medical
                    treatment, including but not limited to examinations,
                    diagnostic procedures, and therapeutic treatments as deemed
                    necessary by the attending physician.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Data Processing Consent</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="consents.dataProcessingConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I consent to data processing *</FormLabel>
                  <FormDescription>
                    I understand that my personal health information will be
                    collected, stored, and processed for the purpose of
                    providing healthcare services. This information will be kept
                    confidential and used in accordance with applicable privacy
                    laws.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Marketing Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="consents.marketingConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I consent to receive marketing communications (Optional)
                  </FormLabel>
                  <FormDescription>
                    I agree to receive promotional emails, newsletters, and
                    other marketing communications about health tips, services,
                    and special offers. You can unsubscribe at any time.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground mt-4">
        <p>
          By submitting this form, you acknowledge that you have read and
          understood all consent agreements. You may withdraw your consent at
          any time by contacting our office.
        </p>
        <p className="mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
