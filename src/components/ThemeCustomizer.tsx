"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function ThemeCustomizer({
  profile,
  reloadProfile,
}: any) {

  const [loading, setLoading] =
    useState(false);

  async function updateTheme(
    field: string,
    value: string
  ) {

    try {

      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase
        .from("profiles")
        .update({
          [field]: value,
        })
        .eq("id", user.id);

      reloadProfile();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">

      <div>

        <h2 className="text-2xl font-bold text-white">
          Theme Customizer
        </h2>

        <p className="text-zinc-400 text-sm mt-1">
          Personalize sua página premium.
        </p>

      </div>

      {/* BACKGROUND */}
      <div className="space-y-2">

        <label className="text-sm text-zinc-400">
          Background
        </label>

        <div className="grid grid-cols-3 gap-3">

          <button
            onClick={() =>
              updateTheme(
                "background_style",
                "gradient"
              )
            }
            className="
              h-20
              rounded-2xl
              bg-gradient-to-br
              from-purple-500
              to-blue-500
            "
          />

          <button
            onClick={() =>
              updateTheme(
                "background_style",
                "dark"
              )
            }
            className="
              h-20
              rounded-2xl
              bg-black
              border
              border-white/10
            "
          />

          <button
            onClick={() =>
              updateTheme(
                "background_style",
                "neon"
              )
            }
            className="
              h-20
              rounded-2xl
              bg-gradient-to-br
              from-green-400
              to-cyan-500
            "
          />

        </div>

      </div>

      {/* CARD STYLE */}
      <div className="space-y-2">

        <label className="text-sm text-zinc-400">
          Cards
        </label>

        <div className="grid grid-cols-2 gap-3">

          <button
            onClick={() =>
              updateTheme(
                "card_style",
                "glass"
              )
            }
            className="
              h-16
              rounded-2xl
              bg-white/10
              backdrop-blur-xl
              border
              border-white/20
              text-white
            "
          >
            Glass
          </button>

          <button
            onClick={() =>
              updateTheme(
                "card_style",
                "solid"
              )
            }
            className="
              h-16
              rounded-2xl
              bg-zinc-900
              border
              border-zinc-700
              text-white
            "
          >
            Solid
          </button>

        </div>

      </div>

      {/* BUTTON STYLE */}
      <div className="space-y-2">

        <label className="text-sm text-zinc-400">
          Botões
        </label>

        <div className="grid grid-cols-2 gap-3">

          <button
            onClick={() =>
              updateTheme(
                "button_style",
                "rounded"
              )
            }
            className="
              h-14
              rounded-2xl
              bg-green-500
              text-black
              font-bold
            "
          >
            Rounded
          </button>

          <button
            onClick={() =>
              updateTheme(
                "button_style",
                "square"
              )
            }
            className="
              h-14
              rounded-md
              bg-blue-500
              text-white
              font-bold
            "
          >
            Square
          </button>

        </div>

      </div>

      {loading && (

        <div className="text-sm text-zinc-500">
          Salvando tema...
        </div>

      )}

    </div>

  );

}