"use client"

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

export function AdminSectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      {/* TOTAL USERS */}
      <Card>
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold">
            1,245
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <UsersIcon />
              +8.2%
            </Badge>
          </CardAction>
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