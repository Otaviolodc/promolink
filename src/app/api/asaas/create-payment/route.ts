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

    // VALIDAÇÃO
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
      "content-type": "application/json",
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

    // =========================
    // CRIAR PAGAMENTO PIX
    // =========================

    const paymentResponse =
      await fetch(
        `${ASAAS_URL}/payments`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            customer: customerData.id,

            billingType: "PIX",

            value,

            dueDate:
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

    const paymentData =
      await paymentResponse.json();

    console.log(
      "PAYMENT CREATED:"
    );

    console.log(paymentData);

    // =========================
    // SALVAR PAYMENT
    // =========================

    await supabase
      .from("payments")
      .insert({
        user_id: userId,
        payment_id: paymentData.id,
        status: paymentData.status,
      });

    // =========================
    // PEGAR QRCODE
    // =========================

    const qrResponse =
      await fetch(
        `${ASAAS_URL}/payments/${paymentData.id}/pixQrCode`,
        {
          method: "GET",
          headers,
        }
      );

    const qrData =
      await qrResponse.json();

    return NextResponse.json({
      success: true,

      paymentId: paymentData.id,

      status: paymentData.status,

      payload: qrData.payload,

      encodedImage:
        qrData.encodedImage,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error:
          "Erro ao criar pagamento",
      },
      {
        status: 500,
      }
    );
  }
}