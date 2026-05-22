"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function AuthPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // LOGIN
  const handleLogin = async () => {

    try {

      setLoading(true);

      const { error } =
        await supabase.auth.signInWithPassword({

          email,
          password,

        });

      if (error) {

        alert(error.message);

        setLoading(false);

        return;

      }

      // 🚀 redirect rápido
      window.location.href = "/dashboard";

    } catch (error) {

      console.log(error);

      alert("Erro ao fazer login");

      setLoading(false);

    }

  };

  // CRIAR CONTA
  const handleSignup = async () => {

    try {

      setLoading(true);

      const { error } =
        await supabase.auth.signUp({

          email,
          password,

        });

      if (error) {

        alert(error.message);

        setLoading(false);

        return;

      }

      alert("Conta criada com sucesso!");

      window.location.href = "/dashboard";

    } catch (error) {

      console.log(error);

      alert("Erro ao criar conta");

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-10 shadow-2xl">

        {/* HEADER */}

        <div className="text-center mb-8">

          <h1 className="text-5xl font-bold text-white mb-3">
            PromoLink
          </h1>

          <p className="text-zinc-400">
            Entre na sua conta
          </p>

        </div>

        {/* FORM */}

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-green-500"
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-green-500"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 transition text-black py-4 rounded-2xl font-bold text-lg"
          >

            {
              loading
                ? "Entrando..."
                : "Entrar"
            }

          </button>

        </div>

        {/* SIGNUP */}

        <div className="text-center mt-8">

          <p className="text-zinc-500">
            Não possui conta?
          </p>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="text-green-400 hover:text-green-300 font-semibold mt-2"
          >

            Criar Conta

          </button>

        </div>

      </div>

    </div>

  );

}