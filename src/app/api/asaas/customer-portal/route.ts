import { NextResponse } from "next/server"
import { ASAAS_URL, getAsaasHeaders } from "@/lib/asaas"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const { customerId } = body

    const response = await fetch(
      `${ASAAS_URL}/customers/${customerId}`,
      {
        method: "GET",
        headers: getAsaasHeaders(),
      }
    )

    const data = await response.json()

    return NextResponse.json(data)

  } catch (error) {

    return NextResponse.json(
      {
        error: "Erro ao buscar cliente",
      },
      {
        status: 500,
      }
    )

  }

}