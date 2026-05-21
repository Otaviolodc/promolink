import { NextResponse } from "next/server";

export async function GET() {
  const appId =
    process.env.MERCADO_LIVRE_CLIENT_ID

  const redirect =
    "https://unsaid-pellet-extenuate.ngrok-free.dev/api/auth/ml/callback";

  const url =
    `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${appId}&redirect_uri=${redirect}`;

  return NextResponse.redirect(url);
}