"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useForm } from "react-hook-form"



import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, UsersIcon, ShieldCheckIcon, DatabaseIcon } from "lucide-react"
import { Button } from "@/components/ui/button"


type UserForm = {
  username: string
  email: string
  password: string
}



export function AdminSectionCards() {

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<UserForm>()

  const onSubmit = (data: UserForm) => {
    console.log(data)

    toast.success("User created successfully!")

    reset()
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      {/* TOTAL USERS */}
      <Card>
        <CardHeader>

          <div className="flex items-center justify-between gap-1">
            <div>
              <CardDescription>Total Users</CardDescription>


              <CardTitle className="text-2xl font-semibold mt-1">
                1,245
              </CardTitle>

            </div>



            <Badge variant="outline" className="flex items-center gap-1">
              <UsersIcon />
              +8.2%
            </Badge>

          </div>



          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 w-full">
                Add User
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>

              {/* React Hook Form goes here */}
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full border rounded-md p-2"
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border rounded-md p-2"
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border rounded-md p-2"
                />

                <Button type="submit" className="w-full">
                  Create User
                </Button>
              </form>
            </DialogContent>
          </Dialog>

        </CardHeader>

        <CardFooter className="text-sm text-muted-foreground">
          Registered system users
        </CardFooter>
      </Card>

      {/* ACTIVE SESSIONS */}
      <Card>
        <CardHeader>
          <CardDescription>Active Sessions</CardDescription>
          <CardTitle className="text-2xl font-semibold">
            312
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +5.1%
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter className="text-sm text-muted-foreground">
          Users currently logged in
        </CardFooter>
      </Card>

      {/* SYSTEM STATUS */}
      <Card>
        <CardHeader>
          <CardDescription>System Status</CardDescription>
          <CardTitle className="text-2xl font-semibold text-green-600">
            Healthy
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ShieldCheckIcon />
              99.9%
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter className="text-sm text-muted-foreground">
          All services running normally
        </CardFooter>
      </Card>

      {/* DATABASE LOAD */}
      <Card>
        <CardHeader>
          <CardDescription>Database Load</CardDescription>
          <CardTitle className="text-2xl font-semibold">
            68%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <DatabaseIcon />
              Stable
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter className="text-sm text-muted-foreground">
          Resource usage status
        </CardFooter>
      </Card>

    </div>
  )
}