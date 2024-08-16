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
    const fid = formData.get('fid')

    const response = await axios.get(gatewayIP + '/download?fid=' + fid, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'stream',
    })
    return new Response(response.data, { status: 200 })
  } catch (error: any) {
    console.log(error)
    return new Response('File not found!', {
      status: 500,
    })
  }
}
