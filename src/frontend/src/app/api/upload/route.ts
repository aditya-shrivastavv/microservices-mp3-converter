import axios from 'axios'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    let token = request.headers.get('Authorization')
    if (!token) {
      return new Response('Unauthorized!', {
        status: 401,
      })
    }
    token = token.replace('Bearer ', '')

    const formData = await request.formData()
    const gatewayIP = formData.get('gatewayIP')
    const file = formData.get('file') as File

    const formDataToSend = new FormData()
    formDataToSend.append('file', file)
    const response = await axios.post(gatewayIP + '/upload', formDataToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    if (response.status == 200) {
      return new Response('File uploaded successfully!', { status: 200 })
    }
  } catch (error: any) {
    console.log(error)
    return new Response('File upload failed!', {
      status: 500,
    })
  }
}
