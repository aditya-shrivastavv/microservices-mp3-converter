import axios from 'axios'

export async function POST(request: Request) {
  try {
    const creds = request.headers.get('Authorization')
    if (!creds) {
      return new Response('Unauthorized', { status: 401 })
    }

    const [username, password] = atob(creds.split(' ')[1]).split(':')

    const requestBody = await request.json()
    const response = await axios.post(
      requestBody.gatewayIP + '/login',
      {},
      { auth: { username, password } },
    )
    return new Response(response.data, { status: response.status })
  } catch (error: any) {
    if (error.response.status === 401) {
      return new Response('Invalid username or password', { status: 401 })
    }
    return new Response('Internal server error', { status: 500 })
  }
}
