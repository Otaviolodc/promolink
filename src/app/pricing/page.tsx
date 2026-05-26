"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function PricingPage() {

  const [pixData, setPixData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const handleSubscribe =
    async () => {

      try {

        setLoading(true);

        // 🚀 pegar usuário logado
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {

          alert("Usuário não autenticado");

          setLoading(false);

          return;

        }

        // 🚀 criar pagamento
        const response =
          await fetch(
            "/api/asaas/create-payment",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                name:
                  user.email || "Usuário",

                email:
                  user.email,

                cpfCnpj:
                  "14895719650",

                value: 29.90,

                userId:
                  user.id,

              }),
            }
          );

        const data =
          await response.json();

        console.log(data);

        // 🚨 erro API
        if (data.error) {

          alert(data.error);

          setLoading(false);

          return;

        }

        setPixData(data);

      } catch (error) {

        console.log(error);

        alert(
          "Erro ao gerar PIX"
        );

      }

      setLoading(false);
    };

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 max-w-lg w-full">

        <h1 className="text-4xl font-bold mb-3">
          PromoLink PRO
        </h1>

        <p className="text-gray-400 mb-8">
          Analytics, produtos ilimitados
          e recursos premium.
        </p>

        <div className="bg-zinc-800 rounded-2xl p-6 mb-8">

          <h2 className="text-5xl font-bold">

            R$ 29

            <span className="text-lg text-gray-400">
              /mês
            </span>

          </h2>

        </div>

        {!pixData ? (

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 transition text-black py-4 rounded-2xl font-bold text-lg"
          >

            {
              loading
                ? "Gerando PIX..."
                : "Assinar PRO"
            }

          </button>

        ) : (

          <div>

            <img
              src={`data:image/png;base64,${pixData.encodedImage}`}
              className="w-64 h-64 mx-auto rounded-2xl bg-white p-4"
            />

            <textarea
              value={pixData.payload || ""}
              readOnly
              className="w-full bg-zinc-800 mt-6 p-4 rounded-2xl text-sm h-32 text-white"
            />

          </div>

        )}

      </div>

    </div>

  );

}