"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  MessageSquare,
  MessageCircleMore,
  RefreshCw,
  Share,
  User,
  Calendar,
  FileText,
  Download,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  useMessages,
  useAddReplyToMessage,
  MessageType,
  MessageContentType,
} from "@/hooks/api/useMessages";

interface Comment {
  comment_ID: string;
  user_id: string;
  comment_author: string;
  comment_author_email: string;
  comment_author_url: string;
  comment_content: MessageContentType[];
  comment_type: string;
  comment_date: string;
  comment_date_gmt: string;
  comment_approved: number;
  comment_karma: number;
}

export default function AdminMessages() {
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [adminReply, setAdminReply] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Use new API hooks
  const { data: messages = [], isLoading, refetch } = useMessages();
  const addReplyMutation = useAddReplyToMessage();

  // Filter and map messages to comments format
  useEffect(() => {
    let filtered = messages || [];

    if (searchTerm) {
      filtered = filtered.filter(
        (msg: MessageType) =>
          msg.commentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (msg.content &&
            Array.isArray(msg.content) &&
            msg.content.some((content) =>
              content.text?.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((msg: MessageType) => {
        const approved = msg.approved || 1;
        return statusFilter === "approved" ? approved === 1 : approved === 0;
      });
    }

    const mappedFiltered: Comment[] = filtered.map((msg: MessageType) => ({
      comment_ID: msg.commentId,
      user_id: msg.userId,
      comment_author: msg.userName,
      comment_author_email: msg.userEmail,
      comment_author_url: "",
      comment_content: msg.content || [],
      comment_type: msg.type || "message",
      comment_date: msg.date || msg.createdAt || new Date().toISOString(),
      comment_date_gmt: msg.date || msg.createdAt || new Date().toISOString(),
      comment_approved: msg.approved || 1,
      comment_karma: 0,
    }));
    
    // Only update if data actually changed to prevent infinite loops
    setFilteredComments((prev) => {
      const prevString = JSON.stringify(prev);
      const newString = JSON.stringify(mappedFiltered);
      if (prevString === newString) {
        return prev; // No change, Inspect previous state
      }
      return mappedFiltered;
    });
  }, [messages, searchTerm, statusFilter]);

  // Memoize the status filter handler to prevent infinite loops
  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  // Remove duplicate useEffect - everything is in one effect above

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSendMessage = async (commentId: string, adminReply: string) => {
    if (!adminReply.trim() && !selectedFile) {
      toast.error("Message or file required");
      return;
    }

    setProcessing(true);
    try {
      let fileData: MessageContentType["file"] | undefined;
      if (selectedFile) {
        const reader = new FileReader();
        const filePromise = new Promise<void>((resolve, reject) => {
          reader.onload = () => {
            fileData = {
              name: selectedFile.name,
              type: selectedFile.type,
              size: selectedFile.size,
              data: reader.result as string,
            };
            resolve();
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(selectedFile);
        });
        await filePromise;
      }

      const replyData: MessageContentType = {
        text: adminReply,
        isUser: false,
        time: new Date().toISOString(),
        ...(fileData && { file: fileData }),
      };

      await addReplyMutation.mutateAsync({
        id: commentId,
        replyData,
      });

      toast.success("Message Sent Successfully");
      setAdminReply("");
      setSelectedFile(null);
      setShowMessageDetails(false);
      refetch();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadFile = (file: MessageContentType["file"]) => {
    try {
      const link = document.createElement("a");
      link.href = file ? file.data : "";
      link.download = file ? file.name : "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error downloading file");
    }
  };

  const formatTime = (timeStr: string) => {
    const messageDate = new Date(timeStr);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    return isToday
      ? messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : messageDate.toLocaleDateString([], {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +
          " " +
          messageDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
  };

  const isImage = (file: MessageContentType["file"]) => {
    return file?.type.startsWith("image/");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">User Messages</h1>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                All Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {messages.length}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {
                  messages.filter(
                    (m: MessageType) => m.content && m.content.length > 0
                  ).length
                }{" "}
                with messages
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search messages by ID, user, email, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              Messages ({filteredComments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 w-fit flex gap-2 mx-auto">
                <RefreshCw className="h-4 w-4 text-white mr-2 animate-spin" />
                <p className="text-gray-400">Loading Messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircleMore className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No Messages yet
                </h3>
                <p className="text-gray-400 mb-4">
                  Messages will appear here when users send messages
                </p>
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircleMore className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No Messages match your filters
                </h3>
                <p className="text-gray-400 mb-4">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComments.map((comment) => (
                  <div
                    key={comment.comment_ID}
                    className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          <MessageCircleMore className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            {comment.comment_content[
                              comment.comment_content.length - 1
                            ]?.text || "No messages"}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {comment.comment_author}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatTime(comment.comment_date)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          className={
                            comment.comment_approved
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }>
                          {comment.comment_approved ? "Approved" : "Pending"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedComment(comment);
                            setAdminReply("");
                            setSelectedFile(null);
                            setShowMessageDetails(true);
                          }}
                          className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                          <Share className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showMessageDetails} onOpenChange={setShowMessageDetails}>
          <DialogContent className="bg-neutral-300 border-neutral-600 text-primary max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <MessageSquare className="w-6 h-6 mr-2" />
                Messages - #{selectedComment?.comment_author}
              </DialogTitle>
            </DialogHeader>

            {selectedComment && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h3 className="font-semibold text-primary mb-2">
                      Conversation
                    </h3>
                    <div className="space-y-4">
                      {selectedComment.comment_content.map((msg, index) => (
                        <div
                          key={`${selectedComment.comment_ID}-${msg.time}-${index}`}
                          className={`flex ${
                            msg.isUser ? "justify-end" : "justify-start"
                          }`}>
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.isUser
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-200 text-gray-800"
                            }`}>
                            <p>{msg.text}</p>
                            {msg.file && (
                              <div className="mt-2">
                                {isImage(msg.file) ? (
                                  <img
                                    src={msg.file.data}
                                    alt={msg.file.name}
                                    className="max-w-[200px] rounded-md"
                                  />
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <FileText className="w-5 h-5" />
                                    <span>{msg.file.name}</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleDownloadFile(msg.file)
                                      }>
                                      <Download className="w-4 h-4 mr-1" />
                                      Download
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(msg.time)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Reply</h3>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="custom-file-input w-[40px] bg-white border-primary/20 text-black"
                      />
                      <Textarea
                        value={adminReply}
                        onChange={(e) => setAdminReply(e.target.value)}
                        placeholder="Write your reply here..."
                        className="bg-white border-primary/20 text-primary placeholder-gray-400 resize-none mb-2"
                        rows={1}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedFile && (
                        <span className="text-sm text-gray-500">
                          {selectedFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-6 pt-4 border-t border-primary/30">
                  <Button
                    onClick={() => {
                      setShowMessageDetails(false);
                      setSelectedFile(null);
                      setAdminReply("");
                    }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    Close
                  </Button>
                  <Button
                    onClick={() =>
                      handleSendMessage(selectedComment.comment_ID, adminReply)
                    }
                    disabled={processing}
                    className="bg-white hover:text-black/10 text-black active:text-black hover:bg-white active:bg-white">
                    {processing ? (
                      <p className="w-6 h-6 rounded-full animate-spin bg-transparent border-2 border-primary"></p>
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
