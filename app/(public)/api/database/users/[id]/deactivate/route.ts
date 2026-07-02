import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function PUT(
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
    
    // Check if user exists and is already inactive
    const checkUser = await pool.request()
      .input('id', userId)
      .query('SELECT * FROM users WHERE id = @id');
    
    if (checkUser.recordset.length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    const user = checkUser.recordset[0];
    if (user.is_active === 0) {
      return NextResponse.json(
        { message: "User is already deactivated" },
        { status: 400 }
      );
    }
    
    // Deactivate user
    await pool.request()
      .input('id', userId)
      .query(`
        UPDATE users 
        SET is_active = 0, 
            deleted_at = GETDATE(),
            updated_at = GETDATE()
        WHERE id = @id
      `);
    
    return NextResponse.json({
      success: true,
      message: "User deactivated successfully"
    });
  } catch (error) {
    console.error('Error deactivating user:', error);
    return NextResponse.json(
      { message: "Failed to deactivate user" },
      { status: 500 }
    );
  }
}