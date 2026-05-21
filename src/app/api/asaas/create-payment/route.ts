import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { ASAAS_URL } from "@/lib/asaas"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const {
      name,
      email,
      cpfCnpj,
      value,
      userId,
    } = body

    const headers = new Headers()

    headers.set("accept", "application/json")
    headers.set("content-type", "application/json")
    
    headers.set(
      "access_token",
      String(process.env.ASAAS_API_KEY)
    )

    console.log("TOKEN:")
    console.log(process.env.ASAAS_API_KEY)

    console.log("HEADERS:")
    console.log(headers)

    // 1. Criar customer
    const customerResponse = await fetch(
      `${ASAAS_URL}/customers`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          name,
          email,
          cpfCnpj,
        }),
      }
    )

    const customerData = await customerResponse.json()

    // 2. Criar pagamento PIX
    const paymentResponse = await fetch(
      `${ASAAS_URL}/payments`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          customer: customerData.id,
          billingType: "UNDEFINED",
          value,
          dueDate: new Date().toISOString().split("T")[0],
          externalReference: userId,
        }),
      }
    )

    const paymentData = await paymentResponse.json()

    await supabase.from("payments").insert({
      user_id: userId,
      payment_id: paymentData.id,
      status: paymentData.status,
    })

    // 3. Buscar QRCode
    const qrResponse = await fetch(
      `${ASAAS_URL}/payments/${paymentData.id}/pixQrCode`,
      {
        method: "GET",
        headers,
      }
    )

    const qrData = await qrResponse.json()

    console.log("CUSTOMER:")
    console.log(customerData)

    console.log("PAYMENT:")
    console.log(paymentData)

    console.log("QRCODE:")
    console.log(qrData)

    return NextResponse.json({
      success: true,

      paymentId: paymentData.id,

      status: paymentData.status,

      payload: qrData.payload,

      encodedImage: qrData.encodedImage,
    })

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      {
        error: "Erro ao criar pagamento"
      },
      {
        status: 500
      }
    )

  }

}