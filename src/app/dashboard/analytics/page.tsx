"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AnalyticsPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [dailyClicks, setDailyClicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // 👤 usuário
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  setLoading(false);
  return;
}

// 🚀 verificar plano
const { data: profile } =
  await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

if (
  profile?.subscription_status !==
  "active"
) {

  window.location.href =
    "/pricing";

  return;

}

      // 🔗 links
      const { data: linksData } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", user.id);

      setLinks(linksData || []);

      // 📈 analytics diário
      const { data: dailyData } = await supabase
  .from("link_clicks_daily")
  .select(`
    *,
    links!inner (
      title,
      user_id
    )
  `)
  .eq("links.user_id", user.id)
  .order("date", { ascending: true });
  
      const formatted =
        dailyData?.map((item: any) => ({
          date: item.date,
          clicks: item.clicks,
          title: item.links?.title || "Link",
        })) || [];

      setDailyClicks(formatted);

      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // 📊 métricas
  const totalClicks = links.reduce(
    (acc, link) => acc + (link.clicks || 0),
    0
  );

  const topLink = [...links].sort(
    (a, b) => (b.clicks || 0) - (a.clicks || 0)
  )[0];

  if (loading) {
    return (
      <div className="p-10 text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="p-8 text-white min-h-screen bg-black">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Analytics
        </h1>

        <p className="text-gray-400 mt-2">
          Acompanhe seus resultados
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">
            Total de Cliques
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {totalClicks}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">
            Links Ativos
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {links.length}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">
            Top Link
          </p>

          <h2 className="text-xl font-bold mt-2">
            {topLink?.title || "-"}
          </h2>
        </div>

      </div>

      {/* 📈 GRÁFICO */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Crescimento Diário
          </h2>

          <span className="text-sm text-gray-400">
            Histórico de cliques
          </span>
        </div>

        <div className="w-full h-80">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={dailyClicks}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
              />

              <XAxis
                dataKey="date"
                stroke="#a1a1aa"
              />

              <YAxis
                stroke="#a1a1aa"
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#22c55e"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* LISTA */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

        <h2 className="text-xl font-bold mb-6">
          Performance dos Links
        </h2>

        {links.length === 0 ? (
          <p className="text-gray-400">
            Nenhum dado encontrado
          </p>
        ) : (
          <div className="space-y-4">

            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between bg-zinc-800/40 p-4 rounded-xl"
              >

                <div>
                  <p className="font-semibold">
                    {link.title}
                  </p>

                  <p className="text-sm text-gray-400">
                    /go/{link.slug}
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-2xl font-bold">
                    {link.clicks}
                  </p>

                  <p className="text-sm text-gray-400">
                    cliques
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}