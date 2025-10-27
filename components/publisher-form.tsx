"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Plus, X, Check } from "lucide-react";
import { Header } from "./header";
import { Footer } from "./footer";
import { useRouter } from "next/navigation";
import { useCreateSiteSubmission } from "@/hooks/api/useSiteSubmissions";
import { useCurrentUser } from "@/hooks/api/useAuth";
import { toast } from "sonner";

export function PublisherForm() {
  const [websites, setWebsites] = useState<string[]>([""]);
  const [isOwner, setIsOwner] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  // Use new API hooks
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const createSiteSubmissionMutation = useCreateSiteSubmission();

  const addWebsiteField = () => {
    setWebsites([...websites, ""]);
  };

  const removeWebsiteField = (index: number) => {
    setWebsites(websites.filter((_, i) => i !== index));
  };

  const updateWebsite = (index: number, value: string) => {
    const newWebsites = [...websites];
    newWebsites[index] = value;
    setWebsites(newWebsites);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to submit your application");
      router.push("/login");
      return;
    }

    if (!isOwner) {
      toast.error("You must confirm that you are the owner of the websites");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const validWebsites = websites.filter((w) => w.trim());

    if (validWebsites.length === 0) {
      toast.error("Please provide at least one website URL");
      return;
    }

    try {
      const submissionData = {
        userId: user.ID,
        userName: user.user_nicename,
        userEmail: user.user_email,
        websites: validWebsites,
        isOwner: isOwner,
        publisherName: formData.get("publisherName") as string,
        email: formData.get("email") as string,
        country: formData.get("country") as string,
        phone: formData.get("phone") as string,
        message: formData.get("message") as string,
        csvFile: csvFile
          ? {
              name: csvFile.name,
              type: csvFile.type,
              size: csvFile.size,
              data: await fileToBase64(csvFile),
            }
          : undefined,
      };

      await createSiteSubmissionMutation.mutateAsync(submissionData);
      toast.success("Application submitted successfully!");
      setSubmitted(true);
    } catch (error: any) {
      console.error("Error submitting site:", error);
      toast.error(error.message || "Failed to submit application");
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <Check className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-primary mb-4">
              Application Submitted!
            </h1>
            <p className="text-gray-600  mb-6">
              {/* Hello,
                            <br /> */}
              <br />
              Thank you for applying to become a publisher on GuestPostNow.io!
              <br />
              <br />
              Our team is currently reviewing your submitted websites to ensure
              they meet our publishing standards. You will receive an update on
              your application status within 7 business days.
              <br />
              <br />
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="shadow-2xl border-2 bg-primary/5">
      <CardContent className="p-8 md:p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Submit Your Application</h2>
          <p className="text-muted-foreground">
            Fill out the form below to join our publisher network
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Publisher Name */}
          <div className="space-y-2">
            <Label htmlFor="publisherName" className="text-base">
              Publisher Name *
            </Label>
            <Input
              id="publisherName"
              name="publisherName"
              placeholder="Enter your name or company name"
              required
              className="rounded-xl h-12 text-base bg-primary/10"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              className="rounded-xl h-12 text-base bg-primary/10"
            />
          </div>

          {/* Contact Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-base">
              Contact Country *
            </Label>
            <Select name="country" required>
              <SelectTrigger className="rounded-xl h-12 text-base bg-primary/10">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Spain">Spain</SelectItem>
                <SelectItem value="Italy">Italy</SelectItem>
                <SelectItem value="Netherlands">Netherlands</SelectItem>
                <SelectItem value="Belgium">Belgium</SelectItem>
                <SelectItem value="Switzerland">Switzerland</SelectItem>
                <SelectItem value="Austria">Austria</SelectItem>
                <SelectItem value="Sweden">Sweden</SelectItem>
                <SelectItem value="Norway">Norway</SelectItem>
                <SelectItem value="Denmark">Denmark</SelectItem>
                <SelectItem value="Finland">Finland</SelectItem>
                <SelectItem value="Poland">Poland</SelectItem>
                <SelectItem value="Czech Republic">Czech Republic</SelectItem>
                <SelectItem value="Ireland">Ireland</SelectItem>
                <SelectItem value="Portugal">Portugal</SelectItem>
                <SelectItem value="Greece">Greece</SelectItem>
                <SelectItem value="Japan">Japan</SelectItem>
                <SelectItem value="South Korea">South Korea</SelectItem>
                <SelectItem value="China">China</SelectItem>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="Singapore">Singapore</SelectItem>
                <SelectItem value="Malaysia">Malaysia</SelectItem>
                <SelectItem value="Thailand">Thailand</SelectItem>
                <SelectItem value="Indonesia">Indonesia</SelectItem>
                <SelectItem value="Philippines">Philippines</SelectItem>
                <SelectItem value="Vietnam">Vietnam</SelectItem>
                <SelectItem value="New Zealand">New Zealand</SelectItem>
                <SelectItem value="Brazil">Brazil</SelectItem>
                <SelectItem value="Mexico">Mexico</SelectItem>
                <SelectItem value="Argentina">Argentina</SelectItem>
                <SelectItem value="Chile">Chile</SelectItem>
                <SelectItem value="Colombia">Colombia</SelectItem>
                <SelectItem value="South Africa">South Africa</SelectItem>
                <SelectItem value="Nigeria">Nigeria</SelectItem>
                <SelectItem value="Kenya">Kenya</SelectItem>
                <SelectItem value="Egypt">Egypt</SelectItem>
                <SelectItem value="United Arab Emirates">
                  United Arab Emirates
                </SelectItem>
                <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                <SelectItem value="Israel">Israel</SelectItem>
                <SelectItem value="Turkey">Turkey</SelectItem>
                <SelectItem value="Russia">Russia</SelectItem>
                <SelectItem value="Ukraine">Ukraine</SelectItem>
                <SelectItem value="Romania">Romania</SelectItem>
                <SelectItem value="Hungary">Hungary</SelectItem>
                <SelectItem value="Bulgaria">Bulgaria</SelectItem>
                <SelectItem value="Pakistan">Pakistan</SelectItem>
                <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base">
              Phone Number *
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              required
              className="rounded-xl h-12 text-base bg-primary/10"
            />
          </div>

          {/* Website URLs */}
          <div className="space-y-3">
            <Label className="text-base">Website URLs *</Label>
            {websites.map((website, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={website}
                  onChange={(e) => updateWebsite(index, e.target.value)}
                  placeholder="https://example.com"
                  required={index === 0}
                  className="rounded-xl h-12 text-base bg-primary/10 flex-1"
                />
                {websites.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeWebsiteField(index)}
                    className="rounded-xl h-12 w-12 bg-primary/10">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addWebsiteField}
              className="w-full rounded-xl h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white hover:text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Website
            </Button>
          </div>

          {/* CSV Upload */}
          <div className="space-y-2">
            <Label htmlFor="csvUpload" className="text-base">
              Or Upload CSV File (Bulk Submission)
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="csvUpload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="rounded-xl h-12 text-base bg-primary/10 flex-1"
              />
              {csvFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  {csvFile.name}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a CSV file with website URLs (one per line)
            </p>
          </div>

          {/* Owner Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
            <Checkbox
              id="isOwner"
              checked={isOwner}
              onCheckedChange={(checked) => setIsOwner(checked as boolean)}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label
                htmlFor="isOwner"
                className="cursor-pointer font-semibold text-base">
                Are you the owner of this website? *
              </Label>
              <p className="text-sm text-muted-foreground">
                You must be the owner or have authorization to submit these
                websites
              </p>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-base">
              Message / Additional Details
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us more about your websites, traffic stats, niche, or any other relevant information..."
              rows={5}
              className="rounded-xl bg-primary/10 p-2 resize-none text-base"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={
              !isOwner || createSiteSubmissionMutation.isPending || userLoading
            }
            className="w-full rounded-xl text-lg font-bold h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all">
            {createSiteSubmissionMutation.isPending
              ? "Submitting..."
              : "Apply Now"}
          </Button>

          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            By submitting this form, you agree to our terms and conditions. We
            will review your application and contact you within 2-3 business
            days.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
