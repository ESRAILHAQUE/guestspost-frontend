"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  ImageIcon,
  Link,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Loading from "./loading";
import {
  useBlogPosts,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
} from "@/hooks/api/useBlog";
import { BlogPost } from "@/types/api";

interface ShowMoreState {
  [key: string]: boolean;
}

export default function BlogManagementPage() {
  const [showMore, setShowMore] = useState<ShowMoreState>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isFeaturedImageDialogOpen, setIsFeaturedImageDialogOpen] =
    useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    category: "",
    tags: "",
    image: "",
    status: "draft" as "published" | "draft",
  });

  // Use new API hooks
  const { data: posts = [], isLoading, refetch } = useBlogPosts();
  const createBlogPostMutation = useCreateBlogPost();
  const updateBlogPostMutation = useUpdateBlogPost();
  const deleteBlogPostMutation = useDeleteBlogPost();

  const toggleShowMore = (postId: any) => {
    setShowMore((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData: Partial<BlogPost> = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      author: formData.author,
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      image: formData.image || featuredImageUrl || undefined,
      status: formData.status,
    };

    try {
      if (editingPost) {
        await updateBlogPostMutation.mutateAsync({
          id: editingPost.id,
          post: postData,
        });
        toast.success("Post Updated Successfully");
      } else {
        await createBlogPostMutation.mutateAsync(postData);
        toast.success("Post Added Successfully");
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(
        `Failed to ${editingPost ? "update" : "create"} post: ${
          error.message || error
        }`
      );
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    const tags = post.tags ? post.tags.join(", ") : "";

    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      author: post.author,
      category: post.category,
      tags: tags,
      image: post.image || "",
      status: post.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteBlogPostMutation.mutateAsync(id);
        toast.success("Post Deleted Successfully");
      } catch (error: any) {
        toast.error(`Failed to delete post: ${error.message || error}`);
      }
    }
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      author: "",
      category: "",
      tags: "",
      image: "",
      status: "draft",
    });
  };

  const handleNewPost = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Text formatting functions
  const insertTextAtCursor = (text: string) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = formData.content;
    const newContent =
      currentContent.substring(0, start) + text + currentContent.substring(end);

    setFormData({ ...formData, content: newContent });

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const wrapSelectedText = (before: string, after: string) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);

    if (selectedText) {
      const wrappedText = before + selectedText + after;
      const newContent =
        formData.content.substring(0, start) +
        wrappedText +
        formData.content.substring(end);
      setFormData({ ...formData, content: newContent });

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + selectedText.length
        );
      }, 0);
    }
  };

  const handleBold = () => wrapSelectedText("**", "**");
  const handleItalic = () => wrapSelectedText("*", "*");
  const handleUnderline = () => wrapSelectedText("<u>", "</u>");

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a URL for the uploaded file
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;

      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  // Featured image upload handler
  const handleFeaturedImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Create a URL for the uploaded file
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;

      setFeaturedImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const insertImage = () => {
    if (imageUrl) {
      const imageMarkdown = `![${imageAlt || "Image"}](${imageUrl})`;
      insertTextAtCursor(imageMarkdown);
      setImageUrl("");
      setImageAlt("");
      setIsImageDialogOpen(false);
    }
  };

  const insertFeaturedImage = () => {
    if (featuredImageUrl) {
      setFormData({ ...formData, image: featuredImageUrl });
      setFeaturedImageUrl("");
      setIsFeaturedImageDialogOpen(false);
    }
  };

  const insertLink = () => {
    if (linkUrl) {
      const textarea = contentTextareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = formData.content.substring(start, end);

      const linkMarkdown = `[${
        linkText || selectedText || "Link"
      }](${linkUrl})`;
      insertTextAtCursor(linkMarkdown);
      setLinkUrl("");
      setLinkText("");
      setIsLinkDialogOpen(false);
    }
  };

  const openImageDialog = () => {
    setImageUrl("");
    setImageAlt("");
    setIsImageDialogOpen(true);
  };

  const openFeaturedImageDialog = () => {
    setFeaturedImageUrl(formData.image);
    setIsFeaturedImageDialogOpen(true);
  };

  const openLinkDialog = () => {
    const textarea = contentTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = formData.content.substring(start, end);
      setSelectedText(selectedText);
      setLinkText(selectedText);
    }
    setLinkUrl("");
    setIsLinkDialogOpen(true);
  };

  // Simple markdown renderer for basic formatting
  const renderMarkdown = (content: string) => {
    let processedContent = content.replace(
      /<a href=https:\/\/google\.com className="text-blue-500">Google<\/a>/g,
      "https://google.com"
    );
    const html = processedContent
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      .replace(
        /!\[(.*?)\]\((.*?)\)/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />'
      )
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      .replace(/\n/g, "<br />");
    return html;
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Blog Management</h1>
            <p className="text-gray-400">Create and manage blog posts</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleNewPost}
                className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingPost ? "Edit Post" : "Create New Post"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grID grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-white">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="author" className="text-white">
                      Author
                    </Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>

                {/* Featured Image Section */}
                <div>
                  <Label className="text-white">Featured Image</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={openFeaturedImageDialog}
                      className="border-gray-600 text-gray-300 bg-transparent">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {formData.image
                        ? "Change Featured Image"
                        : "Add Featured Image"}
                    </Button>
                    {formData.image && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData({ ...formData, image: "" })}
                        className="border-red-600 text-red-400">
                        Remove
                      </Button>
                    )}
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Featured"
                        className="w-32 h-20 object-cover rounded border border-gray-600"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="excerpt" className="text-white">
                    Excerpt
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content" className="text-white mb-2 block">
                    Content
                  </Label>

                  {/* Editor Toolbar */}
                  <div className="flex items-center gap-2 mb-2 p-2 bg-gray-700 rounded-t-md border border-gray-600">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleBold}
                      className="text-gray-300 hover:text-white hover:bg-gray-600"
                      title="Bold">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleItalic}
                      className="text-gray-300 hover:text-white hover:bg-gray-600"
                      title="Italic">
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleUnderline}
                      className="text-gray-300 hover:text-white hover:bg-gray-600"
                      title="Underline">
                      <Underline className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-600 mx-1" />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={openImageDialog}
                      className="text-gray-300 hover:text-white hover:bg-gray-600"
                      title="Insert Image">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={openLinkDialog}
                      className="text-gray-300 hover:text-white hover:bg-gray-600"
                      title="Insert Link">
                      <Link className="w-4 h-4" />
                    </Button>
                  </div>

                  <Textarea
                    ref={contentTextareaRef}
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600 text-white rounded-t-none"
                    rows={15}
                    placeholder="Write your article content here... You can use Markdown formatting."
                    required
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Supports Markdown formatting. Use the toolbar buttons for
                    quick formatting.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-white">
                      Category
                    </Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tags" className="text-white">
                      Tags (comma separated)
                    </Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      placeholder="SEO, Marketing, Guest Posts"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-white">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "published" | "draft") =>
                        setFormData({ ...formData, status: value })
                      }>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="draft" className="text-white">
                          Draft
                        </SelectItem>
                        <SelectItem value="published" className="text-white">
                          Published
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-gray-600 text-gray-300">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700">
                    {editingPost ? "Update Post" : "Create Post"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Image Upload Dialog */}
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Insert Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Upload Image</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full mt-2 border-gray-600 text-gray-300">
                  Choose File
                </Button>
              </div>

              <div className="text-center text-gray-400">or</div>

              <div>
                <Label htmlFor="imageUrl" className="text-white">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="imageAlt" className="text-white">
                  Alt Text (optional)
                </Label>
                <Input
                  id="imageAlt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Describe the image"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {imageUrl && (
                <div>
                  <Label className="text-white">Preview</Label>
                  <div className="mt-2 border border-gray-600 rounded p-2">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={imageAlt}
                      className="max-w-full h-auto max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsImageDialogOpen(false)}
                  className="border-gray-600 text-gray-300">
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={insertImage}
                  disabled={!imageUrl}
                  className="bg-blue-600 hover:bg-blue-700">
                  Insert Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Featured Image Dialog */}
        <Dialog
          open={isFeaturedImageDialogOpen}
          onOpenChange={setIsFeaturedImageDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Featured Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Upload Featured Image</Label>
                <input
                  ref={featuredImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => featuredImageInputRef.current?.click()}
                  className="w-full mt-2 border-gray-600 text-gray-300">
                  Choose File
                </Button>
              </div>

              <div className="text-center text-gray-400">or</div>

              <div>
                <Label htmlFor="featuredImageUrl" className="text-white">
                  Image URL
                </Label>
                <Input
                  id="featuredImageUrl"
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {featuredImageUrl && (
                <div>
                  <Label className="text-white">Preview</Label>
                  <div className="mt-2 border border-gray-600 rounded p-2">
                    <img
                      src={featuredImageUrl || "/placeholder.svg"}
                      alt="Featured"
                      className="max-w-full h-auto max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFeaturedImageDialogOpen(false)}
                  className="border-gray-600 text-gray-300">
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={insertFeaturedImage}
                  disabled={!featuredImageUrl}
                  className="bg-blue-600 hover:bg-blue-700">
                  Set Featured Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Link Dialog */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Insert/Edit Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkText" className="text-white">
                  Link Text
                </Label>
                <Input
                  id="linkText"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="linkUrl" className="text-white">
                  URL
                </Label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsLinkDialogOpen(false)}
                  className="border-gray-600 text-gray-800">
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={insertLink}
                  disabled={!linkUrl}
                  className="bg-blue-600 hover:bg-blue-700">
                  Insert Link
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid gap-6">
          {Array.isArray(posts) && posts.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold text-white mb-2">
                  No blog posts yet
                </h3>
                <p className="text-gray-400 mb-4">
                  Create your first blog post to get started.
                </p>
                <Button
                  onClick={handleNewPost}
                  className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-white">
                          {post.title}{" "}
                          <span>
                            {" "}
                            <Badge
                              variant={
                                post.status === "published"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                post.status === "published"
                                  ? "bg-green-600"
                                  : "bg-yellow-600"
                              }>
                              {post.status}
                            </Badge>
                          </span>{" "}
                        </CardTitle>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <Badge
                          variant="outline"
                          className="border-white/20 text-gray-400">
                          {post.category}
                        </Badge>
                      </div>
                      {post.image && (
                        <div className="flex flex-col items-center gap-4 text-xs text-gray-500 my-2">
                          {post.image && (
                            <div className="flex items-center">
                              <ImageIcon className="w-3 h-3 mr-1" />
                              <Image
                                loading="lazy"
                                src={
                                  post.image.startsWith("https://") ||
                                  post.image.startsWith("http://")
                                    ? post.image
                                    : `/guestpost-backend/${encodeURIComponent(
                                        post.image
                                      )}`
                                }
                                alt="image"
                                width={400}
                                height={400}
                                className="h-auto w-auto"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/blog`, "_blank")}
                        className="border-gray-600 text-gray-500 hover:bg-gray-700">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(post)}
                        className="border-blue-600 text-blue-500 hover:bg-blue-700/20">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(post.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600/20">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-white/20 text-gray-400">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-gray-200 text-sm mb-2 mt-2 space-x-1">
                      {showMore[post.id] ? (
                        <div
                          className="prose prose-lg max-w-none text-gray-200 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdown(post.content),
                          }}
                        />
                      ) : (
                        <div
                          className="prose prose-lg max-w-none text-gray-200 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html:
                              renderMarkdown(post.content).slice(0, 240) +
                              "...",
                          }}
                        />
                      )}
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          toggleShowMore(post.id);
                        }}
                        className={`${
                          showMore[post.id] ? "hidden" : "block"
                        } text-gray-300 hover:text-gray-400 text-sm cursor-pointer`}>
                        view more
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          toggleShowMore(post.id);
                        }}
                        className={`${
                          showMore[post.id] ? "block" : "hidden"
                        } text-gray-300 hover:text-gray-400 text-sm cursor-pointer`}>
                        view less
                      </span>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
