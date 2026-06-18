import { Button } from "@/components/ui/button"
import Link from "next/link"




export default function Page() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="flex max-w-md flex-col gap-4 text-sm leading-loose text-center">
        <h1 className="font-medium">Project ready!</h1>

        <p>You may now add components and start building.</p>

        <Button className="mt-2">Button</Button>

        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </main>
  )
}