"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  GripVerticalIcon,
  EllipsisVerticalIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  UserCheck,
  UserX,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

// User schema
export const userSchema = z.object({
  id: z.number(),
  fullname: z.string(),
  username: z.string(),
  role: z.string(),
  is_active: z.union([z.boolean(), z.number()]),
  created_at: z.string(),
  deleted_at: z.string().nullable().optional(),
})

type User = z.infer<typeof userSchema>

// Drag handle component
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

// Sortable Header Component - FIXED: Fixed width to prevent column resizing
function SortableHeader({ 
  column, 
  title 
}: { 
  column: any, 
  title: string 
}) {
  const isSorted = column.getIsSorted()
  
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(isSorted === "asc")}
      className="h-8 px-2 hover:bg-transparent font-semibold w-full justify-start"
    >
      <span className="flex items-center gap-2 whitespace-nowrap">
        <span>{title}</span>
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          {!isSorted && <ArrowUpDown className="h-3 w-3" />}
          {isSorted === "asc" && <ArrowUp className="h-3 w-3" />}
          {isSorted === "desc" && <ArrowDown className="h-3 w-3" />}
        </span>
      </span>
    </Button>
  )
}

// Define columns for user data
function getColumns({
  onDeactivate,
  onReactivate,
  onDelete,
}: {
  onDeactivate: (id: number) => void
  onReactivate: (id: number) => void
  onDelete: (id: number) => void
}): ColumnDef<User>[] {
  return [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
      enableSorting: false,
      size: 40,
      minSize: 40,
      maxSize: 40,
    },
    {
      accessorKey: "fullname",
      header: ({ column }) => (
        <SortableHeader column={column} title="Full Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.fullname}
          {!row.original.is_active && (
            <Badge variant="outline" className="ml-2 text-xs text-red-500 border-red-200 bg-red-50">
              Inactive
            </Badge>
          )}
        </div>
      ),
      size: 200,
      minSize: 150,
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <SortableHeader column={column} title="Username" />
      ),
      cell: ({ row }) => <div>@{row.original.username}</div>,
      size: 150,
      minSize: 120,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <SortableHeader column={column} title="Role" />
      ),
      cell: ({ row }) => (
        <Badge variant={row.original.role === "admin" ? "default" : "outline"}>
          {row.original.role}
        </Badge>
      ),
      size: 120,
      minSize: 100,
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <SortableHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.original.is_active === 1 || row.original.is_active === true
        return (
          <Badge
            variant={isActive ? "default" : "destructive"}
            className={isActive ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {isActive ? (
              <UserCheck className="w-3 h-3 mr-1" />
            ) : (
              <UserX className="w-3 h-3 mr-1" />
            )}
            {isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },
      size: 120,
      minSize: 100,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <SortableHeader column={column} title="Created" />
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.original.created_at).toLocaleDateString()}
          {!row.original.is_active && row.original.deleted_at && (
            <div className="text-xs text-gray-400">
              Deactivated: {new Date(row.original.deleted_at).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
      size: 150,
      minSize: 120,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original
        const isActive = user.is_active === 1 || user.is_active === true

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                size="icon"
              >
                <EllipsisVerticalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              {isActive ? (
                <DropdownMenuItem
                  className="text-red-500 hover:text-red-600"
                  onClick={() => onDeactivate(user.id)}
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Deactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-green-500 hover:text-green-600"
                  onClick={() => onReactivate(user.id)}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Reactivate
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(user.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Permanently
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      enableSorting: false,
      size: 100,
      minSize: 80,
    },
  ]
}

// Draggable Row component
function DraggableRow({ row }: { row: Row<User> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// Main User DataTable component
export function UserDataTable({
  data: initialData,
  onUserUpdate,
}: {
  data: User[]
  onUserUpdate?: () => void
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  // Update data when prop changes
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  // Action handlers
  const handleDeactivate = async (id: number) => {
    try {
      const response = await fetch(`/api/database/users/${id}/deactivate`, {
        method: "PUT",
      })
      const result = await response.json()
      if (response.ok) {
        toast.success(result.message || "User deactivated successfully")
        onUserUpdate?.()
      } else {
        toast.error(result.message || "Failed to deactivate user")
      }
    } catch (error) {
      toast.error("Something went wrong" + error)
    }
  }

  const handleReactivate = async (id: number) => {
    try {
      const response = await fetch(`/api/database/users/${id}/reactivate`, {
        method: "PUT",
      })
      const result = await response.json()
      if (response.ok) {
        toast.success(result.message || "User reactivated successfully")
        onUserUpdate?.()
      } else {
        toast.error(result.message || "Failed to reactivate user")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/database/users/${id}`, {
        method: "DELETE",
      })
      const result = await response.json()
      if (response.ok) {
        toast.success(result.message || "User deleted permanently")
        onUserUpdate?.()
      } else {
        toast.error(result.message || "Failed to delete user")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const columns = getColumns({
    onDeactivate: handleDeactivate,
    onReactivate: handleReactivate,
    onDelete: handleDelete,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    defaultColumn: {
      size: 150,
      minSize: 80,
    },
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        {/* Table */}
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead 
                          key={header.id} 
                          colSpan={header.colSpan}
                          style={{
                            width: header.getSize(),
                            minWidth: header.column.columnDef.minSize,
                            maxWidth: header.column.columnDef.maxSize,
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}