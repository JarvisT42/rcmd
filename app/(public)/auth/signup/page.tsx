import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (

    <div className="flex min-h-[calc(100vh-13rem)] flex-1 items-center justify-center bg-muted p-6 md:p-10">

      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  )
}
