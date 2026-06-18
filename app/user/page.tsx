import { SectionCards } from "@/components/section-cards"
import { DataTable } from "@/components/data-table"
import data from "./data.json"

export default function UserDashboardPage() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <DataTable data={data} />
      </div>
    </>
  )
}