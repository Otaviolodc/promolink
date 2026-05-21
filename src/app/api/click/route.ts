import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json();

    const {
      link_id,
      product_id,
      device,
      country,
    } = body;

    const { error } = await supabase
      .from("clicks")
      .insert([
        {
          link_id,
          product_id,
          device,
          country,
        },
      ]);

    if (error) {
      return NextResponse.json({
        error,
      });
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    return NextResponse.json({
      error,
    });
  }
}