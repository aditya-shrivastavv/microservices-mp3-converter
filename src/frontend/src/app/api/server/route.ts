import { NextRequest } from 'next/server'
import dns from 'dns'
import { unstable_noStore } from 'next/cache'

function getGatewayUrl() {
  return new Promise((resolve, reject) => {
    dns.lookup('gateway-service', (err, address) => {
      if (err) {
        console.log('Error: ', err)
        reject(err)
      } else {
        console.log('Address: ', address)
        const gatewayUrl = `http://${address}`
        resolve(gatewayUrl)
      }
    })
  })
}

export async function GET(request: NextRequest) {
  unstable_noStore()
  const gatewayUrl = (await getGatewayUrl()) as string
  return new Response(gatewayUrl, { status: 200 })
}
