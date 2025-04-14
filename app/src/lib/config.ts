import Medusa from "@medusajs/medusa-js"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://10.240.5.163:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
})
