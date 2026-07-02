import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import bcrypt from "bcryptjs"




export async function GET() {
  try {
    const pool = await connectDB();
    
    // Get all users with status
    const result = await pool.request().query(`
      SELECT 
        id, 
        fullname, 
        username, 
        role, 
        is_active, 
        created_at, 
        deleted_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    
    const users = result.recordset;
    const activeUsers = users.filter((u: any) => u.is_active === 1 || u.is_active === true).length;
    
    return NextResponse.json({
      users,
      totalUsers: users.length,
      activeUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}


// export async function GET() {
//   try {
//     const pool = await connectDB()

//     const result = await pool.request().query(`
//       SELECT *
//       FROM users
//     `)

//     return NextResponse.json(result.recordset)
//   } catch (error) {
//     console.error(error)

//     return NextResponse.json(
//       { message: "Failed to fetch users" },
//       { status: 500 }
//     )
//   }
// }


export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const { fullname, username, password, role } = body

        const pool = await connectDB()

        // Check if user already exists
        const existingUser = await pool.request()
            .input("fullname", fullname)
            .query(`
        SELECT id
        FROM users
        WHERE fullname = @fullname
      `)

        if (existingUser.recordset.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists",
                },
                {
                    status: 400,
                }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Insert user
        await pool.request()
            .input("fullname", fullname)
            .input("username",username )
            .input("password", hashedPassword)
            .input("role", role)
            .query(`
        INSERT INTO users (
          fullname,
          username,
          password,
          role
        )
        VALUES (

          @fullname,
          @username,
          @password,
          @role
        )
      `)

        return NextResponse.json({
            success: true,
            message: "User created successfully",
        })

    } catch (error) {
        console.error(error)

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create user" + error,
            },
            {
                status: 500,
            }
        )
    }
}