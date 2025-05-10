"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Search, LogOut, Filter } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { useRouter } from "next/navigation"
import { articlesAPI, categoriesAPI } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Dashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const articlesPerPage = 5
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Fetch articles and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [articlesData, categoriesData] = await Promise.all([articlesAPI.getAll(), categoriesAPI.getAll()])

        const articlesArray = Array.isArray(articlesData) ? articlesData : []

        setArticles(articlesArray)
        setFilteredArticles(articlesArray)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter articles based on search term and category
  useEffect(() => {
    if (!articles || !articles.length) return

    let results = articles

    // Filter by search term
    if (debouncedSearchTerm) {
      results = results.filter(
        (article) =>
          article.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (article.excerpt && article.excerpt.toLowerCase().includes(debouncedSearchTerm.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      results = results.filter((article) => article.category === selectedCategory)
    }

    setFilteredArticles(results)
    setCurrentPage(1)
  }, [debouncedSearchTerm, selectedCategory, articles])

  // Calculate pagination
  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle)
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle logout
  const handleLogout = () => {
    router.push("/")
  }

  // Navigate to article with role parameter
  const navigateToArticle = (articleId) => {
    router.push(`/article/${articleId}?role=user`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b sticky top-0 bg-background z-10">
          <div className="container mx-auto py-4 px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">User Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" disabled>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="mb-8">
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="mb-6 flex justify-between">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="space-y-6">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="h-40 w-full" />
              ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="whitespace-nowrap w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filter by Category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all" ? "bg-muted" : ""}
              >
                All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={selectedCategory === category.name ? "bg-muted" : ""}
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {debouncedSearchTerm && (
          <p className="mt-2 mb-4 text-sm text-muted-foreground">
            Found {filteredArticles.length} results for "{debouncedSearchTerm}"
          </p>
        )}

        {selectedCategory !== "all" && (
          <div className="mb-4 flex items-center">
            <Badge className="mr-2">{selectedCategory}</Badge>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory("all")}>
              Clear filter
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {currentArticles.length > 0 ? (
            currentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} onClick={() => navigateToArticle(article.id)} />
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground px-4">No articles found. Try a different search term or category.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {filteredArticles.length > 0 && totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show pages around current page
                let pageNum = i + 1
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 3 + i
                }
                if (pageNum > totalPages) return null

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink isActive={currentPage === pageNum} onClick={() => handlePageChange(pageNum)}>
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Article Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function ArticleCard({ article, onClick }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
          <div>
            <CardTitle className="text-xl">{article.title}</CardTitle>
            <CardDescription className="mt-1">{article.excerpt || "No description available"}</CardDescription>
          </div>
          <Badge variant="outline" className="mt-2 sm:mt-0">
            {article.category}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="pt-3 flex justify-between">
        <Button variant="ghost" size="sm" onClick={onClick}>
          Read more
        </Button>
      </CardFooter>
    </Card>
  )
}
