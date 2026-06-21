import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const users = [
    { id: 1, username: "asd", password: "asd", role: "admin" },
    { id: 2, username: "sdf", password: "sdf", role: "user" },
];

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        const user = users.find(
            (u) => u.username === username && u.password === password
        );

        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }
        console.log("JWT SECRET:", process.env.JWT_SECRET);
        // 🔐 THIS IS WHERE JWT IS CREATED
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "20s" }
        );
        console.log("JWT TOKEN:", token);

        const response = NextResponse.json({
            role: user.role,
            message: "Login success",
        });

        // 🍪 store token in cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: false,
            path: "/",
        });

        return response;

    } catch (err) {
        return NextResponse.json(
            {
                message: "Server error"
            },

            { status: 500 }
        );
    }
}