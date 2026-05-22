"use client";

import { useState } from "react";

export default function AuthPage() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  return (

    <div className="min-h-screen bg-black flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-10 shadow-2xl">

        <div className="text-center mb-8">

          <h1 className="text-5xl font-bold text-white mb-3">
            PromoLink
          </h1>

          <p className="text-zinc-400">
            Entre na sua conta
          </p>

        </div>

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
            className="w-full bg-green-500 hover:bg-green-400 transition text-black py-4 rounded-2xl font-bold text-lg"
          >
            Entrar
          </button>

        </div>

        <div className="text-center mt-8">

          <p className="text-zinc-500">
            Não possui conta?
          </p>

          <button
            className="text-green-400 hover:text-green-300 font-semibold mt-2"
          >
            Criar Conta
          </button>

        </div>

      </div>

    </div>

  );

}