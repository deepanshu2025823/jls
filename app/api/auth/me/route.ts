// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

export async function GET() {
  try {
    const userId = "user_1766835439621_owqgx5ttl"; 
    
    const [rows]: any = await db.query(
      "SELECT firstName, lastName, profileImage, role FROM user WHERE id = ?", 
      [userId]
    );

    const user = rows[0]; 

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}