import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {

  try {

    const body = await req.json();

    console.log("Webhook recebido:", body);

    // pagamento confirmado
    if (
      body.event === "PAYMENT_CONFIRMED"
    ) {

      const email =
        body.payment.customer.email;

      console.log(
        "Liberando PRO para:",
        email
      );

      const { error } =
        await supabase
          .from("profiles")
          .update({
            is_pro: true,
          })
          .eq("email", email);

      if (error) {

        console.log(error);

      }

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