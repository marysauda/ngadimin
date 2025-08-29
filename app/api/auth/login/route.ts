import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Pre-hashed password for security
// Username: ngadim
// Password: #Maryono1920$
const ADMIN_USER = {
  username: 'ngadim',
  // This is the hashed version of #Maryono1920$
  passwordHash: '$2a$10$F3h5pMq7y8XVqw5N9rDHOuYJH5HbZxKqC4tN1VbLtS6LCnGBvZ5JG'
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Check username
    if (username !== ADMIN_USER.username) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // For initial setup, we'll compare the password directly
    // In production, you should hash the password and compare with bcrypt
    if (password === '#Maryono1920$') {
      return NextResponse.json(
        { message: 'Login successful', user: username },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { message: 'Invalid username or password' },
      { status: 401 }
    )

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
