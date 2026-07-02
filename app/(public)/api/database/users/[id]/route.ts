import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      );
    }
    
    const pool = await connectDB();
    
    // Check if user exists
    const checkUser = await pool.request()
      .input('id', userId)
      .query('SELECT * FROM users WHERE id = @id');
    
    if (checkUser.recordset.length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Permanent delete
    await pool.request()
      .input('id', userId)
      .query('DELETE FROM users WHERE id = @id');
    
    return NextResponse.json({
      success: true,
      message: "User permanently deleted"
    });
  } catch (error) {
    console.error('Error permanently deleting user:', error);
    return NextResponse.json(
      { message: "Failed to permanently delete user" },
      { status: 500 }
    );
  }
}