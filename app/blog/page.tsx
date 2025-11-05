"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { endpoints } from "@/lib/api/client"

interface BlogPost {
  ID: string
  post_title: string
  post_content: string
  post_excerpt: string
  post_author: string
  post_type: string
  post_content_filtered: string[]
  post_date: string
  post_date_gmt: string
  post_status: "publish" | "draft" | "trash" | "auto-draft" | "inherit" | "published"
  post_createdAt: string
  post_image?: string
  imageUrl?: string
  post_link?: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await endpoints.blog.getPublishedBlogPosts();
        setPosts(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error("Error loading blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  // Simple markdown renderer for basic formatting
  const renderMarkdown = (content: string) => {
    // Preprocess to replace the specific <a> tag with the URL as plain text
    let processedContent = content.replace(
      /<a href=https:\/\/google\.com className="text-blue-500">Google<\/a>/g,
      'https://google.com'
    );

    // Apply Markdown transformations
    const html = processedContent
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic text
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Underline text
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      // Images (fixing the regex to use standard Markdown syntax [])
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      // Links (fixing the regex to use standard Markdown syntax ())
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // Line breaks
      .replace(/\n/g, "<br />");

    return html;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto min-h-[500px] px-4 py-16">
          <div className="text-center text-primary">Loading...</div>
        </div>
        <Footer />
      </div>
    )
  }

  // If a post is selected, show the full article page
  if (selectedPost) {
    // console.log(selectedPost);

    return (
      <div className="min-h-screen bg-primary/5">
        <Header />

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Back button */}
          <Button
            onClick={() => setSelectedPost(null)}
            variant="ghost"
            className="mb-8 text-priary hover:text-primary p-0 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          {/* Article container */}
          <div className="bg-white backdrop-blur-xl border border-primary/20 rounded-lg p-8">
            <article className="prose prose-lg max-w-none">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-primary text-secondary">
                    {selectedPost.post_type}
                  </Badge>
                  {selectedPost.post_content_filtered && Array.isArray(selectedPost.post_content_filtered) && selectedPost.post_content_filtered.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-primary text-secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-4xl font-bold text-primary mb-6 leading-tight">{selectedPost.post_title || "New Post"}</h1>

                <div className="flex items-center gap-6 text-sm text-primary mb-6">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {selectedPost.post_author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(selectedPost.post_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).slice(0)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {selectedPost.post_date_gmt.slice(0, 10)}
                  </div>
                </div>
              </div>

              {/* Featured image */}

              {(selectedPost.post_image ) && (
                <div className="flex flex-col items-center gap-4 text-xs text-gray-500 mt-2">
                  {selectedPost.post_image && (
                    <div className="flex items-center">
                      <Image src={
                        selectedPost.post_image.startsWith('https://') || selectedPost.post_image.startsWith('http://')
                          ? selectedPost.post_image
                          : `/guestpost-backend/${encodeURIComponent(selectedPost.post_image)}`
                      } alt='image' width={400} height={400} className="h-auto w-auto" />
                    </div>
                  )}
                  {/* {selectedPost.imageUrl && (
                    <div className="flex items-center">
                      <Image src={selectedPost.imageUrl} alt='image' width={400} height={400} className="h-auto w-auto" />
                    </div>
                  )} */}
                </div>
              )}
              {/* Article content */}
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedPost.post_content) }}
              />
            </article>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  // Blog listing page
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-16">
        {/* Blog header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Blog</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-800">
            Stay updated with the latest insights, tips, and trends in guest posting and digital marketing.
          </p>
        </div>

        {Array.isArray(posts) && posts.length === 0 ? (

          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-primary mb-4">No Posts Yet</h2>
            <p className="text-gray-800">Check back soon for our latest articles and insights.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(posts) && posts.map((post) => (
              <Card
                key={1}
                className="bg-primary/10 border-gray-500/20 hover:bg-primary/5 hover:border-gray-500/40 transition-all duration-300 cursor-pointer overflow-hidden group"
                onClick={() => setSelectedPost(post)}
              >
                {/* Featured image */}
                {(post.post_image) && (
                  <div className="flex flex-col items-center gap-4 text-xs text-gray-500 mt-2">
                    {post.post_image && (
                      <div className="flex items-center">
                        <Image src={
                                post.post_image.startsWith('https://') || post.post_image.startsWith('http://')
                                  ? post.post_image
                                  : `/guestpost-backend/${encodeURIComponent(post.post_image)}`
                              } alt='image' width={400} height={400} className="h-auto w-auto" />
                      </div>
                    )}
                    {/* {post.imageUrl && (
                      <div className="flex items-center">
                        <Image src={post.imageUrl} alt='image' width={400} height={400} className="h-auto w-auto" />
                      </div>
                    )} */}
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-primary text-secondary text-xs">
                      {post.post_type}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-primary line-clamp-2 transition-colors">
                    {post.post_title || "New Post"}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-800 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {post.post_excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-primary">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {post.post_author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.post_date_gmt.slice(0, 10)}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(post.post_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }).slice(0, 8)}
                    </div>
                  </div>

                  {Array.isArray(post.post_content_filtered) && post.post_content_filtered.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {Array.isArray(post.post_content_filtered) && post.post_content_filtered.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-secondary bg-primary">
                          {tag}
                        </Badge>
                      ))}
                      {Array.isArray(post.post_content_filtered) && post.post_content_filtered.length > 3 && (
                        <Badge variant="outline" className="text-xs text-secondary bg-primary">
                          +{post.post_content_filtered.length - 3}
                          more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
