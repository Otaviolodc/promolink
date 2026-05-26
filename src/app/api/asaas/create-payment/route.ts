import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

import { ASAAS_URL } from "@/lib/asaas";

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

    // 🚀 headers Asaas
    const headers = new Headers();

    headers.set(
      "accept",
      "application/json"
    );

    headers.set(
      "content-type",
      "application/json"
    );

    headers.set(
      "access_token",
      String(
        process.env.ASAAS_API_KEY
      )
    );

    console.log("TOKEN:");
    console.log(
      process.env.ASAAS_API_KEY
    );

    // =====================================================
    // 🚀 1. CRIAR CUSTOMER
    // =====================================================

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

    // 🚨 erro customer
    if (
      customerData.errors
    ) {

      return NextResponse.json(
        {
          error:
            customerData.errors[0]
              .description,
        },
        {
          status: 400,
        }
      );

    }

    // =====================================================
    // 🚀 2. CRIAR PAGAMENTO PIX
    // =====================================================

    const paymentResponse =
      await fetch(
        `${ASAAS_URL}/payments`,
        {
          method: "POST",

          headers,

          body: JSON.stringify({

            customer:
              customerData.id,

            billingType:
              "PIX",

            value,

            dueDate:
              new Date()
                .toISOString()
                .split("T")[0],

            description:
              "PromoLink PRO",

            // 🚀 MUITO IMPORTANTE
            externalReference:
              userId,

          }),
        }
      );

    const paymentData =
      await paymentResponse.json();

    console.log(
      "PAYMENT:"
    );

    console.log(paymentData);

    // 🚨 erro pagamento
    if (
      paymentData.errors
    ) {

      return NextResponse.json(
        {
          error:
            paymentData.errors[0]
              .description,
        },
        {
          status: 400,
        }
      );

    }

    // =====================================================
    // 🚀 3. SALVAR NO SUPABASE
    // =====================================================

    await supabase
      .from("payments")
      .insert({

        user_id:
          userId,

        payment_id:
          paymentData.id,

        status:
          paymentData.status,

      });

    // =====================================================
    // 🚀 4. BUSCAR QR CODE PIX
    // =====================================================

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

    console.log(
      "QRCODE:"
    );

    console.log(qrData);

    // =====================================================
    // 🚀 RETORNO
    // =====================================================

    return NextResponse.json({

      success: true,

      paymentId:
        paymentData.id,

      status:
        paymentData.status,

      payload:
        qrData.payload,

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