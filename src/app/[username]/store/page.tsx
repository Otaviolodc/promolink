"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default async function StorePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {

  const resolvedParams = await params;
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

  if (resolvedParams?.username) {
    loadStore();
  }

}, [resolvedParams?.username]);

  async function loadStore() {

  try {

    console.log("USERNAME:", resolvedParams.username);

    // PROFILE
    const { data: profileData, error: profileError } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("username", resolvedParams.username)
        .single();

    console.log(profileData);
    console.log(profileError);

    if (profileError || !profileData) {
      setLoading(false);
      return;
    }

    setProfile(profileData);

    // PRODUCTS
    const {
      data: productsData,
      error: productsError,
    } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", profileData.id);

    console.log(productsData);
    console.log(productsError);

    setProducts(productsData || []);

  } catch (err) {

    console.log(err);

  } finally {

    setLoading(false);

  }

}

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <div className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

          <div className="flex flex-col md:flex-row items-center gap-8">

            <img
              src={
                profile?.avatar_url ||
                "/avatar.png"
              }
              className="
                w-32
                h-32
                rounded-full
                border-4
                border-green-500
                object-cover
              "
            />

            <div>

              <h1 className="text-5xl font-black">
                {profile?.username}
              </h1>

              <p className="text-zinc-400 mt-3 text-lg">
                {profile?.bio}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* SEARCH */}
      <div className="max-w-7xl mx-auto px-6">

        <input
          type="text"
          placeholder="🔍 Buscar produto..."
          className="
            w-full
            bg-zinc-900
            border
            border-zinc-800
            rounded-3xl
            px-6
            py-5
            outline-none
            text-lg
            mb-10
          "
        />

      </div>

      {/* MARKETPLACES */}
      <div className="max-w-7xl mx-auto px-6 flex gap-4 overflow-x-auto pb-6">

        {[
          "Todos",
          "Shopee",
          "Amazon",
          "Hotmart",
          "Eduzz",
          "Braip",
        ].map((item) => (

          <button
            key={item}
            className="
              whitespace-nowrap
              px-6
              py-3
              rounded-2xl
              bg-zinc-900
              hover:bg-green-500
              hover:text-black
              transition
              font-semibold
            "
          >
            {item}
          </button>

        ))}

      </div>

      {/* TITLE */}
      <div className="max-w-7xl mx-auto px-6 mt-8 mb-8">

        <h2 className="text-4xl font-black">
          🔥 Produtos Recomendados
        </h2>

        <p className="text-zinc-400 mt-2">
          Produtos selecionados da loja
        </p>

      </div>

      {/* GRID */}
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-6
          pb-20
        "
      >

        {products.map((product) => (

          <div
            key={product.id}
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-3xl
              overflow-hidden
              hover:border-green-500
              hover:-translate-y-2
              transition-all
              duration-300
            "
          >

            {/* IMAGE */}
            <div className="relative">

              <img
                src={
                  product.image_url ||
                  "/placeholder.png"
                }
                className="
                  w-full
                  h-72
                  object-cover
                "
              />

              <div className="absolute top-4 left-4 bg-green-500 text-black text-xs font-black px-3 py-1 rounded-full">
                PROMO
              </div>

            </div>

            {/* CONTENT */}
            <div className="p-5">

              <h3 className="font-bold text-xl line-clamp-2 min-h-[60px]">
                {product.title}
              </h3>

              <div className="mt-4">

                <span className="text-4xl font-black text-green-400">
                  R$ {product.price}
                </span>

              </div>

              <button
                onClick={() =>
                  window.open(
                    product.affiliate_url,
                    "_blank"
                  )
                }
                className="
                  w-full
                  mt-5
                  bg-green-500
                  hover:bg-green-400
                  transition
                  text-black
                  py-4
                  rounded-2xl
                  font-black
                  text-lg
                "
              >
                Comprar Agora
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}