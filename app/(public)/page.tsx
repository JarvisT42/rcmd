import { Button } from "@/components/ui/button"
import Link from "next/link"


import { SectionCards } from "@/components/section-cards"
import { DataTable } from "@/components/data-table"
import data from "./data.json"






export default function Page() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="flex   gap-4 text-sm  text-center">
        

        <DataTable data={data} />


        
      </div>
    </main>
  )
}