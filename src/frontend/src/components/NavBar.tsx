'use client'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'

type Props = {}

const links = [
  {
    path: '/login',
    text: 'Login',
  },
  {
    path: '/register',
    text: 'Register',
  },
  {
    path: '/upload',
    text: 'Upload',
  },
  {
    path: '/download',
    text: 'Download',
  },
]

const NavBar = (props: Props) => {
  const pathname = usePathname()
  const router = useRouter()

  const logout = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      return
    }

    localStorage.removeItem('token')
    if (pathname === '/login') {
      location.reload()
    } else {
      router.push('/login')
    }
  }

  return (
    <nav className="fixed top-0 w-full shadow-2xl flex justify-center border-b-[1px] border-cyan-950">
      <div className="max-w-xl flex justify-between items-center text-white text-bold text-lg px-6 py-2 gap-3">
        {links.map((link) => (
          <a
            key={link.text}
            href={link.path}
            className={`px-4 rounded-md hover:bg-cyan-800 ${
              pathname === link.path
                ? 'bg-cyan-400 text-gray-800 font-bold'
                : ''
            }`}
          >
            {link.text}
          </a>
        ))}
        <button
          className="bg-red-600 px-4 rounded-full font-bold shadow-2xl hover:bg-red-400"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default NavBar
