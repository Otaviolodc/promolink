import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
) {
  const code =
    req.nextUrl.searchParams.get(
      "code"
    );

  if (!code) {
    return NextResponse.json({
      error: "Sem code",
    });
  }

  const response = await fetch(
    "https://api.mercadolibre.com/oauth/token",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        grant_type:
          "authorization_code",

        client_id:
          process.env
            .MERCADO_LIVRE_CLIENT_ID!,

        client_secret:
          process.env
            .MERCADO_LIVRE_CLIENT_SECRET!,

        code,

        redirect_uri:
          "https://unsaid-pellet-extenuate.ngrok-free.dev/api/auth/ml/callback",
      }),
    }
  );

  const data =
    await response.json();

  console.log(data);

const accessToken =
  data.access_token;

return NextResponse.redirect(
  "http://localhost:3000/dashboard"
);
}