import { supabase } from "@/lib/supabase";

interface Props {
  params: {
    slug: string;
  };
}

export default async function CheckoutPage({
  params,
}: Props) {

  const { data: product } =
    await supabase
      .from("products_checkout")
      .select("*")
      .eq(
        "checkout_slug",
        params.slug
      )
      .single();

  if (!product) {

    return (

      <div className="bg-black text-white min-h-screen flex items-center justify-center">

        Produto não encontrado

      </div>

    );

  }

  return (

    <div className="bg-black text-white min-h-screen">

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* IMAGEM */}
          <div>

            <img
              src={product.image_url}
              className="
                w-full
                rounded-3xl
                border
                border-zinc-800
                shadow-2xl
              "
            />

          </div>

          {/* CONTEÚDO */}
          <div>

            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🚀 Produto Digital
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              {product.title}
            </h1>

            <p className="text-zinc-400 text-lg mt-6 leading-relaxed">
              {product.description}
            </p>

            {/* PREÇO */}
            <div className="mt-10">

              <span className="text-zinc-500 line-through text-2xl">
                R$ 197
              </span>

              <div className="text-6xl font-black text-green-400 mt-2">
                R$ {product.price}
              </div>

            </div>

            {/* BENEFÍCIOS */}
            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-3">
                ✅ Acesso imediato
              </div>

              <div className="flex items-center gap-3">
                ✅ Download liberado
              </div>

              <div className="flex items-center gap-3">
                ✅ Garantia de 7 dias
              </div>

              <div className="flex items-center gap-3">
                ✅ Atualizações grátis
              </div>

            </div>

            {/* BOTÃO */}
            <button
              className="
                mt-12
                w-full
                bg-green-500
                hover:bg-green-400
                transition
                text-black
                py-5
                rounded-3xl
                text-2xl
                font-black
                shadow-2xl
              "
            >
              Comprar Agora 🚀
            </button>

            {/* PROVA SOCIAL */}
            <div className="mt-8 text-sm text-zinc-500">

              🔥 1.247 pessoas compraram nas últimas semanas

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}