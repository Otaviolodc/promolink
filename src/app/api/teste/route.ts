import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        title: "Iphone 15 Pro Max",
        price: "5999",
        image_url: "https://placehold.co/300",
        affiliate_url: "https://google.com",
        marketplace: "Mercado Livre"
      }
    ])
    .select();

  return NextResponse.json({
    data,
    error
  });

}