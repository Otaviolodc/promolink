import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(

  process.env.NEXT_PUBLIC_SUPABASE_URL!,

  process.env.SUPABASE_SERVICE_ROLE_KEY!

);

export async function POST(req: Request) {

  try {

    const body = await req.json();

    console.log(
      "WEBHOOK RECEBIDO:",
      JSON.stringify(body, null, 2)
    );

    // 🚀 pagamento confirmado
    if (
      body.event === "PAYMENT_RECEIVED"
    ) {

      const payment =
        body.payment;

      const userId =
        payment.externalReference;

      console.log(
        "LIBERANDO PRO:",
        userId
      );

      // 🚀 atualizar usuário
      const { error } =
        await supabase
          .from("profiles")
          .update({
            is_pro: true,
          })
          .eq("id", userId);

      if (error) {

        console.log(error);

        return NextResponse.json({
          error:
            error.message,
        });

      }

      console.log(
        "USUÁRIO LIBERADO"
      );

    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      error: "Webhook error",
    });

  }

}