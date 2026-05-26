import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ASAAS_URL } from "@/lib/asaas";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      name,
      email,
      cpfCnpj,
      value,
      userId,
    } = body;

    // =========================
    // VALIDAÇÃO
    // =========================

    if (!userId) {

      return NextResponse.json(
        {
          error: "userId obrigatório",
        },
        {
          status: 400,
        }
      );

    }

    const headers = {
      accept: "application/json",

      "content-type":
        "application/json",

      access_token: String(
        process.env.ASAAS_API_KEY
      ),
    };

    // =========================
    // CRIAR CUSTOMER
    // =========================

    const customerResponse =
      await fetch(
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
      );

    const customerData =
      await customerResponse.json();

    console.log(
      "CUSTOMER:"
    );

    console.log(customerData);

    // =========================
    // CRIAR ASSINATURA
    // =========================

    const subscriptionResponse =
      await fetch(
        `${ASAAS_URL}/subscriptions`,
        {
          method: "POST",

          headers,

          body: JSON.stringify({
            customer:
              customerData.id,

            billingType:
              "PIX",

            value,

            cycle:
              "MONTHLY",

            nextDueDate:
              new Date()
                .toISOString()
                .split("T")[0],

            description:
              "PromoLink PRO",

            externalReference:
              userId,
          }),
        }
      );

    const subscriptionData =
      await subscriptionResponse.json();

    console.log(
      "SUBSCRIPTION:"
    );

    console.log(
      subscriptionData
    );

    // =========================
    // SALVAR ASSINATURA
    // =========================

    await supabase
      .from("payments")
      .insert({
        user_id: userId,

        payment_id:
          subscriptionData.id,

        status:
          subscriptionData.status,
      });

    // =========================
    // PEGAR QR CODE PIX
    // =========================

    const qrResponse =
      await fetch(
        `${ASAAS_URL}/subscriptions/${subscriptionData.id}/payments`,
        {
          method: "GET",

          headers,
        }
      );

    const qrData =
      await qrResponse.json();

    const firstPayment =
      qrData.data?.[0];

    if (!firstPayment) {

      return NextResponse.json({
        error:
          "Pagamento não encontrado",
      });

    }

    // =========================
    // PEGAR QR CODE DO PIX
    // =========================

    const pixResponse =
      await fetch(
        `${ASAAS_URL}/payments/${firstPayment.id}/pixQrCode`,
        {
          method: "GET",

          headers,
        }
      );

    const pixData =
      await pixResponse.json();

    return NextResponse.json({
      success: true,

      subscriptionId:
        subscriptionData.id,

      paymentId:
        firstPayment.id,

      status:
        firstPayment.status,

      payload:
        pixData.payload,

      encodedImage:
        pixData.encodedImage,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Erro ao criar assinatura",
      },
      {
        status: 500,
      }
    );

  }

}