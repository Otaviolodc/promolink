import { supabase } from "@/lib/supabase";

export default async function PublicPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // 🔎 buscar perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Usuário não encontrado</p>
      </div>
    );
  }

  // 🔗 buscar links do usuário
  const { data } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: true });

  const links = data || [];

  const templateStyles = {
  dark: `
    bg-black
    text-white
  `,

  glass: `
    bg-white/10
    backdrop-blur-2xl
    text-white
  `,

  neon: `
    bg-black
    text-green-400
  `,

  luxury: `
    bg-zinc-950
    text-yellow-400
  `,

  cyberpunk: `
    bg-black
    text-pink-500
  `,
};

  return (
    <div
  className={`
    min-h-screen
    flex
    flex-col
    items-center
    px-6
    py-10
    ${
      templateStyles[
        profile.template || "dark"
      ]
    }
  `} 
      style={{
        background: `linear-gradient(to bottom, ${profile.theme_color}, #000)`,
      }}
    >

      {/* HERO PREMIUM */}
<div className="relative flex flex-col items-center mb-12 w-full">

  {/* GLOW */}
  <div
    className="absolute w-72 h-72 rounded-full blur-3xl opacity-30"
    style={{
      background: profile.theme_color,
    }}
  />

  {/* CARD */}
  <div className="relative z-10 flex flex-col items-center">

    {/* FOTO */}
    {profile.avatar_url ? (
      <img
        src={profile.avatar_url}
        className="
          w-32
          h-32
          rounded-full
          object-cover
          border-4
          border-white/20
          shadow-[0_0_60px_rgba(255,255,255,0.2)]
        "
      />
    ) : (
      <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center text-5xl font-bold">
        {username?.[0]?.toUpperCase()}
      </div>
    )}

    {/* USERNAME */}
    <h1 className="mt-6 text-4xl font-black tracking-tight">
      @{profile.username}
    </h1>

    {/* BADGE */}
    {profile.subscription_status ===
      "active" && (
      <div
        className="
          mt-3
          px-4
          py-1
          rounded-full
          bg-green-500/20
          border
          border-green-400/30
          text-green-300
          text-sm
          font-semibold
          backdrop-blur-xl
        "
      >
        ✨ PRO MEMBER
      </div>
    )}

    {/* BIO */}
    {profile.bio && (
      <p
        className="
          text-center
          text-white/70
          mt-5
          max-w-xl
          text-lg
          leading-relaxed
        "
      >
        {profile.bio}
      </p>
    )}

  </div>

</div>

      {/* BOTÃO DESTAQUE */}
      {profile.featured_url && (
        <a
          href={profile.featured_url}
          target="_blank"
          className="mb-8 bg-white text-black px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition"
        >
          {profile.featured_text || "🔥 Oferta Especial"}
        </a>
      )}

      {/* REDES */}
      <div className="flex gap-4 mb-8">

        {profile.instagram && (
          <a
            href={profile.instagram}
            target="_blank"
            className="bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20"
          >
            Instagram
          </a>
        )}

        {profile.telegram && (
          <a
            href={profile.telegram}
            target="_blank"
            className="bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20"
          >
            Telegram
          </a>
        )}

        {profile.whatsapp && (
          <a
            href={profile.whatsapp}
            target="_blank"
            className="bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20"
          >
            WhatsApp
          </a>
        )}

      </div>

      {/* LINKS */}
      <div className="w-full max-w-md space-y-4">

        {links.length === 0 ? (
          <p className="text-white/70 text-center">
            Nenhum link encontrado
          </p>
        ) : (
          links.map((link, index) => (
            <a
              key={link.id}
              href={`/go/${link.slug}`}
              className={`block rounded-2xl overflow-hidden transition hover:scale-[1.02] shadow-2xl ${
                index === 0
                  ? "border-2 border-white"
                  : "border border-white/10"
              }`}
            >

              <div className="bg-black/40 backdrop-blur-lg p-4">

                <div className="flex items-center gap-4">

                  {/* IMAGEM */}
                  {link.image_url && (
                    <img
                      src={link.image_url}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  )}

                  {/* TEXTO */}
                  <div className="flex flex-col">

                    {/* BADGE */}
                    {index === 0 && (
                      <span className="text-xs mb-1">
                        🔥 Recomendado
                      </span>
                    )}

                    <span
                      className="font-semibold text-lg"
                      style={{
                        color:
                          profile?.product_text_color ||
                          "#000000",
                      }}
                   >
                      {link.title}
                    </span>

                    <span className="text-xs text-white/60">
                      {link.clicks} cliques
                    </span>

                  </div>

                </div>

              </div>

            </a>
          ))
        )}

      </div>

      {/* FOOTER */}
      <div className="mt-12 text-xs text-white/50">
        Powered by PromoLink
      </div>

    </div>
  );
}