import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Article Management System</h1>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Welcome to Article Management System</h2>
          <p className="text-xl text-muted-foreground">
            A modern platform for managing articles with different user roles and permissions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>User Access</CardTitle>
              <CardDescription>Features available for regular users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• Browse articles by category</p>
              <p>• Search articles with debounce</p>
              <p>• View article details</p>
              <p>• See related articles</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/login?role=user">
                  Login as User <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Features available for administrators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• Manage categories</p>
              <p>• Create and edit articles</p>
              <p>• Preview articles before publishing</p>
              <p>• Full content management</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/login?role=admin">
                  Login as Admin <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Article Management System. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
