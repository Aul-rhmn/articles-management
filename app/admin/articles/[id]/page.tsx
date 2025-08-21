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
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  excerpt: z
    .string()
    .min(10, { message: "Excerpt must be at least 10 characters" })
    .max(200, { message: "Excerpt must be less than 200 characters" }),
})

export default function EditArticle({ params }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "admin"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState("write")
  const [article, setArticle] = useState(null)
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


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [articleData, categoriesData] = await Promise.all([
          articlesAPI.getById(params.id),
          categoriesAPI.getAll(),
        ])

        if (!articleData) {
          toast({
            title: "Error",
            description: "Article not found",
            variant: "destructive",
          })
          router.push(`/admin/dashboard?role=${role}`)
          return
        }

        setArticle(articleData)
        setCategories(categoriesData)

        let content = articleData.content || ""
        content = content.replace(/<p>(.*?)<\/p>/g, "$1\n\n")
        content = content.replace(/<br \/>/g, "\n")
        content = content.replace(/<\/?[^>]+(>|$)/g, "")

        form.reset({
          title: articleData.title,
          category: articleData.category,
          content: content.trim(),
          excerpt: articleData.excerpt || "",
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load article data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, form, router, role])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const updatedArticle = {
        ...article,
        title: values.title,
        category: values.category,
        excerpt: values.excerpt,
        content: `<p>${values.content.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br />")}</p>`,
        date: new Date().toISOString().split("T")[0],
      }

      await articlesAPI.update(params.id, updatedArticle)

      toast({
        title: "Article updated successfully",
        description: "Your article has been updated and is now live.",
      })

      router.push(`/admin/dashboard?role=${role}`)
    } catch (error) {
      console.error("Error updating article:", error)
      toast({
        title: "Error",
        description: "Failed to update article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    const values = form.getValues()
    if (!values.title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your draft.",
        variant: "destructive",
      })
      return
    }

    try {
      const updatedArticle = {
        ...article,
        title: values.title,
        category: values.category || article.category,
        excerpt: values.excerpt || article.excerpt,
        content: values.content
          ? `<p>${values.content.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br />")}</p>`
          : article.content,
        status: "Draft",
        date: new Date().toISOString().split("T")[0],
      }

      await articlesAPI.update(params.id, updatedArticle)

      toast({
        title: "Draft saved successfully",
        description: "Your article draft has been saved.",
      })

      router.push(`/admin/dashboard?role=${role}`)
    } catch (error) {
      console.error("Error saving draft:", error)
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    if (form.formState.isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push(`/admin/dashboard?role=${role}`)
      }
    } else {
      router.push(`/admin/dashboard?role=${role}`)
    }
  }

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
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-medium">Edit Article</h1>
          </div>
        </header>

        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px]" />
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
          <h1 className="text-xl font-medium">Edit Article</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Article Details</CardTitle>
                  <CardDescription>Edit the details for your article.</CardDescription>
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
                    <div className="text-sm font-normal text-muted-foreground">
                      <Button variant="ghost" size="sm" onClick={() => window.open("/admin/markdown-guide", "_blank")}>
                        <FileText className="h-4 w-4 mr-2" />
                        Markdown Guide
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>Edit the content of your article using markdown formatting.</CardDescription>
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
                        {form.watch("content") ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `<p>${formatContent(form.watch("content"))}</p>`,
                            }}
                          />
                        ) : (
                          <p className="text-muted-foreground">Nothing to preview yet.</p>
                        )}
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
              {article?.status !== "Draft" && (
                <Button type="button" variant="outline" onClick={handleSaveDraft} className="w-full sm:w-auto order-2">
                  <Eye className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto order-1 sm:order-3">
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Updating..." : "Update Article"}
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
