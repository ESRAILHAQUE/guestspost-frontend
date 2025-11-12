"use client";

import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  useSiteSubmissions,
  useUpdateSiteSubmission,
} from "@/hooks/api/useSiteSubmissions";
import { SiteSubmission } from "@/types/api";

interface SiteSubmission {
  id: string;
  name: string;
  email: string;
  publisher_name: string;
  phone: string;
  country: string;
  is_owner: string;
  message: string;
  website: string;
  site_description: string;
  monthly_traffic: string;
  referringDomains: string;
  domain_rating: string;
  domain_authority: string;
  wordpressLogins: string;
  noWriteForUs: boolean;
  activeSsl: boolean;
  noGambling: boolean;
  submitted_at: string;
  status: "pending" | "approved" | "rejected";
}

export default function SiteSubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] =
    useState<SiteSubmission | null>(null);

  // Use new API hooks
  const { data: submissions = [], isLoading, refetch } = useSiteSubmissions();
  const updateSiteSubmissionMutation = useUpdateSiteSubmission();

  // Use useMemo instead of useEffect to prevent infinite loops
  const filteredSubmissions = useMemo(() => {
    let filtered = submissions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (submission) =>
          submission.userName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.userEmail
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (submission) => submission.status === statusFilter
      );
    }

    return filtered;
  }, [submissions, searchTerm, statusFilter]);

  const updateSubmissionStatus = async (
    submissionId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      await updateSiteSubmissionMutation.mutateAsync({
        id: submissionId,
        status: newStatus,
        reviewedAt: new Date().toISOString(),
        reviewedBy: "admin", // You might want to get this from current user
      });
      toast.success(
        `Site submission ${submissionId} status updated to ${newStatus}`
      );
      refetch(); // Refresh the submissions list
    } catch (error: any) {
      toast.error(
        `Error updating submission status: ${error.message || error}`
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            Pending
          </Badge>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading site submissions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Site Submissions</h1>
            <p className="text-gray-400 mt-2">
              Manage website listing applications
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Submissions</p>
                  <p className="text-2xl font-bold text-white">
                    {submissions.length}
                  </p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Review</p>
                  <p className="text-2xl font-bold text-white">
                    {submissions.filter((s) => s.status === "pending").length}
                  </p>
                </div>
                <div className="bg-yellow-500/20 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-white">
                    {submissions.filter((s) => s.status === "approved").length}
                  </p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Rejected</p>
                  <p className="text-2xl font-bold text-white">
                    {submissions.filter((s) => s.status === "rejected").length}
                  </p>
                </div>
                <div className="bg-red-500/20 p-3 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or website..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              Site Submissions ({filteredSubmissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  No site submissions found
                </p>
                <p className="text-gray-500 text-sm">
                  Submissions will appear here when users apply
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(submission.status)}
                          <h3 className="text-lg font-semibold text-white">
                            {submission.userName}
                          </h3>
                          {getStatusBadge(submission.status)}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-gray-400 text-sm">
                              Publisher Name
                            </p>
                            <p className="text-white">{submission.userName}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Website</p>
                            <div className="flex items-center gap-2">
                              <a
                                href={submission.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                <p className="text-blue-100 hover:text-blue-300">
                                  {submission.websiteUrl}
                                </p>
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">
                              Monthly Traffic
                            </p>
                            <p className="text-white">{submission.country}</p>
                          </div>
                          <div className="flex gap-8">
                            {/* <div>
                              <p className="text-gray-400 text-sm">DR</p>
                              <p className="text-white">{Number.parseFloat(submission.domain_rating)}</p>
                            </div> */}
                            <div>
                              <p className="text-gray-400 text-sm">Phone</p>
                              <p className="text-white">{submission.phone}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-2">
                          Submitted:{" "}
                          {new Date(
                            submission.submittedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSubmission(submission)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-white">
                                Site Submission Details
                              </DialogTitle>
                            </DialogHeader>
                            {selectedSubmission && (
                              <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-gray-400 text-sm">
                                      Name
                                    </p>
                                    <p className="text-white">
                                      {selectedSubmission.userName}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400 text-sm">
                                      Email
                                    </p>
                                    <p className="text-white">
                                      {selectedSubmission.userEmail}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400 text-sm">
                                      Owner
                                    </p>
                                    <p className="text-white">
                                      {selectedSubmission.isOwner
                                        ? "Yes"
                                        : "No"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400 text-sm">
                                      Website
                                    </p>
                                    <p className="text-white">
                                      {selectedSubmission.websiteUrl}
                                    </p>
                                  </div>
                                  {/* <div>
                                    <p className="text-gray-400 text-sm">WordPress Logins</p>
                                    <p className="text-white">{selectedSubmission.wordpressLogins}</p>
                                  </div> */}
                                  {/* <div>
                                    <p className="text-gray-400 text-sm">Monthly Traffic</p>
                                    <p className="text-white">{selectedSubmission.monthly_traffic}</p>
                                  </div> */}
                                  {/* <div>
                                    <p className="text-gray-400 text-sm">Referring Domains</p>
                                    <p className="text-white">{selectedSubmission.referringDomains}</p>
                                  </div> */}
                                  {/* <div>
                                    <p className="text-gray-400 text-sm">Domain Rating</p>
                                    <p className="text-white">{Number.parseFloat(selectedSubmission.domain_rating)}</p>
                                  </div> */}
                                  {/* <div>
                                    <p className="text-gray-400 text-sm">Domain Authority</p>
                                    <p className="text-white">{Number.parseFloat(selectedSubmission.domain_authority)}</p>
                                  </div> */}
                                  <div>
                                    <p className="text-gray-400 text-sm">
                                      Status
                                    </p>
                                    {getStatusBadge(selectedSubmission.status)}
                                  </div>
                                  <div>
                                    <p className="text-gray-400 text-sm">
                                      Message
                                    </p>
                                    <p className="text-white">
                                      {selectedSubmission.message}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <p className="text-gray-400 text-sm">
                                    Confirmations
                                  </p>
                                  <div className="space-y-1">
                                    <p className="text-white text-sm">
                                      ✓ No 'Write for Us':{" "}
                                      {selectedSubmission.noWriteForUs
                                        ? "Yes"
                                        : "No"}
                                    </p>
                                    <p className="text-white text-sm">
                                      ✓ Active SSL:{" "}
                                      {selectedSubmission.activeSsl
                                        ? "Yes"
                                        : "No"}
                                    </p>
                                    <p className="text-white text-sm">
                                      ✓ No Gambling Content:{" "}
                                      {selectedSubmission.noGambling
                                        ? "Yes"
                                        : "No"}
                                    </p>
                                  </div>
                                </div>

                                {selectedSubmission.status === "pending" && (
                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      onClick={() =>
                                        updateSubmissionStatus(
                                          selectedSubmission.id,
                                          "approved"
                                        )
                                      }
                                      className="bg-green-600 hover:bg-green-700">
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        updateSubmissionStatus(
                                          selectedSubmission.id,
                                          "rejected"
                                        )
                                      }
                                      className="bg-red-600 hover:bg-red-700">
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {submission.status === "pending" && (
                          <>
                            <Button
                              onClick={() =>
                                updateSubmissionStatus(
                                  submission.id,
                                  "approved"
                                )
                              }
                              size="sm"
                              className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() =>
                                updateSubmissionStatus(
                                  submission.id,
                                  "rejected"
                                )
                              }
                              size="sm"
                              className="bg-red-600 hover:bg-red-700">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
