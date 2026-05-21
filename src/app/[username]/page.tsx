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

      {/* PERFIL */}
      <div className="flex flex-col items-center mb-8">

        {/* FOTO */}
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-2xl"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-4xl font-bold">
            {username?.[0]?.toUpperCase()}
          </div>
        )}

        {/* USERNAME */}
        <h1 className="mt-5 text-3xl font-bold">
          @{profile.username}
        </h1>

        {/* BIO */}
        {profile.bio && (
          <p className="text-center text-white/80 mt-3 max-w-md">
            {profile.bio}
          </p>
        )}

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