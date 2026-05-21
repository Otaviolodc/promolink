import { NextResponse } from "next/server";

export async function GET() {

  try {

    const response = await fetch(
      "https://api.mercadolibre.com/highlights/MLB/category/MLB1055",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0",
        },
      }
    );

    const data =
      await response.json();

    return NextResponse.json(
      data
    );

  } catch (error: any) {

    return NextResponse.json({
      message:
        error.message,
    });

  }

}