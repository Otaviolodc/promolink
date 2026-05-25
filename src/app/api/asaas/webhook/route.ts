import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    console.log("WEBHOOK:");
    console.log(body);

    const event = body.event;

    // pagamento confirmado
    if (
      event === "PAYMENT_RECEIVED"
      ||
      event === "PAYMENT_CONFIRMED"
    ) {

      const payment =
        body.payment;

      const userId =
        payment.externalReference;

      console.log("USER ID:");
      console.log(userId);

      // ativa PRO
      await supabase
        .from("profiles")
        .update({
          is_pro: true,
        })
        .eq("id", userId);

      console.log("PRO ATIVADO");

    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error: "Erro webhook",
      },
      {
        status: 500,
      }
    );

  }

}