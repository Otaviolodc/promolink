import { NextResponse } from "next/server"
import { ASAAS_URL, asaasHeaders } from "@/lib/asaas"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const { subscriptionId } = body

    const response = await fetch(
      `${ASAAS_URL}/subscriptions/${subscriptionId}`,
      {
        method: "DELETE",
        headers: asaasHeaders,
      }
    )

    const data = await response.json()

    return NextResponse.json(data)

  } catch (error) {

    return NextResponse.json(
      {
        error: "Erro ao cancelar assinatura",
      },
      {
        status: 500,
      }
    )

  }

}