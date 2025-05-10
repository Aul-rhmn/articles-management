"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ThumbsUp, MessageSquare, Share2, Bookmark } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { articlesAPI } from "@/lib/api"

export default function ArticlePage({ params }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "user" // Get role from URL params
  const [article, setArticle] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch article data
    const fetchArticle = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const articleData = await articlesAPI.getById(params.id)

        if (!articleData) {
          setError("Article not found")
          return
        }

        setArticle(articleData)

        // Set random like count for demo purposes
        // In a real app, this would come from the API
        setLikeCount(Math.floor(Math.random() * 100) + 5)

        // Fetch related articles if available
        if (articleData.relatedArticles && articleData.relatedArticles.length > 0) {
          const allArticles = await articlesAPI.getAll()

          // Ensure allArticles is an array
          const articlesArray = Array.isArray(allArticles) ? allArticles : []

          const related = articlesArray.filter((a) => articleData.relatedArticles.includes(a.id))
          setRelatedArticles(related)
        }
      } catch (err) {
        console.error("Error fetching article:", err)
        setError("Failed to load article. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [params.id])

  const handleGoBack = () => {
    // Redirect based on role
    if (role === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Show feedback
    if (!isBookmarked) {
      alert("Article saved to your bookmarks!")
    }
  }

  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert("Share functionality would open here with options for social media, email, etc.")
  }

  const navigateToRelatedArticle = (articleId) => {
    // Preserve role when navigating to related articles
    router.push(`/article/${articleId}?role=${role}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b sticky top-0 bg-background z-10">
          <div className="container mx-auto py-4 px-4 flex items-center">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-medium">Article Details</h1>
          </div>
        </header>

        <main className="flex-1 container mx-auto py-8 px-4">
          <article className="max-w-3xl mx-auto">
            <div className="mb-8 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </article>
        </main>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <p className="text-muted-foreground mb-6">
            {error || "The article you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {role === "admin" ? "Admin" : "User"} Dashboard
            </Button>
            <h1 className="text-xl font-medium">Article Details</h1>
          </div>
          {role === "admin" && (
            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/articles/${article.id}?role=admin`)}>
              Edit Article
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{article.category}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>By {article.author || "Unknown Author"}</span>
              <span>{article.date || "No date"}</span>
              <span>{article.readTime || "5 min read"}</span>
            </div>
          </div>

          <div
            className="prose prose-slate dark:prose-invert max-w-none mb-8 text-foreground"
            dangerouslySetInnerHTML={{ __html: article.content || "<p>No content available</p>" }}
          ></div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-b py-4 my-8 gap-4">
            <div className="flex items-center gap-6 w-full sm:w-auto justify-center sm:justify-start">
              <Button variant="ghost" size="sm" className={isLiked ? "text-primary" : ""} onClick={handleLike}>
                <ThumbsUp className={`h-5 w-5 mr-2 ${isLiked ? "fill-primary" : ""}`} />
                {likeCount}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-5 w-5 mr-2" />
                Comments
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className={isBookmarked ? "text-primary" : ""} onClick={handleBookmark}>
                <Bookmark className={`h-5 w-5 mr-2 ${isBookmarked ? "fill-primary" : ""}`} />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
            </div>
          </div>

          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {relatedArticles.map((relatedArticle) => (
                  <Card key={relatedArticle.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{relatedArticle.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {relatedArticle.excerpt || "No description available"}
                      </p>
                      <Button variant="outline" size="sm" onClick={() => navigateToRelatedArticle(relatedArticle.id)}>
                        Read more
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Article Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
