import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    console.log("Token from cookie:", token);
    // 1. NO TOKEN
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }





    try {
        // 2. VERIFY TOKEN (this checks expiry too)
        jwt.verify(token, process.env.JWT_SECRET as string);

        // 3. VALID → allow
        return NextResponse.next();
    } catch (err) {
        // 4. INVALID OR EXPIRED → BLOCK
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/user/:path*",
        "/api/rform/:path*",
    ],
};