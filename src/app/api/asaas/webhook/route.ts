import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    console.log("WEBHOOK:")
    console.log(body)

    const event = body.event

    const payment = body.payment

    // pagamento recebido
    if (event === "PAYMENT_RECEIVED") {

      // buscar pagamento salvo
      const { data: paymentData } = await supabase
        .from("payments")
        .select("*")
        .eq("payment_id", payment.id)
        .single()

      // liberar PRO
      if (paymentData?.user_id) {

        await supabase
          .from("profiles")
          .update({
            is_pro: true,
          })
          .eq("id", paymentData.user_id)

        // atualizar pagamento
        await supabase
          .from("payments")
          .update({
            status: "RECEIVED",
          })
          .eq("payment_id", payment.id)

        console.log("USUARIO LIBERADO PRO")
      }

    }

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      {
        error: "Erro webhook"
      },
      {
        status: 500
      }
    )

  }

}