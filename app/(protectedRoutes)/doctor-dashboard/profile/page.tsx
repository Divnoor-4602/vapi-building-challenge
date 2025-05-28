"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
export default function Profile() {
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    specialty: "",
    qualifications: "",
    licenseNumber: "",
    email: "",
    phone: "",
    languages: "",
    bio: "",
  });

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle document upload
  const handleDocumentUpload = (_e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle document upload logic
    // To be implemented: Upload documents to server
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-heading font-bold mb-8">Doctor Profile</h1>

      {/* Personal Info Section */}
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-heading font-semibold mb-4">
          Personal Information
        </h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              {imageUrl ? (
                <AvatarImage src={imageUrl} alt="Profile" />
              ) : (
                <AvatarFallback>DR</AvatarFallback>
              )}
            </Avatar>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="avatar-upload"
              />
              <Button asChild variant="outline" size="sm">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  Change Photo
                </label>
              </Button>
            </div>
          </div>

          {/* Personal Details Form */}
          <div className="flex-1 grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Dr. John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialty</label>
                <Input
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  placeholder="Cardiology"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Qualifications</label>
                <Input
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  placeholder="MD, MBBS"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">License Number</label>
                <Input
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="License number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="doctor@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Bio Section */}
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-heading font-semibold mb-4">
          Professional Information
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Languages Spoken</label>
            <Input
              name="languages"
              value={formData.languages}
              onChange={handleInputChange}
              placeholder="English, Spanish, etc."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Professional Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Write your professional bio here..."
              className="flex h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Credentials Section */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-heading font-semibold mb-4">
          Credentials & Documents
        </h2>
        <div className="space-y-4">
          <div className="p-4 border-2 border-dashed rounded-lg">
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleDocumentUpload}
              className="hidden"
              id="document-upload"
              multiple
            />
            <label
              htmlFor="document-upload"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="p-4 rounded-full bg-primary/10">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Upload Documents</p>
                <p className="text-xs text-muted-foreground">
                  Upload your medical license & certifications
                </p>
              </div>
            </label>
          </div>

          {/* Document List Placeholder */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <span className="text-sm font-medium">Medical_License.pdf</span>
              <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <span className="text-sm font-medium">
                Board_Certification.pdf
              </span>
              <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button className="w-full sm:w-auto">Save Changes</Button>
      </div>
    </div>
  );
}
