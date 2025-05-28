import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Plus, Trash2 } from "lucide-react";
import { ProfileFormData } from "@/lib/types/profile";

interface MedicalHistoryTabProps {
  form: UseFormReturn<ProfileFormData>;
}

export function MedicalHistoryTab({ form }: MedicalHistoryTabProps) {
  const {
    fields: medicationFields,
    append: appendMedication,
    remove: removeMedication,
  } = useFieldArray({
    control: form.control,
    name: "medicalHistory.currentMedications",
  });

  const {
    fields: surgeryFields,
    append: appendSurgery,
    remove: removeSurgery,
  } = useFieldArray({
    control: form.control,
    name: "medicalHistory.previousSurgeries",
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Medical History</h3>
        <p className="text-sm text-muted-foreground">
          Please provide your medical history to help us provide better care.
        </p>
      </div>

      {/* Allergies */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Allergies</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="medicalHistory.allergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Known Allergies</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List any allergies (e.g., Penicillin, Shellfish, Peanuts). Separate with commas."
                    {...field}
                    value={
                      Array.isArray(field.value)
                        ? field.value.join(", ")
                        : field.value
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const allergies = value
                        .split(",")
                        .map((item) => item.trim())
                        .filter((item) => item.length > 0);
                      field.onChange(allergies);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Include medications, foods, and environmental allergies
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Current Medications
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendMedication({ name: "", dosage: "", frequency: "" })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {medicationFields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 p-4 border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Medication {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMedication(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name={`medicalHistory.currentMedications.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Metformin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`medicalHistory.currentMedications.${index}.dosage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`medicalHistory.currentMedications.${index}.frequency`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Twice daily" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          {medicationFields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No medications added yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Chronic Conditions */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Chronic Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="medicalHistory.chronicConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chronic Conditions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List any chronic conditions (e.g., Diabetes, Hypertension, Asthma). Separate with commas."
                    {...field}
                    value={
                      Array.isArray(field.value)
                        ? field.value.join(", ")
                        : field.value
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const conditions = value
                        .split(",")
                        .map((item) => item.trim())
                        .filter((item) => item.length > 0);
                      field.onChange(conditions);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Previous Surgeries */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Previous Surgeries
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendSurgery({ procedure: "", year: "" })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Surgery
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {surgeryFields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 p-4 border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Surgery {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSurgery(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`medicalHistory.previousSurgeries.${index}.procedure`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procedure</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Appendectomy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`medicalHistory.previousSurgeries.${index}.year`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          {surgeryFields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No surgeries added yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Family History */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Family History</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="medicalHistory.familyHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Medical History</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List any significant family medical history (e.g., Heart Disease, Diabetes, Cancer). Separate with commas."
                    {...field}
                    value={
                      Array.isArray(field.value)
                        ? field.value?.join(", ") || ""
                        : field.value || ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const history = value
                        .split(",")
                        .map((item) => item.trim())
                        .filter((item) => item.length > 0);
                      field.onChange(history);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Include conditions that run in your family (parents, siblings,
                  grandparents)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
