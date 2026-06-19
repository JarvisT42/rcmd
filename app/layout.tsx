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
            

            {/* PAGE CONTENT - This will stretch */}
            <main className="flex-1 flex flex-col">
              {children}
            </main>

            
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}