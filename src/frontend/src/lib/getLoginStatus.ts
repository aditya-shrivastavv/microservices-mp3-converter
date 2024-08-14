import { jwtDecode } from 'jwt-decode'

type loginStatusReturns = {
  loggedIn: boolean
  message: string
}

function checkValidity(decoded: any) {
  const now = Date.now().valueOf() / 1000
  if (decoded.exp < now) return false
  return true
}

export default function getLoginStatus(): loginStatusReturns {
  const token = localStorage.getItem('token')
  console.log(token)
  if (!token) return { loggedIn: false, message: 'Not logged in' }

  const decoded = jwtDecode(token)
  const isValid = checkValidity(decoded)

  if (!isValid) return { loggedIn: false, message: 'Token expired' }

  return { loggedIn: true, message: 'Logged in' }
}
