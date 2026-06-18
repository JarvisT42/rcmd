import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">

      {/* HEADER */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-lg font-semibold">My Project</h1>

        <div className="flex gap-2">
          <Button variant="outline">Login</Button>
          <Button>Sign Up</Button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
          <div>
            <h1 className="font-medium">Project ready!</h1>
            <p>You may now add components and start building.</p>
            <p>We&apos;ve already added the button component for you.</p>

            <Button className="mt-2">Button</Button>
          </div>

          <div className="font-mono text-xs text-muted-foreground">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t px-6 py-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} My Project. All rights reserved.</p>

        <p className="mt-1">
          Credits: Built with Next.js, Tailwind CSS, and shadcn/ui
        </p>
      </footer>

    </div>
  )
}