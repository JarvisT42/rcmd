"use client"

import { useState } from "react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DatePickerInput } from "@/components/ui/datePicker"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

// Mock data - replace with actual data fetching
const branch = [
  { branch_id: 1, branch_name: "Main Branch" },
  { branch_id: 2, branch_name: "North Branch" },
]

const department = [
  { dept_id: 1, dept_name: "IT Department" },
  { dept_id: 2, dept_name: "HR Department" },
]

const misName = [
  { mis_id: 1, mis_name: "MIS System A" },
  { mis_id: 2, mis_name: "MIS System B" },
]

const people = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
  { id: 4, name: "Alice Williams" },
]

const data = [
  { id: 1, name: "Designation A" },
  { id: 2, name: "Designation B" },
  { id: 3, name: "Designation C" },
]

// Custom Select Field Component using shadcn Select
const SelectField = ({ 
  options, 
  name, 
  className = "", 
  placeholder = "Select..."
}: { 
  options: any[], 
  name: string, 
  className?: string,
  placeholder?: string 
}) => {
  return (
    <Select name={name}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.id || option.branch_id || option.dept_id || option.mis_id}
            value={(option.id || option.branch_id || option.dept_id || option.mis_id).toString()}
          >
            {option.name || option.branch_name || option.dept_name || option.mis_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function UserDashboardPage() {
  const [isOnline, setIsOnline] = useState(true)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | ""
    message: string
  }>({ type: "", message: "" })

  const [items, setItems] = useState([
    { qty: 0, unit: "", itemDescription: "", remarks: "" },
  ])

  const [branchError, setBranchError] = useState(false)
  const [departmentError, setDepartmentError] = useState(false)
  const [misNameError, setMisNameError] = useState(false)

  const handleChange = (index: number, field: string, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
    
    // Auto-add new row when typing in the last row
    if (index === items.length - 1) {
      const hasValue = newItems[index].qty !== 0 || 
                      newItems[index].unit !== "" || 
                      newItems[index].itemDescription !== "" || 
                      newItems[index].remarks !== ""
      if (hasValue) {
        addNewRow()
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted")
  }

  const addNewRow = () => {
    setItems((prevItems) => [
      ...prevItems,
      { qty: 0, unit: "", itemDescription: "", remarks: "" }
    ])
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6">
      <div className="grid gap-4 h-full">
        {/* Network Status Alert */}
        {!isOnline && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Network Connection Lost</AlertTitle>
            <AlertDescription>
              You are currently offline. Please check your internet connection.
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Status Alert */}
        {submitStatus.type && (
          <Alert
            variant={
              submitStatus.type === "success" ? "default" : "destructive"
            }
            className="mb-4"
          >
            <AlertTitle>
              {submitStatus.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{submitStatus.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* SECTION 1: BASIC INFORMATION CONTAINER */}
          <div className="border rounded-lg p-4 sm:p-5 bg-gray-50/50 dark:bg-gray-800/50">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* LEFT COLUMN */}
              <div className="space-y-3">
                <div className="bg-white/50 dark:bg-gray-900/50 rounded-md p-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-1 border-b">
                    Document Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-32">Series No.</Label>
                      <Input
                        type="number"
                        placeholder="0001"
                        className="w-full sm:w-28"
                        name="series_no"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-32">Branch</Label>
                      {branchError ? (
                        <Alert variant="destructive" className="flex-1 p-2">
                          <AlertDescription className="text-xs">
                            Failed to load branch
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Select name="branch" required>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select Branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branch.map((b) => (
                              <SelectItem
                                key={b.branch_id}
                                value={b.branch_id.toString()}
                              >
                                {b.branch_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-32">Department</Label>
                      {departmentError ? (
                        <Alert variant="destructive" className="flex-1 p-2">
                          <AlertDescription className="text-xs">
                            Failed to load department
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Select name="department">
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {department.map((dept) => (
                              <SelectItem
                                key={dept.dept_id}
                                value={dept.dept_id.toString()}
                              >
                                {dept.dept_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-32">MIS Name</Label>
                      {misNameError ? (
                        <Alert variant="destructive" className="flex-1 p-2">
                          <AlertDescription className="text-xs">
                            Failed to load mis name
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Select name="mis_name">
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select MIS Name" />
                          </SelectTrigger>
                          <SelectContent>
                            {misName.map((misName) => (
                              <SelectItem
                                key={misName.mis_id}
                                value={misName.mis_id.toString()}
                              >
                                {misName.mis_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-32">Date</Label>
                      <div className="w-full sm:w-44">
                        <DatePickerInput />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-3">
                <div className="bg-white/50 dark:bg-gray-900/50 rounded-md p-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-1 border-b">
                    Request Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Label className="sm:w-32 sm:self-start mt-0 sm:mt-2">
                        Request Details
                      </Label>
                      <Textarea
                        name="request_details"
                        placeholder="Enter details..."
                        defaultValue="We would like to request"
                        className="flex-1 min-h-[180px] resize-y"
                        required
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-32">Purchasing Remarks</Label>
                      <Input
                        placeholder="New remarks"
                        className="flex-1"
                        name="Pur_remarks"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: REQUESTED ITEMS CONTAINER */}
          <div className="border rounded-lg p-4 sm:p-5 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-medium">Requested Items</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addNewRow}
              >
                + Add Row
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full border-collapse min-w-[500px]">
                <thead className="border-b bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-3 py-2 text-left w-24 rounded-tl-xl">
                      Qty
                    </th>
                    <th className="px-3 py-2 text-left w-28">Unit</th>
                    <th className="px-3 py-2 text-left">Item Description</th>
                    <th className="px-3 py-2 text-left rounded-tr-xl">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-900"
                          : "bg-gray-50 dark:bg-gray-800/50"
                      }
                    >
                      <td
                        className={`p-2 ${
                          index === items.length - 1 ? "rounded-bl-xl" : ""
                        }`}
                      >
                        <Input
                          type="number"
                          min={0}
                          value={row.qty}
                          onChange={(e) =>
                            handleChange(index, "qty", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={row.unit}
                          onChange={(e) =>
                            handleChange(index, "unit", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={row.itemDescription}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "itemDescription",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td
                        className={`p-2 ${
                          index === items.length - 1 ? "rounded-br-xl" : ""
                        }`}
                      >
                        <Input
                          value={row.remarks}
                          onChange={(e) =>
                            handleChange(index, "remarks", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: SIGNATORIES CONTAINER */}
          <div className="border rounded-lg p-4 sm:p-5 bg-gray-50/50 dark:bg-gray-800/50">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b">
              Signatories & Approval
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* LEFT COLUMN */}
              <div className="space-y-3">
                <div className="bg-white/50 dark:bg-gray-900/50 rounded-md p-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-1 border-b">
                    Requestors
                  </h4>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-32">Prepared By</Label>
                      <SelectField
                        options={people}
                        name="prepared_by"
                        className="flex-1"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-32">Requested By</Label>
                      <SelectField
                        options={people}
                        name="requested_by"
                        className="flex-1"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-32">Req Destination</Label>
                      <SelectField
                        options={people}
                        name="req_destination"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-gray-900/50 rounded-md p-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-1 border-b">
                    Department Approval
                  </h4>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-32">Checked By</Label>
                      <SelectField
                        options={people}
                        name="checked_by"
                        className="flex-1"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-32">Check Designation</Label>
                      <SelectField
                        options={data}
                        name="check_designation"
                        className="flex-1"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-32">Department Head</Label>
                      <SelectField
                        options={data}
                        name="department_head"
                        className="flex-1"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-32">Dept Designation</Label>
                      <SelectField
                        options={data}
                        name="dept_designation"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-3">
                <div className="bg-white/50 dark:bg-gray-900/50 rounded-md p-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-1 border-b">
                    Purchasing
                  </h4>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-36">Purchaser</Label>
                      <SelectField
                        options={people}
                        name="purchaser"
                        className="flex-1"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-36">Pur Designation</Label>
                      <SelectField
                        options={people}
                        name="pur_designation"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-gray-900/50 rounded-md p-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-1 border-b">
                    Final Approvers
                  </h4>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-36">Property Custodian</Label>
                      <SelectField
                        options={people}
                        name="property_custodian"
                        className="flex-1"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-36">Management</Label>
                      <SelectField
                        options={people}
                        name="management1"
                        className="flex-1"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-36">Management</Label>
                      <SelectField
                        options={people}
                        name="management2"
                        className="flex-1"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-36">Accounting Head</Label>
                      <SelectField
                        options={people}
                        name="accounting_head"
                        className="flex-1"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="sm:w-36">Acct. Designation</Label>
                      <SelectField
                        options={people}
                        name="acct_designation"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: ACTION BUTTONS CONTAINER */}
          <div className="border rounded-lg p-4 sm:p-5 bg-gray-50/50 dark:bg-gray-800/50">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b">Actions</h3>
            <div className="flex flex-wrap justify-start gap-3">
              <Button
                type="submit"
                name="action"
                value="save"
                className="min-w-[100px]"
              >
                Save
              </Button>
              <Button
                type="submit"
                name="action"
                value="update"
                variant="outline"
                className="min-w-[100px]"
              >
                Update
              </Button>
              <Button
                type="submit"
                name="action"
                value="print"
                variant="secondary"
                className="min-w-[100px]"
              >
                Print
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}