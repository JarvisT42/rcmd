import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    const pool = await connectDB()

    const result = await pool.request()
      .input("username", username)
      .query(`
        SELECT id, username, password, role
        FROM users
        WHERE username = @username
      `)

    const user = result.recordset[0]

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid credentials"
        },
        {
          status: 401
        }
      )
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return NextResponse.json(
        {
          message: "Invalid credentials"
        },
        {
          status: 401
        }
      )
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "30m",
      }
    )

    const response = NextResponse.json({
      message: "Login success",
      role: user.role,
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 30,
    })

    return response

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        message: "Server error"
      },
      {
        status: 500
      }
    )
  }
}