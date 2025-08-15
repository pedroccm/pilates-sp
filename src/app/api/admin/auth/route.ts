import { NextResponse } from 'next/server'

const ADMIN_PASSWORD = 'q1w2e3r4t5'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true })
      
      // Definir cookie de autenticação (7 dias)
      response.cookies.set('admin-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 dias
      })

      return response
    } else {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE() {
  // Logout - remover cookie
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin-auth')
  return response
}