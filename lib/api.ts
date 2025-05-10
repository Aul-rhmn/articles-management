// API base URL
const API_BASE_URL = "https://test-fe.mysellerpintar.com/api"

let mockArticlesStorage = null
let mockCategoriesStorage = null

// mock data
const mockArticlesData = [
  {
    id: 1,
    title: "The Future of AI",
    category: "Technology",
    author: "John Smith",
    date: "2024-05-01",
    readTime: "8 min read",
    status: "Published",
    excerpt: "Exploring the latest advancements in artificial intelligence and what it means for the future.",
    content:
      "<p>Artificial Intelligence (AI) continues to evolve at an unprecedented pace, transforming industries and reshaping our daily lives.</p><h2>The Rise of Machine Learning</h2><p>One of the most significant developments in AI is the advancement of machine learning algorithms, particularly deep learning.</p>",
    relatedArticles: [6, 4],
  },
  {
    id: 2,
    title: "Sustainable Business Practices",
    category: "Business",
    author: "Emma Johnson",
    date: "2024-04-28",
    readTime: "6 min read",
    status: "Published",
    excerpt: "How companies are adopting sustainable practices to reduce their environmental impact.",
    content:
      "<p>Sustainability has moved from a peripheral concern to a central business imperative. Companies across the globe are recognizing that sustainable practices are not just good for the planet, but also for their bottom line.</p><h2>The Business Case for Sustainability</h2><p>Research consistently shows that companies with strong environmental, social, and governance (ESG) practices outperform their peers financially in the long term.</p>",
    relatedArticles: [7, 12],
  },
  {
    id: 3,
    title: "Mental Health in the Digital Age",
    category: "Health",
    author: "Dr. Sarah Chen",
    date: "2024-05-03",
    readTime: "7 min read",
    status: "Draft",
    excerpt: "Understanding the impact of technology on mental health and strategies for digital wellbeing.",
    content:
      "<p>The digital revolution has transformed how we work, socialize, and entertain ourselves. While technology offers unprecedented convenience and connectivity, it also presents new challenges for mental wellbeing.</p><h2>The Double-Edged Sword of Connectivity</h2><p>Social media platforms keep us connected with friends and family across the globe, yet studies show that excessive use can contribute to feelings of loneliness, inadequacy, and anxiety.</p>",
    relatedArticles: [8],
  },
  {
    id: 4,
    title: "Quantum Computing Breakthroughs",
    category: "Science",
    author: "Dr. Michael Wong",
    date: "2024-04-15",
    readTime: "9 min read",
    status: "Published",
    excerpt: "Recent breakthroughs in quantum computing and their potential applications.",
    content:
      "<p>Quantum computing represents one of the most exciting frontiers in computer science, promising computational capabilities that far exceed those of classical computers for certain types of problems.</p><h2>Recent Milestones</h2><p>The past year has seen remarkable progress in quantum computing research. Scientists have achieved quantum advantage—where a quantum computer outperforms the most powerful classical supercomputers.</p>",
    relatedArticles: [1, 9],
  },
  {
    id: 5,
    title: "Streaming Wars: The New Era",
    category: "Entertainment",
    author: "Alex Rivera",
    date: "2024-04-22",
    readTime: "5 min read",
    status: "Published",
    excerpt: "An analysis of the competitive landscape in the streaming industry.",
    content:
      "<p>The entertainment landscape has been revolutionized by streaming platforms, with traditional media companies and tech giants battling for subscribers in an increasingly crowded marketplace.</p><h2>Consolidation and Differentiation</h2><p>After years of proliferation, the streaming industry is entering a phase of consolidation. Major players are merging or forming strategic partnerships.</p>",
    relatedArticles: [10],
  },
  {
    id: 6,
    title: "Cybersecurity Trends",
    category: "Technology",
    author: "Lisa Chen",
    date: "2024-05-05",
    readTime: "7 min read",
    status: "Draft",
    excerpt: "The evolving landscape of cybersecurity threats and how to protect yourself.",
    content:
      "<p>As our digital footprint expands, so does the sophistication of cyber threats. Organizations and individuals must stay vigilant and adapt their security strategies to address evolving risks.</p><h2>The Ransomware Evolution</h2><p>Ransomware attacks have grown more targeted and damaging, with attackers focusing on high-value organizations and employing double extortion tactics.</p>",
    relatedArticles: [1, 11],
  },
  {
    id: 7,
    title: "Remote Work Revolution",
    category: "Business",
    author: "James Wilson",
    date: "2024-04-18",
    readTime: "6 min read",
    status: "Published",
    excerpt: "How remote work is changing the business landscape and employee expectations.",
    content:
      "<p>The widespread adoption of remote work during the pandemic has permanently altered workplace norms and expectations. As organizations navigate this new landscape, they're reimagining everything from office design to management practices.</p><h2>Hybrid Work Models</h2><p>Most companies are settling on hybrid arrangements that combine in-person and remote work.</p>",
    relatedArticles: [2, 12],
  },
  {
    id: 8,
    title: "Nutrition Myths Debunked",
    category: "Health",
    author: "Dr. Robert Kim",
    date: "2024-04-10",
    readTime: "8 min read",
    status: "Published",
    excerpt: "Common nutrition myths and what science actually says about healthy eating.",
    content:
      "<p>In the age of information overload, nutrition advice is often contradictory and confusing. Separating scientific fact from fiction is essential for making informed dietary choices that support long-term health.</p><h2>The Breakfast Debate</h2><p>Contrary to popular belief, breakfast is not inherently the 'most important meal of the day' for everyone.</p>",
    relatedArticles: [3],
  },
  {
    id: 9,
    title: "Space Exploration Updates",
    category: "Science",
    author: "Dr. Emily Carter",
    date: "2024-04-05",
    readTime: "7 min read",
    status: "Draft",
    excerpt: "The latest developments in space exploration and upcoming missions.",
    content:
      "<p>We are living in a golden age of space exploration, with multiple nations and private companies pushing the boundaries of human knowledge and capability beyond Earth.</p><h2>Mars Missions Advance</h2><p>Robotic explorers on Mars continue to make remarkable discoveries about the red planet's past and present conditions.</p>",
    relatedArticles: [4],
  },
  {
    id: 10,
    title: "The Rise of Indie Gaming",
    category: "Entertainment",
    author: "Maya Rodriguez",
    date: "2024-03-25",
    readTime: "6 min read",
    status: "Published",
    excerpt: "How independent game developers are reshaping the gaming industry.",
    content:
      "<p>Independent game development has evolved from a niche pursuit to a vital and influential sector of the gaming industry, delivering some of the most innovative and artistically significant titles in recent years.</p><h2>Creative Freedom Unleashed</h2><p>Freed from the commercial pressures and risk aversion that often constrain AAA studios, indie developers can explore unconventional gameplay mechanics.</p>",
    relatedArticles: [5],
  },
  {
    id: 11,
    title: "Blockchain Beyond Cryptocurrency",
    category: "Technology",
    author: "Daniel Park",
    date: "2024-03-20",
    readTime: "8 min read",
    status: "Draft",
    excerpt: "Exploring practical applications of blockchain technology beyond digital currencies.",
    content:
      "<p>While blockchain technology first gained prominence as the foundation for cryptocurrencies, its potential applications extend far beyond digital currencies to transform numerous industries and processes.</p><h2>Supply Chain Transparency</h2><p>Blockchain provides an immutable record of a product's journey from origin to consumer, enabling unprecedented supply chain transparency.</p>",
    relatedArticles: [1, 6],
  },
  {
    id: 12,
    title: "Sustainable Investing",
    category: "Business",
    author: "Olivia Thompson",
    date: "2024-03-15",
    readTime: "7 min read",
    status: "Published",
    excerpt: "The growing trend of environmental, social, and governance (ESG) investing.",
    content:
      "<p>Sustainable investing has evolved from a niche approach to a mainstream investment strategy, as investors increasingly recognize that environmental, social, and governance (ESG) factors can materially impact financial performance.</p><h2>Beyond Exclusionary Screening</h2><p>While early sustainable investing focused primarily on excluding controversial industries, today's approaches are more sophisticated and nuanced.</p>",
    relatedArticles: [2, 7],
  },
]

