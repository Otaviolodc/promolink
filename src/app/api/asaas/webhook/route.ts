import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    console.log("Webhook recebido:", body);

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