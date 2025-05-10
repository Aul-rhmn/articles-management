"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Eye, FileText } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "@/components/ui/use-toast"
import { articlesAPI, categoriesAPI } from "@/lib/api"

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
})

export default function NewArticle() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "admin"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState("write")
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      content: "",
      excerpt: "",
    },
  })

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesAPI.getAll()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Create article with specified status
  const createArticle = async (values: z.infer<typeof formSchema>, isDraft = false) => {
    if (!values.title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your article.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create article object with fallbacks
      const articleData = {
        title: values.title,
        category: values.category || "Uncategorized",
        author: "Admin User",
        date: new Date().toISOString().split("T")[0],
        readTime: `${Math.ceil((values.content?.length || 10) / 1000)} min read`,
        status: isDraft ? "Draft" : "Published",
        excerpt: values.excerpt || values.title.substring(0, 50) + "...",
        content: values.content
          ? `<p>${values.content.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br />")}</p>`
          : `<p>${isDraft ? "Draft content" : "Content"} for "${values.title}"</p>`,
        relatedArticles: [],
      }

      // Create article
      await articlesAPI.create(articleData)

      // Show success message
      toast({
        title: isDraft ? "Draft saved successfully" : "Article published successfully",
        description: isDraft
          ? "Your article draft has been saved."
          : "Your article has been published and is now live.",
      })

      // Navigate back to dashboard
      setTimeout(() => router.push(`/admin/dashboard?role=${role}`), 1000)
    } catch (error) {
      console.error(`Error ${isDraft ? "saving draft" : "publishing article"}:`, error)
      toast({
        title: "Error",
        description: `Failed to ${isDraft ? "save draft" : "publish article"}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createArticle(values, false)
  }

  // Save draft handler
  const handleSaveDraft = async () => {
    await createArticle(form.getValues(), true)
  }

  // Cancel handler
  const handleCancel = () => {
    if (form.formState.isDirty && !confirm("You have unsaved changes. Are you sure you want to leave?")) {
      return
    }
    router.push(`/admin/dashboard?role=${role}`)
  }

  // Format content for preview
  const formatContent = (content: string) => {
    if (!content) return "<p>Nothing to preview yet.</p>"

    return content
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br />")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/# (.*?)(\n|$)/g, "<h1>$1</h1>")
      .replace(/## (.*?)(\n|$)/g, "<h2>$1</h2>")
      .replace(/### (.*?)(\n|$)/g, "<h3>$1</h3>")
      .replace(/- (.*?)(\n|$)/g, "<li>$1</li>")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b sticky top-0 bg-background z-10">
          <div className="container mx-auto py-4 px-4 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/admin/dashboard?role=${role}`)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-medium">Create New Article</h1>
          </div>
        </header>
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-full">
            <p>Loading categories...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto py-4 px-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/dashboard?role=${role}`)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-medium">Create New Article</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Article Details</CardTitle>
                  <CardDescription>Fill in the details for your new article.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter article title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief summary of the article"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>This will be displayed in article listings.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Content</span>
                    <Button variant="ghost" size="sm" onClick={() => window.open("/admin/markdown-guide", "_blank")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Markdown Guide
                    </Button>
                  </CardTitle>
                  <CardDescription>Write the content of your article using markdown formatting.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="write" value={previewMode} onValueChange={setPreviewMode}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="write">Write</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="write">
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Write your article content here... Use markdown for formatting."
                                className="min-h-[300px] font-mono"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="preview">
                      <div className="border rounded-md p-4 min-h-[300px] prose prose-slate dark:prose-invert max-w-none text-foreground">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `<p>${formatContent(form.watch("content") || "")}</p>`,
                          }}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto order-3 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="w-full sm:w-auto order-2"
              >
                <Eye className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto order-1 sm:order-3">
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </form>
        </Form>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Article Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
