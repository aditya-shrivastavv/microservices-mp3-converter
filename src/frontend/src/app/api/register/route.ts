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
      requestBody.gatewayIP + '/register',
      {},
      { auth: { username, password } },
    )
    console.log('response: ', response)

    return new Response('OK', { status: response.status })
  } catch (error: any) {
    console.error('Error: ', error)
    if (error.response.status === 500) {
      return new Response('Username already exists!', { status: 500 })
    }
    return new Response('Internal server error', { status: 500 })
  }
}
