import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "No token" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    return NextResponse.json({
      message: "Token valid",
      user: decoded,
    });

  } catch (err) {
    return NextResponse.json(
      {
        message: "Token expired or invalid",
        error: String(err),
      },
      { status: 401 }
    );
  }
}