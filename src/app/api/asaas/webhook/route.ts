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

    const event = body.event;
    const payment = body.payment;

    if (!payment) {
      return NextResponse.json({
        error: "Pagamento não encontrado",
      });
    }

    const userId =
      payment.externalReference;

    if (!userId) {
      return NextResponse.json({
        error: "externalReference não encontrado",
      });
    }

    console.log(
      "USUÁRIO:",
      userId
    );

    // 🚀 PAGAMENTO APROVADO
    if (
      event === "PAYMENT_RECEIVED" ||
      event === "PAYMENT_CONFIRMED"
    ) {

      console.log(
        "LIBERANDO PRO"
      );

      const { error } =
        await supabase
          .from("profiles")
          .update({
            is_pro: true,
            subscription_status: "active",
          })
          .eq("id", userId);

      if (error) {
        console.log(error);

        return NextResponse.json({
          error: error.message,
        });
      }

      console.log(
        "PRO LIBERADO"
      );
    }

    // 🚀 PAGAMENTO VENCIDO / CANCELADO
    if (
      event === "PAYMENT_OVERDUE" ||
      event === "PAYMENT_DELETED" ||
      event === "PAYMENT_REFUNDED"
    ) {

      console.log(
        "REMOVENDO PRO"
      );

      const { error } =
        await supabase
          .from("profiles")
          .update({
            is_pro: false,
            subscription_status: "inactive",
          })
          .eq("id", userId);

      if (error) {
        console.log(error);

        return NextResponse.json({
          error: error.message,
        });
      }

      console.log(
        "PRO REMOVIDO"
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