"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
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

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"






type UserForm = {
  fullname: string
  username: string
  password: string
  role: string
}



export function AdminSectionCards() {


  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserForm>()

  const onSubmit = async (data: UserForm) => {
    try {
      const response = await fetch("/api/database/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message || "User created successfully!")

        reset()
        setOpen(false)
      } else {
        toast.error(result.message || "Failed to create user")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }




  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/database/users")
      const data = await response.json()
      setTotalUsers(data.totalUsers)
    }
    fetchUsers()
  }, [])


  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      {/* TOTAL USERS */}
      <Card>
        <CardHeader>

          <div className="flex items-center justify-between gap-1">
            <div>
              <CardDescription>Total Users</CardDescription>


              <CardTitle className="text-2xl font-semibold mt-1">
                {totalUsers.toLocaleString()}
              </CardTitle>

            </div>



            <Badge variant="outline" className="flex items-center gap-1">
              <UsersIcon />
              
            </Badge>

          </div>



          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 w-full">
                Add User
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Enter full name"
                    {...register("fullname", {
                      required: "Full name is required",
                    })}
                  />

                  {errors.fullname && (
                    <p className="text-sm text-red-500">
                      {errors.fullname.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>User Name</Label>
                  <Input
                    placeholder="Enter full name"
                    {...register("username", {
                      required: "Full name is required",
                    })}
                  />

                  {errors.username && (
                    <p className="text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>


                <div className="space-y-2">
                  <Label>Role</Label>

                  <select
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    {...register("role", {
                      required: "Please select a role",
                    })}
                  >
                    {errors.role && (
                      <p className="text-sm text-red-500">
                        {errors.role.message}
                      </p>
                    )}
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>

                    <option value="user">User</option>
                  </select>
                </div>


                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />

                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                >
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