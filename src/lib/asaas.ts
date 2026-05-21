export const ASAAS_URL = process.env.ASAAS_API_URL!

export function getAsaasHeaders() {
  return {
    accept: "application/json",
    "content-type": "application/json",
    access_token: String(process.env.ASAAS_API_KEY),
  }
}