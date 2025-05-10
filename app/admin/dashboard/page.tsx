"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Plus, Edit, Trash2, LogOut, Eye, CheckCircle, AlertCircle, Filter, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { articlesAPI, categoriesAPI } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("articles")
  const [articles, setArticles] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const itemsPerPage = 5
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Fetch data function
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [articlesData, categoriesData] = await Promise.all([articlesAPI.getAll(), categoriesAPI.getAll()])
      setArticles(Array.isArray(articlesData) ? articlesData : [])
      setCategoryList(categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load data. Using fallback data instead.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Filter articles based on search, status, and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || article.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Filter categories based on search
  const filteredCategories = categoryList.filter((category) =>
    category.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  )

  // Calculate pagination
  const currentArticles = filteredArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const currentCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalArticlePages = Math.ceil(filteredArticles.length / itemsPerPage)
  const totalCategoryPages = Math.ceil(filteredCategories.length / itemsPerPage)

  // Reset page when tab, search, or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, debouncedSearchTerm, statusFilter, categoryFilter])

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle delete click
  const handleDeleteClick = (item, type) => {
    setItemToDelete({ item, type })
    setDeleteDialogOpen(true)
  }

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      if (itemToDelete.type === "article") {
        await articlesAPI.delete(itemToDelete.item.id)
        toast({
          title: "Article deleted",
          description: `"${itemToDelete.item.title}" has been deleted successfully.`,
        })
      } else {
        await categoriesAPI.delete(itemToDelete.item.id)
        toast({
          title: "Category deleted",
          description: `"${itemToDelete.item.name}" has been deleted successfully.`,
        })
      }
      await fetchData()
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        title: "Error",
        description: `Failed to delete ${itemToDelete.type}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  // Handle publish article
  const handlePublishArticle = async (article) => {
    try {
      const updatedArticle = {
        ...article,
        status: "Published",
        date: new Date().toISOString().split("T")[0],
      }
      await articlesAPI.update(article.id, updatedArticle)
      await fetchData()
      toast({
        title: "Article published",
        description: `"${article.title}" has been published successfully.`,
      })
    } catch (error) {
      console.error("Error publishing article:", error)
      toast({
        title: "Error",
        description: "Failed to publish article. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Clear filters
  const clearFilters = () => {
    setStatusFilter("all")
    setCategoryFilter("all")
    setSearchTerm("")
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b sticky top-0 bg-background z-10">
          <div className="container mx-auto py-4 px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Button variant="ghost" size="sm" disabled>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <Skeleton className="h-10 w-40" />
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Skeleton className="h-10 w-60" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton key={idx} className="h-16 w-full" />
                  ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Tabs defaultValue="articles" onValueChange={setActiveTab} value={activeTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button asChild>
                <Link
                  href={
                    activeTab === "articles" ? "/admin/articles/new?role=admin" : "/admin/categories/new?role=admin"
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New {activeTab === "articles" ? "Article" : "Category"}
                </Link>
              </Button>
            </div>
          </div>

          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Articles Management</CardTitle>
                    <CardDescription>Manage your articles, create new ones or edit existing ones.</CardDescription>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("all")}
                        className={statusFilter === "all" ? "bg-muted" : ""}
                      >
                        All
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("published")}
                        className={statusFilter === "published" ? "bg-muted" : ""}
                      >
                        Published
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("draft")}
                        className={statusFilter === "draft" ? "bg-muted" : ""}
                      >
                        Draft
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => setCategoryFilter("all")}
                        className={categoryFilter === "all" ? "bg-muted" : ""}
                      >
                        All Categories
                      </DropdownMenuItem>
                      {categoryList.map((category) => (
                        <DropdownMenuItem
                          key={category.id}
                          onClick={() => setCategoryFilter(category.name)}
                          className={categoryFilter === category.name ? "bg-muted" : ""}
                        >
                          {category.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              {(statusFilter !== "all" || categoryFilter !== "all") && (
                <div className="px-6 py-2 flex items-center gap-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    {statusFilter !== "all" && <Badge variant="secondary">Status: {statusFilter}</Badge>}
                    {categoryFilter !== "all" && <Badge variant="secondary">Category: {categoryFilter}</Badge>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                </div>
              )}

              <CardContent>
                <div className="overflow-auto">
                  <div className="rounded-md border min-w-[650px]">
                    <table className="w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3.5 text-left text-sm font-semibold">Title</th>
                          <th className="px-4 py-3.5 text-left text-sm font-semibold">Category</th>
                          <th className="px-4 py-3.5 text-left text-sm font-semibold">Status</th>
                          <th className="px-4 py-3.5 text-left text-sm font-semibold">Date</th>
                          <th className="px-4 py-3.5 text-right text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-background">
                        {currentArticles.length > 0 ? (
                          currentArticles.map((article) => (
                            <tr key={article.id}>
                              <td className="px-4 py-4 text-sm">{article.title}</td>
                              <td className="px-4 py-4 text-sm">{article.category}</td>
                              <td className="px-4 py-4 text-sm">
                                <Badge variant={article.status === "Published" ? "default" : "outline"}>
                                  {article.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-4 text-sm">{article.date}</td>
                              <td className="px-4 py-4 text-sm text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => router.push(`/article/${article.id}?role=admin`)}
                                    title="Preview"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>

                                  {article.status === "Draft" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handlePublishArticle(article)}
                                      title="Publish"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  )}

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => router.push(`/admin/articles/${article.id}?role=admin`)}
                                    title="Edit"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteClick(article, "article")}
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                              No articles found. Try a different search term or create a new article.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
              {totalArticlePages > 1 && (
                <CardFooter>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(totalArticlePages, 5) }, (_, i) => {
                        let pageNum = i + 1
                        if (totalArticlePages > 5 && currentPage > 3) {
                          pageNum = currentPage - 3 + i
                        }
                        if (pageNum > totalArticlePages) return null

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              isActive={currentPage === pageNum}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(totalArticlePages, currentPage + 1))}
                          className={
                            currentPage === totalArticlePages ? "pointer-events-none opacity-50" : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Categories Management</CardTitle>
                <CardDescription>Manage your categories, create new ones or edit existing ones.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3.5 text-left text-sm font-semibold">ID</th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold">Name</th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold">Articles</th>
                        <th className="px-4 py-3.5 text-right text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                      {currentCategories.length > 0 ? (
                        currentCategories.map((category) => (
                          <tr key={category.id}>
                            <td className="px-4 py-4 text-sm">{category.id}</td>
                            <td className="px-4 py-4 text-sm">{category.name}</td>
                            <td className="px-4 py-4 text-sm">{category.articleCount}</td>
                            <td className="px-4 py-4 text-sm text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => router.push(`/admin/categories/${category.id}?role=admin`)}
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteClick(category, "category")}
                                  title="Delete"
                                  disabled={category.articleCount > 0}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No categories found. Try a different search term or create a new category.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              {totalCategoryPages > 1 && (
                <CardFooter>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(totalCategoryPages, 5) }, (_, i) => {
                        let pageNum = i + 1
                        if (totalCategoryPages > 5 && currentPage > 3) {
                          pageNum = currentPage - 3 + i
                        }
                        if (pageNum > totalCategoryPages) return null

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              isActive={currentPage === pageNum}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(totalCategoryPages, currentPage + 1))}
                          className={
                            currentPage === totalCategoryPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Article Management System. All rights reserved.</p>
        </div>
      </footer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {itemToDelete?.type === "article"
                ? `Are you sure you want to delete the article "${itemToDelete?.item?.title}"?`
                : `Are you sure you want to delete the category "${itemToDelete?.item?.name}"?`}
              {itemToDelete?.type === "category" && itemToDelete?.item?.articleCount > 0 && (
                <div className="mt-2 flex items-center text-destructive">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  This category contains {itemToDelete.item.articleCount} articles. You cannot delete it.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting || (itemToDelete?.type === "category" && itemToDelete?.item?.articleCount > 0)}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
