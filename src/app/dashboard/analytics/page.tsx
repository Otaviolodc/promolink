"use client";

import Sidebar from "@/components/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {

  const chartData = [
  { day: "Seg", clicks: 12 },
  { day: "Ter", clicks: 18 },
  { day: "Qua", clicks: 22 },
  { day: "Qui", clicks: 35 },
  { day: "Sex", clicks: 49 },
  { day: "Sáb", clicks: 41 },
  { day: "Dom", clicks: 67 },
];
  const aiMessages = [

  "🚀 Seus links cresceram acima da média hoje.",

  "🔥 Produtos com imagem convertem até 4x mais.",

  "📈 Seu horário mais forte é entre 19h e 22h.",

  "🤖 Seu perfil tem potencial viral hoje.",

  "💰 Links com títulos curtos performam melhor.",

];

  const randomMessage =
  aiMessages[0];

  return (

    <div className="flex bg-black text-white min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl font-black">
            ⚡ Centro de IA e Performance
          </h1>

          <p className="text-gray-400 mt-2 text-lg">
            IA analisando seus links em tempo real
          </p>

        </div>

        {/* CARDS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          {/* RECEITA */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <p className="text-gray-400 text-sm">
              💰 Receita Estimada
            </p>

            <h2 className="text-4xl font-black text-green-400 mt-3">
              R$ 2.450
            </h2>

            <p className="text-green-400 text-sm mt-2">
              +18% hoje
            </p>

          </div>

          {/* VISITANTES */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <p className="text-gray-400 text-sm">
              👀 Visitantes Hoje
            </p>

            <h2 className="text-4xl font-black mt-3">
              1.284
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Tráfego em crescimento
            </p>

          </div>

          {/* CONVERSÃO */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <p className="text-gray-400 text-sm">
              📈 Conversão
            </p>

            <h2 className="text-4xl font-black mt-3">
              4.8%
            </h2>

            <p className="text-green-400 text-sm mt-2">
              Acima da média
            </p>

          </div>

          {/* SCORE */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <p className="text-gray-400 text-sm">
              🧠 Score IA
            </p>

            <h2 className="text-4xl font-black mt-3 text-green-400">
              87/100
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Performance excelente
            </p>

          </div>

      </div>

        {/* GRÁFICO */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-10">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl font-bold">
                📈 Crescimento de Cliques
              </h2>

              <p className="text-gray-400 mt-1">
                Últimos 7 dias
              </p>

            </div>

            <div className="text-green-400 font-bold">
              +32%
            </div>

          </div>

          {/* BARRAS */}
          <div className="h-72">

  <ResponsiveContainer width="100%" height="100%">

    <LineChart data={chartData}>

      <XAxis
        dataKey="day"
        stroke="#888"
      />

      <YAxis
        stroke="#888"
      />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="clicks"
        stroke="#00ff66"
        strokeWidth={4}
      />

    </LineChart>

  </ResponsiveContainer>

</div>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* IA INSIGHTS */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              🤖 Insights da IA
            </h2>

            <div className="space-y-4">

  <div className="bg-zinc-800 rounded-2xl p-5 border border-green-500/20">

    <p className="text-green-400 font-semibold mb-2">
      IA ANALISANDO PERFORMANCE
    </p>

    <p className="text-lg">
      {randomMessage}
    </p>

  </div>

  <div className="bg-zinc-800 rounded-2xl p-5">

    <p>
      📊 Seus links tiveram aumento
      de 32% nas últimas 24h.
    </p>

  </div>

  <div className="bg-zinc-800 rounded-2xl p-5">

    <p>
      🎯 Produtos com imagem estão
      recebendo mais cliques.
    </p>

  </div>

</div>

</div>

          {/* RANKING */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              🏆 Ranking de Links
            </h2>

            <div className="space-y-4">

              <div className="bg-zinc-800 rounded-2xl p-5 flex items-center justify-between">

                <div>
                  <p className="font-bold">
                    Bolsa Nike
                  </p>

                  <p className="text-sm text-gray-400">
                    245 cliques
                  </p>
                </div>

                <div className="text-green-400 font-bold">
                  +32%
                </div>

              </div>

              <div className="bg-zinc-800 rounded-2xl p-5 flex items-center justify-between">

                <div>
                  <p className="font-bold">
                    Creatina Growth
                  </p>

                  <p className="text-sm text-gray-400">
                    182 cliques
                  </p>
                </div>

                <div className="text-green-400 font-bold">
                  +21%
                </div>

              </div>

              <div className="bg-zinc-800 rounded-2xl p-5 flex items-center justify-between">

                <div>
                  <p className="font-bold">
                    Starlink Mini
                  </p>

                  <p className="text-sm text-gray-400">
                    120 cliques
                  </p>
                </div>

                <div className="text-green-400 font-bold">
                  +12%
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}