// Function to get mock articles 
function getMockArticles() {
  if (!mockArticlesStorage) {
    console.log("Initializing mock articles storage")
    mockArticlesStorage = [...mockArticlesData]
  }
  return mockArticlesStorage
}

// Function to get mock article by ID
function getMockArticleById(id) {
  const articles = getMockArticles()
  return articles.find((article) => article.id === Number(id))
}

// Function to get mock categories 
function getMockCategories() {
  if (!mockCategoriesStorage) {
    console.log("Initializing mock categories storage")
    mockCategoriesStorage = [
      { id: 1, name: "Technology", articleCount: 3 },
      { id: 2, name: "Business", articleCount: 3 },
      { id: 3, name: "Health", articleCount: 2 },
      { id: 4, name: "Science", articleCount: 2 },
      { id: 5, name: "Entertainment", articleCount: 2 },
    ]
  }
  return mockCategoriesStorage
}

// Function to get mock category by ID
function getMockCategoryById(id) {
  const categories = getMockCategories()
  return categories.find((category) => category.id === Number(id))
}

const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
  console.log(`Attempting to fetch: ${url}`)
  const controller = new AbortController()
  const { signal } = controller
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { ...options, signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    console.error(`Fetch error for: ${url}`, error)
    throw error
  }
}

