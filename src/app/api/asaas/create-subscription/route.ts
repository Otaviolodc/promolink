import { NextResponse } from "next/server"
import { ASAAS_URL, asaasHeaders } from "@/lib/asaas"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const {
      customer,
      value,
      userId,
    } = body

    const response = await fetch(
      `${ASAAS_URL}/subscriptions`,
      {
        method: "POST",
        headers: asaasHeaders,
        body: JSON.stringify({
          customer,
          billingType: "PIX",
          cycle: "MONTHLY",
          value,
          nextDueDate: new Date().toISOString().split("T")[0],
          externalReference: userId,
        }),
      }
    )

    const data = await response.json()

    return NextResponse.json(data)

  } catch (error) {

    return NextResponse.json(
      {
        error: "Erro ao criar assinatura",
      },
      {
        status: 500,
      }
    )

  }

}