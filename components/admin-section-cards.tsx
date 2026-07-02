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
import { TrendingUpIcon, UsersIcon, ShieldCheckIcon, DatabaseIcon, UserX, UserCheck, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


import { UserDataTable } from "@/components/data-table"



type UserForm = {
  fullname: string
  username: string
  password: string
  role: string
}

type User = {
  id: number
  fullname: string
  username: string
  role: string
  is_active: boolean
  created_at: string
  deleted_at?: string
}

export function AdminSectionCards() {






  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [activeUsers, setActiveUsers] = useState(0)
  const [showInactive, setShowInactive] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'deactivate' | 'reactivate' | 'delete'>('deactivate')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserForm>()

  // Fetch users
  const fetchUsers = async () => {
  try {
    const response = await fetch("/api/database/users")
    const data = await response.json()
    setUsers(data.users || [])
    setTotalUsers(data.totalUsers || 0)
    setActiveUsers(data.activeUsers || 0)
  } catch (error) {
    console.error("Error fetching users:", error)
    toast.error("Failed to fetch users")
  }
}

  useEffect(() => {
    fetchUsers()
  }, [])

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
        fetchUsers() // Refresh the list
      } else {
        toast.error(result.message || "Failed to create user")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }

  // Deactivate user (soft delete)
  const handleDeactivate = async (userId: number) => {
    try {
      const response = await fetch(`/api/database/users/${userId}/deactivate`, {
        method: "PUT",
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message || "User deactivated successfully")
        fetchUsers()
        setAlertDialogOpen(false)
      } else {
        toast.error(result.message || "Failed to deactivate user")
      }
    } catch (error) {
      console.error("Error deactivating user:", error)
      toast.error("Something went wrong")
    }
  }

  // Reactivate user
  const handleReactivate = async (userId: number) => {
    try {
      const response = await fetch(`/api/database/users/${userId}/reactivate`, {
        method: "PUT",
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message || "User reactivated successfully")
        fetchUsers()
        setAlertDialogOpen(false)
      } else {
        toast.error(result.message || "Failed to reactivate user")
      }
    } catch (error) {
      console.error("Error reactivating user:", error)
      toast.error("Something went wrong")
    }
  }

  // Hard delete user (use with caution)
  const handleHardDelete = async (userId: number) => {
    try {
      const response = await fetch(`/api/database/users/${userId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message || "User deleted permanently")
        fetchUsers()
        setAlertDialogOpen(false)
      } else {
        toast.error(result.message || "Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Something went wrong")
    }
  }

  const confirmAction = () => {
    if (!selectedUser) return

    switch (actionType) {
      case 'deactivate':
        handleDeactivate(selectedUser.id)
        break
      case 'reactivate':
        handleReactivate(selectedUser.id)
        break
      case 'delete':
        handleHardDelete(selectedUser.id)
        break
    }
  }

  const openActionDialog = (user: User, action: 'deactivate' | 'reactivate' | 'delete') => {
    setSelectedUser(user)
    setActionType(action)
    setAlertDialogOpen(true)
  }

  const getActionDialogContent = () => {
    if (!selectedUser) return { title: '', description: '', actionLabel: '', variant: '' }

    switch (actionType) {
      case 'deactivate':
        return {
          title: `Deactivate ${selectedUser.fullname}?`,
          description: `This user will no longer be able to access the system. Their data will be preserved and can be reactivated later.`,
          actionLabel: 'Deactivate User',
          variant: 'destructive'
        }
      case 'reactivate':
        return {
          title: `Reactivate ${selectedUser.fullname}?`,
          description: `This user will regain access to the system.`,
          actionLabel: 'Reactivate User',
          variant: 'default'
        }
      case 'delete':
        return {
          title: `Permanently Delete ${selectedUser.fullname}?`,
          description: `This action cannot be undone. All user data will be permanently removed from the system.`,
          actionLabel: 'Delete Permanently',
          variant: 'destructive'
        }
    }
  }

  const getDisplayUsers = () => {
    return showInactive ? users : users.filter(user => user.is_active)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
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
                <UsersIcon className="w-4 h-4" />
              </Badge>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 w-full">Add User</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <Label>Username</Label>
                    <Input
                      placeholder="Enter username"
                      {...register("username", {
                        required: "Username is required",
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
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                    {errors.role && (
                      <p className="text-sm text-red-500">
                        {errors.role.message}
                      </p>
                    )}
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

                  <Button type="submit" className="w-full">
                    Create User
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground flex justify-between">
            <span>Registered system users</span>
            <span className="font-medium text-green-600">
              {activeUsers} active
            </span>
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
                <TrendingUpIcon className="w-4 h-4" />
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
                <ShieldCheckIcon className="w-4 h-4" />
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
                <DatabaseIcon className="w-4 h-4" />
                Stable
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            Resource usage status
          </CardFooter>
        </Card>
      </div>

      {/* User Management Table */}
      <div className="px-4 lg:px-6">
  <Card>
    <CardHeader>
      <CardTitle>User Management</CardTitle>
      <CardDescription>
        Manage system users and their access status
      </CardDescription>
    </CardHeader>
    <UserDataTable 
      data={users} 
      onUserUpdate={fetchUsers}
    />
  </Card>
</div>

      {/* Confirmation Dialog */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {getActionDialogContent().title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {getActionDialogContent().description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={
                actionType === 'reactivate' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : actionType === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-red-500 hover:bg-red-600'
              }
            >
              {getActionDialogContent().actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}