// Function to check if API is accessible - always returns false to use mock data
export const isApiAccessible = async () => {
  return false
}

// Service for articles
export const articlesAPI = {
  // Get all articles
  getAll: async () => {
    try {
      const apiAccessible = await isApiAccessible()
      if (!apiAccessible) return getMockArticles()

      const response = await fetch(`${API_BASE_URL}/articles`)
      if (!response.ok) throw new Error(`Failed to fetch articles: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching articles:", error)
      return getMockArticles()
    }
  },

  // Get article by ID
  getById: async (id) => {
    try {
      const apiAccessible = await isApiAccessible()
      if (!apiAccessible) return getMockArticleById(Number(id))

      const response = await fetch(`${API_BASE_URL}/articles/${id}`)
      if (!response.ok) throw new Error(`Failed to fetch article with id ${id}`)
      return await response.json()
    } catch (error) {
      console.error(`Error fetching article ${id}:`, error)
      return getMockArticleById(Number(id))
    }
  },

  // Create new article
  create: async (articleData) => {
    try {
      const apiAccessible = await isApiAccessible()
      if (!apiAccessible) {
        const mockArticles = getMockArticles()
        const maxId = Math.max(...mockArticles.map((article) => Number(article.id)), 0)

        const newArticle = {
          ...articleData,
          id: maxId + 1,
          date: articleData.date || new Date().toISOString().split("T")[0],
          status: articleData.status || "Published",
          category: articleData.category || "Uncategorized",
          excerpt: articleData.excerpt || (articleData.title ? `${articleData.title.substring(0, 50)}...` : ""),
          content: articleData.content || "<p>No content provided</p>",
          relatedArticles: articleData.relatedArticles || [],
        }

        mockArticles.push(newArticle)
        return newArticle
      }

      const response = await fetch(`${API_BASE_URL}/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData),
      })

      if (!response.ok) throw new Error(`Failed to create article: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error creating article:", error)

      // Fallback to mock data
      const mockArticles = getMockArticles()
      const maxId = Math.max(...mockArticles.map((article) => Number(article.id)), 0)

      const newArticle = {
        ...articleData,
        id: maxId + 1,
        date: articleData.date || new Date().toISOString().split("T")[0],
        status: articleData.status || "Published",
        category: articleData.category || "Uncategorized",
        excerpt: articleData.excerpt || (articleData.title ? `${articleData.title.substring(0, 50)}...` : ""),
        content: articleData.content || "<p>No content provided</p>",
        relatedArticles: articleData.relatedArticles || [],
      }

      mockArticles.push(newArticle)
      return newArticle
    }
  },

  // Update article
  update: async (id, articleData) => {
    try {
      const apiAccessible = await isApiAccessible()
      if (!apiAccessible) {
        const mockArticles = getMockArticles()
        const articleIndex = mockArticles.findIndex((article) => article.id === Number(id))

        if (articleIndex !== -1) {
          mockArticles[articleIndex] = { ...articleData, id: Number(id) }
        }

        return { ...articleData, id: Number(id) }
      }

      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData),
      })

      if (!response.ok) throw new Error(`Failed to update article with id ${id}`)
      return await response.json()
    } catch (error) {
      console.error(`Error updating article ${id}:`, error)

      // Fallback to mock data
      const mockArticles = getMockArticles()
      const articleIndex = mockArticles.findIndex((article) => article.id === Number(id))

      if (articleIndex !== -1) {
        mockArticles[articleIndex] = { ...articleData, id: Number(id) }
      }

      return { ...articleData, id: Number(id) }
    }
  },

  // Delete article
  delete: async (id) => {
    try {
      const apiAccessible = await isApiAccessible()
      if (!apiAccessible) {
        const mockArticles = getMockArticles()
        const articleIndex = mockArticles.findIndex((article) => article.id === Number(id))

        if (articleIndex !== -1) {
          mockArticles.splice(articleIndex, 1)
        }

        return { success: true, id }
      }

      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error(`Failed to delete article with id ${id}`)
      return await response.json()
    } catch (error) {
      console.error(`Error deleting article ${id}:`, error)

      // Fallback to mock data
      const mockArticles = getMockArticles()
      const articleIndex = mockArticles.findIndex((article) => article.id === Number(id))

      if (articleIndex !== -1) {
        mockArticles.splice(articleIndex, 1)
      }

      return { success: true, id }
    }
  },
}

// Service for categories
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    try {
      const apiAccessible = await isApiAccessible()
      if (!apiAccessible) return getMockCategories()

      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching categories:", error)
      return getMockCategories()
    }
  },

  // Get category by ID
  getById: async (id) => {
    try {
      const apiAccessible = await isApiAccessible()
      if (!apiAccessible) return getMockCategoryById(Number(id))

      const response = await fetch(`${API_BASE_URL}/categories/${id}`)
      if (!response.ok) throw new Error(`Failed to fetch category with id ${id}`)
      return await response.json()
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error)
      return getMockCategoryById(Number(id))
    }
  },

  // Create new category
  create: async (categoryData) => {
    try {
      const apiAccessible = await isApiAccessible()
      if (!apiAccessible) {
        const mockCategories = getMockCategories()
        const maxId = Math.max(...mockCategories.map((category) => category.id), 0)

        const newCategory = {
          ...categoryData,
          id: maxId + 1,
          articleCount: 0,
        }

        mockCategories.push(newCategory)
        return newCategory
      }

      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) throw new Error(`Failed to create category: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error creating category:", error)

      // Fallback to mock data
      const mockCategories = getMockCategories()
      const maxId = Math.max(...mockCategories.map((category) => category.id), 0)

      const newCategory = {
        ...categoryData,
        id: maxId + 1,
        articleCount: 0,
      }

      mockCategories.push(newCategory)
      return newCategory
    }
  },

  // Update category
  update: async (id, categoryData) => {
    try {
      const apiAccessible = await isApiAccessible()
      if (!apiAccessible) {
        const mockCategories = getMockCategories()
        const categoryIndex = mockCategories.findIndex((category) => category.id === Number(id))

        if (categoryIndex !== -1) {
          mockCategories[categoryIndex] = { ...categoryData, id: Number(id) }
        }

        return { ...categoryData, id: Number(id) }
      }

      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) throw new Error(`Failed to update category with id ${id}`)
      return await response.json()
    } catch (error) {
      console.error(`Error updating category ${id}:`, error)

      // Fallback to mock data
      const mockCategories = getMockCategories()
      const categoryIndex = mockCategories.findIndex((category) => category.id === Number(id))

      if (categoryIndex !== -1) {
        mockCategories[categoryIndex] = { ...categoryData, id: Number(id) }
      }

      return { ...categoryData, id: Number(id) }
    }
  },

  // Delete category
  delete: async (id) => {
    try {
      const apiAccessible = await isApiAccessible()
      if (!apiAccessible) {
        const mockCategories = getMockCategories()
        const categoryIndex = mockCategories.findIndex((category) => category.id === Number(id))

        if (categoryIndex !== -1) {
          mockCategories.splice(categoryIndex, 1)
        }

        return { success: true, id }
      }

      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error(`Failed to delete category with id ${id}`)
      return await response.json()
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error)

      // Fallback to mock data
      const mockCategories = getMockCategories()
      const categoryIndex = mockCategories.findIndex((category) => category.id === Number(id))

      if (categoryIndex !== -1) {
        mockCategories.splice(categoryIndex, 1)
      }

      return { success: true, id }
    }
  },
}
