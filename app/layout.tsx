import { Inter, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/darkmode"


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})





export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, fontMono.variable)}
    >
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <ThemeProvider>
          <TooltipProvider>
            <header className="flex items-center justify-between border-b px-6 py-4">

             
              <h1 className="text-lg font-semibold">RCMD</h1>
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

            {/* PAGE CONTENT - This will stretch */}
            <main className="flex-1 flex flex-col">
              {children}
            </main>

            {/* FOOTER */}
            <footer className="border-t px-6 py-4 text-center text-xs text-muted-foreground bg-amber-700">
              <p>© {new Date().getFullYear()} My Project. All rights reserved.</p>
              <p className="mt-1">
                Credits: Built with Next.js, Tailwind CSS, and shadcn/ui
              </p>
            </footer>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}