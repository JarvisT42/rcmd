import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/darkmode"
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* HEADER */}
      <header className="flex items-center justify-between border-b px-6 py-4">


<Link href="/">
  <h1 className="text-lg font-semibold">RCMD</h1>
</Link>



        <div className="flex gap-2">
          <ModeToggle />

          <Button asChild variant="outline">
            <Link href="/auth/login">Login</Link>
          </Button>

          <Button asChild>
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t px-6 py-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} My Project. All rights reserved.</p>
      </footer>
    </div>
  )
}