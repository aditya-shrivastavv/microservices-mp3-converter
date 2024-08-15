import Config from '@/config/main'
import { NextRequest } from 'next/server'

const gatewayUrl = Config.API_URL

export function GET(request: NextRequest) {
  return new Response(gatewayUrl, { status: 200 })
}
