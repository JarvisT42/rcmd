import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET() {
  try {
    const pool = await connectDB()

    const result = await pool.request().query(`
      SELECT *
      FROM RecommendationForm
    `)

    return NextResponse.json(result.recordset)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: "Database error" },
      { status: 500 }
    )
  }
}