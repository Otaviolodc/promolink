"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import MobilePreview from "@/components/dashboard/MobilePreview";
import { isProUser } from "@/lib/isPro";

export default function LinksPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

// 🚀 produtos do banco
  const [products, setProducts] =
  useState<any[]>([]);

  const [clicks, setClicks] =
  useState<any[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [showProductModal, setShowProductModal] =
    useState(false);

  const [productTitle, setProductTitle] =
    useState("");

  const [productPrice, setProductPrice] =
    useState("");

  const [productImage, setProductImage] =
    useState("");

  const [productAffiliateUrl, setProductAffiliateUrl] =
    useState("");

  const [productMarketplace, setProductMarketplace] =
    useState("");

  const [editingLink, setEditingLink] =
    useState<any>(null);

  const [editingProduct, setEditingProduct] =
    useState<any>(null);

  // FORM
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] =
    useState("");

  // 🚀 carregar dados
  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // 👤 perfil
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(profileData);

    // 🔗 links
    const { data: linksData } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", user.id)
      .order("position", {
        ascending: true,
      });

    setLinks(linksData || []);

    // 🚀 produtos do banco
   try {
     const response = await fetch(
       "/api/products"
   );

      const result = await response.json();

      setProducts(result.data || []);

      // 📊 analytics
const { data: clicksData } =
  await supabase
    .from("clicks")
    .select("*");

      setClicks(clicksData || []);

    } catch (err) {
      console.log(
        "Erro produtos:",
        err
  );
}
  };

  useEffect(() => {
    fetchData();
  }, []);

// 📸 upload imagem produto
const handleImageUpload = async (
  e: any
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const fileExt =
    file.name.split(".").pop();

  const fileName = `${user.id}-${Date.now()}.${fileExt}`;

  const { error } =
    await supabase.storage
      .from("products")
      .upload(fileName, file, {
        upsert: true,
      });

  if (error) {
    console.log(error);

    alert(error.message);

    return;
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  setImageUrl(data.publicUrl);
};

// 🚀 upload imagem produto destaque
const handleProductImageUpload = async (
  e: any
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const fileExt =
    file.name.split(".").pop();

  const fileName = `product-${user.id}-${Date.now()}.${fileExt}`;

  const { error } =
    await supabase.storage
      .from("products")
      .upload(fileName, file, {
        upsert: true,
      });

  if (error) {
    alert(error.message);
    return;
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  setProductImage(data.publicUrl);
};

// 🚀 criar produto destaque
const handleCreateProduct = async () => {
  
  if (!profile?.is_pro) {

  alert(
    "Produtos destaque são exclusivos PRO 🚀"
  );

  return;
}

  const response = await fetch(
    "/api/products",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        title: productTitle,
        price: productPrice,
        image_url: productImage,
        affiliate_url:
          productAffiliateUrl,
        marketplace:
          productMarketplace,
      }),
    }
  );

  const result = await response.json();

  if (result.error) {
    console.log(result.error);

    alert("Erro ao criar produto");

    return;
  }

  alert("Produto criado 🚀");

  setShowProductModal(false);

  setProductTitle("");
  setProductPrice("");
  setProductImage("");
  setProductAffiliateUrl("");
  setProductMarketplace("");

  fetchData();
};

  // 🚀 criar link
  const handleCreate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (!title || !url) {
      alert("Preencha os campos");
      return;
    }

    // 🚀 verificar plano
    const pro = await isProUser();

    if (!pro && links.length >= 3) {

      alert(
        "Plano FREE permite apenas 3 links. Assine o PRO 🚀"
      );

      return;
    }

    const slug =
      title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-") +
      "-" +
      Date.now();

    const { error } = await supabase
      .from("links")
      .insert([
        {
          title,
          affiliate_url: url,
          image_url: imageUrl,
          slug,
          clicks: 0,
          user_id: user.id,
        },
      ]);

    if (error) {
      console.log(error);
      alert("Erro ao criar");
      return;
    }

    setTitle("");
    setUrl("");
    setImageUrl("");

    setShowModal(false);

    fetchData();
  };

  // ✏️ editar
  const handleOpenEdit = (link: any) => {
    setEditingLink(link);

    setTitle(link.title);
    setUrl(link.affiliate_url);
    setImageUrl(link.image_url || "");

    setShowModal(true);
  };

  // 💾 salvar edição
  const handleSaveEdit = async () => {
    if (!editingLink) return;

    const { error } = await supabase
      .from("links")
      .update({
        title,
        affiliate_url: url,
        image_url: imageUrl,
      })
      .eq("id", editingLink.id);

    if (error) {
      console.log(error);
      alert("Erro ao editar");
      return;
    }

    setShowModal(false);

    setEditingLink(null);

    setTitle("");
    setUrl("");
    setImageUrl("");

    fetchData();
  };

  // 🗑️ deletar
  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete = confirm(
      "Deseja remover esse link?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("links")
      .delete()
      .eq("id", id);

    fetchData();
  };

  // ✏️ editar produto
const handleEditProduct = (
  item: any
) => {

  setProductTitle(item.title || "");

  setProductPrice(item.price || "");

  setProductImage(
    item.image_url || ""
  );

  setProductAffiliateUrl(
    item.affiliate_url || ""
  );

  setProductMarketplace(
    item.marketplace || ""
  );

  setEditingProduct(item);

  setShowProductModal(true); 
};

// 💾 salvar produto
const handleSaveProduct = async (
  id: string
) => {

  const { error } = await supabase
    .from("products")
    .update({
      title: productTitle,
      price: productPrice,
      image_url: productImage,
      affiliate_url:
        productAffiliateUrl,
      marketplace:
        productMarketplace,
    })
    .eq("id", id);

  if (error) {
    console.log(error);

    alert("Erro ao salvar");

    return;
  }

  alert("Produto atualizado 🚀");

  setShowProductModal(false);

  fetchData();
};

  // 🗑️ remover produto
const handleDeleteProduct = async (
  id: string
) => {

  const confirmDelete = confirm(
    "Deseja remover esse produto?"
  );

  if (!confirmDelete) return;

  await supabase
    .from("products")
    .delete()
    .eq("id", id);

  fetchData();
};

  // 🔥 importar tendência
const handleImportTrend = async (
  item: any
) => {

  const { error } = await supabase
    .from("products")
    .insert([
      {
        title: item.title,

        affiliate_url:
          item.affiliate_url,

        image_url:
          item.image_url || "",

        marketplace:
          item.marketplace || "PromoLink",

        price:
          item.price || "0",
      },
    ]);

  if (error) {
    console.log(error);

    alert("Erro ao importar");

    return;
  }

  alert("Produto importado 🚀");

  fetchData();
};

  // 📊 métricas
const totalClicks =
  clicks.length;

  const topLink = [...links].sort(
    (a, b) => b.clicks - a.clicks
  )[0];

  const handleDragEnd = async (
  result: any
) => {

  if (!result.destination) return;

  const items = Array.from(links);

  const [reorderedItem] =
    items.splice(
      result.source.index,
      1
    );

  items.splice(
    result.destination.index,
    0,
    reorderedItem
  );

  setLinks(items);

  // 🚀 salvar no banco
  const updates = items.map(
    (item, index) => {

      return supabase
        .from("links")
        .update({
          position: index + 1,
        })
        .eq("id", item.id);

    }
  );

  await Promise.all(updates);

};

  return (
    <div className="flex bg-black text-white min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8 flex gap-8">

        {/* CONTEÚDO */}
        <div className="flex-1">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">

            <div>

              <h1 className="text-3xl font-bold">
                Dashboard
              </h1>

              <p className="text-gray-400 mt-1">
                Gerencie seus links
              </p>

          </div>

          {/* BOTÕES */}
          <div className="flex gap-3">

            {/* NOVO LINK */}
            <button
              onClick={() => {

                setEditingLink(null);

                setTitle("");
                setUrl("");
                setImageUrl("");

                setShowModal(true);

              }}
              className="
                bg-green-500
                hover:bg-green-400
                transition
                text-black
                px-6
                py-3
                rounded-xl
                font-semibold
              "
            >

              + Novo Link

            </button>

    {/* NOVO PRODUTO */}
    <button
      onClick={() => {

        if (!profile?.is_pro) {

          alert(
            "Recurso exclusivo PRO 🚀"
          );

          return;
        }

        setShowProductModal(true);

      }}
      className="
        bg-white
        hover:bg-zinc-200
        transition
        text-black
        px-6
        py-3
        rounded-xl
        font-semibold
      "
    >

      + Novo Produto

    </button>

  </div>

</div>

          {/* PLANO */}
<a
  href="/pricing"
  className="block bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6 hover:border-green-500 transition"
>

  <div className="flex items-center justify-between">

    <div>

      <p className="text-sm text-gray-400">
        Plano Atual
      </p>

      <h2 className="text-xl font-semibold mt-1">

        {profile?.is_pro
          ? "Plano PRO 🚀"
          : "Plano FREE"}

      </h2>

    </div>

    {!profile?.is_pro && (

      <div className="text-right">

        <p className="text-sm text-gray-400">
          Links usados
        </p>

        <h2 className="text-2xl font-bold text-green-400">
          {links.length}/3
        </h2>

      </div>

    )}

  </div>

  {!profile?.is_pro &&
    links.length >= 3 && (

    <div className="mt-5 bg-green-500/10 border border-green-500 rounded-2xl p-4">

      <p className="text-green-400 font-semibold">
        Você atingiu o limite FREE 🚀
      </p>

      <p className="text-sm text-gray-400 mt-1">
        Assine o PRO para links ilimitados.
      </p>

      <button
        className="
          mt-4
          bg-green-500
          hover:bg-green-400
          transition
          text-black
          px-5
          py-3
          rounded-2xl
          font-bold
        "
      >
        Upgrade PRO 🚀
      </button>

    </div>

  )}

</a>
          {/* LINK PÚBLICO */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-8">

            <p className="text-sm text-gray-400">
              Sua página pública
            </p>

            <a
              href={`/${profile?.username}`}
              target="_blank"
              className="text-green-400 text-2xl font-bold mt-2 block"
            >
              promolink.com/{profile?.username}
            </a>

          </div>

          {/* MÉTRICAS */}
          <div className="grid grid-cols-3 gap-6 mb-8">

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Total Cliques
              </p>

              <h2 className="text-4xl font-bold mt-3">
                {totalClicks}
              </h2>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Links Ativos
              </p>

              <h2 className="text-4xl font-bold mt-3">
                {links.length}
              </h2>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Melhor Link
              </p>

              <h2 className="text-lg font-semibold mt-3">
                {topLink?.title || "-"}
              </h2>

            </div>

          </div>

          {/* 🔥 PRODUTOS EM DESTAQUE */}
<div className="mb-10">

  <div className="flex items-center justify-between mb-5">

    <div>

      <h2 className="text-2xl font-bold">
        🚀 Produtos em Destaque
      </h2>

      <p className="text-sm text-gray-400 mt-1">
        Produtos em destaque da plataforma
      </p>

    </div>

  </div>

  <div className="relative">

    {/* SETA ESQUERDA */}
    <button
      onClick={() => {
        const container =
          document.getElementById(
            "products-carousel"
          );

        container?.scrollBy({
          left: -1000,
          behavior: "smooth",
        });
      }}
      className="
        absolute
        left-2
        top-1/2
        -translate-y-1/2
        z-20
        bg-black/80
        hover:bg-black
        w-12
        h-12
        rounded-full
        text-white
        text-2xl
        backdrop-blur-xl
      "
    >
      ←
    </button>

    {/* SETA DIREITA */}
    <button
      onClick={() => {
        const container =
          document.getElementById(
            "products-carousel"
          );

        container?.scrollBy({
          left: 1000,
          behavior: "smooth",
        });
      }}
      className="
        absolute
        right-2
        top-1/2
        -translate-y-1/2
        z-20
        bg-black/80
        hover:bg-black
        w-12
        h-12
        rounded-full
        text-white
        text-2xl
        backdrop-blur-xl
      "
    >
      →
    </button>

    {/* CARROSSEL */}
    <div className="overflow-hidden w-full max-w-[1040px]">

  <div
    id="products-carousel"
    className="
      flex
      gap-5
      overflow-x-auto
      scroll-smooth
      snap-x
      snap-mandatory
      scrollbar-hide
      w-full
      max-w-[1040px]
    "
  >

      {products.map((item, index) => (

        <div
          key={index}
          className="
            min-w-[320px]
            flex-shrink-0
            bg-zinc-900
            border
            border-zinc-800
            rounded-3xl
            overflow-hidden
            hover:border-green-500
            hover:scale-[1.02]
            transition-all
            duration-300
          "
        >

          {/* IMAGEM */}
          <div className="relative">

            <img
              src={
                item.image_url ||
                "/placeholder.png"
              }
              alt={item.title}
              className="
                w-full
                h-52
                object-cover
              "
            />

            {/* MARKETPLACE */}
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              {item.marketplace || "PromoLink"}
            </div>

          </div>

          {/* CONTEÚDO */}
          <div className="p-5">

            <h3 className="font-semibold text-lg line-clamp-2 min-h-[56px]">
              {item.title}
            </h3>

            <p className="text-sm text-gray-400 mt-2">

              {
                clicks.filter(
                  (click) =>
                    click.product_id === item.id
                ).length
              }

              {" "}cliques

            </p>

            {/* PREÇO */}
            <div className="mt-4">

              <span className="text-3xl font-bold text-green-400">
                R$ {item.price}
              </span>

            </div>

            {/* BOTÕES */}
            <div className="flex gap-2 mt-5">

              <a
                href={item.affiliate_url}
                target="_blank"
                className="
                  flex-1
                  bg-zinc-800
                  hover:bg-zinc-700
                  transition
                  text-center
                  py-3
                  rounded-2xl
                  text-sm
                  font-semibold
                "
              >
                Ver Produto
              </a>

              <button
                onClick={() =>
                  handleImportTrend(item)
                }
                className="
                  flex-1
                  bg-green-500
                  hover:bg-green-400
                  transition
                  text-black
                  py-3
                  rounded-2xl
                  text-sm
                  font-bold
                "
              >
                + PromoLink
              </button>

            </div>

            {/* AÇÕES */}
            <div className="flex gap-2 mt-3">

              <button
                onClick={() =>
                  handleEditProduct(item)
                }
                className="
                  flex-1
                  bg-blue-500
                  hover:bg-blue-400
                  transition
                  text-black
                  py-2
                  rounded-2xl
                  text-sm
                  font-bold
                "
              >
                Editar
              </button>

              <button
                onClick={() =>
                  handleDeleteProduct(item.id)
                }
                className="
                  flex-1
                  bg-red-500
                  hover:bg-red-400
                  transition
                  text-black
                  py-2
                  rounded-2xl
                  text-sm
                  font-bold
                "
              >
                Remover
              </button>

            </div>

          </div>

        </div>

      ))}

    </div>
    </div>

  </div>

</div>

          {/* LINKS */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">

            <div className="p-6 border-b border-zinc-800">

              <h2 className="text-xl font-bold">
                Seus Links
              </h2>

            </div>

            {links.length === 0 ? (

  <div className="p-16 text-center text-gray-500">
    Nenhum link criado
  </div>

) : (

<DragDropContext
  onDragEnd={handleDragEnd}
>

<Droppable droppableId="links">

{(provided) => (

<div
  {...provided.droppableProps}
  ref={provided.innerRef}
>

{links.map((link, index) => (

<Draggable
  key={link.id}
  draggableId={link.id}
  index={index}
>

{(provided) => (

<div
  ref={provided.innerRef}
  {...provided.draggableProps}
  {...provided.dragHandleProps}
  className="
    flex
    items-center
    justify-between
    p-6
    border
    border-zinc-800
    rounded-3xl
    mb-4
    hover:bg-zinc-800/30
    hover:border-green-500/20
    transition-all
  "
>

{/* ESQUERDA */}
<div className="flex items-center gap-4">

{link.image_url ? (

<img
  src={link.image_url}
  className="
    w-24
    h-24
    object-cover
    rounded-3xl
  "
/>

) : (

<div
  className="
    w-24
    h-24
    rounded-3xl
    bg-zinc-800
    flex
    items-center
    justify-center
  "
>
📦
</div>

)}

<div>

<h3 className="font-semibold text-lg">
  {link.title}
</h3>

<p className="text-gray-400 text-sm">
  {link.clicks} cliques
</p>

</div>

</div>

{/* BOTÕES */}
<div className="flex items-center gap-3">

<button
  onClick={() =>
    navigator.clipboard.writeText(
      `${window.location.origin}/go/${link.slug}`
    )
  }
  className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm"
>
  Copiar
</button>

<button
  onClick={() =>
    handleOpenEdit(link)
  }
  className="bg-blue-500 hover:bg-blue-400 text-black px-4 py-2 rounded-xl text-sm font-semibold"
>
  Editar
</button>

<button
  onClick={() =>
    handleDelete(link.id)
  }
  className="bg-red-500 hover:bg-red-400 text-black px-4 py-2 rounded-xl text-sm font-semibold"
>
  Remover
</button>

</div>

</div>

)}

</Draggable>

))}

{provided.placeholder}

</div>

)}

</Droppable>

</DragDropContext>

)}
              
          </div>

        </div>

        {/* PREVIEW MOBILE */}
        <div className="hidden xl:block">
          <MobilePreview
            profile={profile}
            links={links}
          />
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl p-8">

              <h2 className="text-2xl font-bold mb-6">
                {editingProduct
                  ? "Editar Produto"
                  : "Novo Produto"}
              </h2>

              {/* TÍTULO */}
              <input
                placeholder="Título"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full bg-zinc-800 p-4 rounded-2xl mb-4"
              />

              {/* URL */}
              <input
                placeholder="URL afiliado"
                value={url}
                onChange={(e) =>
                  setUrl(e.target.value)
                }
                className="w-full bg-zinc-800 p-4 rounded-2xl mb-4"
              />

              {/* UPLOAD IMAGEM */}
              <div className="mb-4">

                <label className="text-sm text-zinc-400 mb-2 block">
                  Upload da imagem
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-zinc-800 p-4 rounded-2xl"
              />

                {imageUrl && (
                <img
                    src={imageUrl}
                    className="w-32 h-32 rounded-2xl object-cover mt-4"
               />
            )}

         </div>

              {/* PREVIEW */}
              {imageUrl && (
                <img
                  src={imageUrl}
                  className="w-full h-52 object-cover rounded-2xl mb-5"
                />
              )}

              {/* BOTÕES */}
              <div className="flex gap-3">

                <button
                  onClick={
                    editingLink
                      ? handleSaveEdit
                      : handleCreate
                  }
                  className="flex-1 bg-green-500 hover:bg-green-400 transition text-black py-3 rounded-2xl font-semibold"
                >
                  {editingLink
                    ? "Salvar"
                    : "Criar Link"}
                </button>

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex-1 bg-zinc-800 py-3 rounded-2xl"
                >
                  Cancelar
                </button>

              </div>

            </div>

          </div>
       )}

{/* MODAL PRODUTO */}
{showProductModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl p-8">

      <h2 className="text-2xl font-bold mb-6">
        Novo Produto
      </h2>

      {/* TÍTULO */}
      <input
        placeholder="Título"
        value={productTitle}
        onChange={(e) =>
          setProductTitle(
            e.target.value
          )
        }
        className="w-full bg-zinc-800 p-4 rounded-2xl mb-4"
      />

      {/* PREÇO */}
      <input
        placeholder="Preço"
        value={productPrice}
        onChange={(e) =>
          setProductPrice(
            e.target.value
          )
        }
        className="w-full bg-zinc-800 p-4 rounded-2xl mb-4"
      />

      {/* MARKETPLACE */}
      <input
        placeholder="Marketplace"
        value={productMarketplace}
        onChange={(e) =>
          setProductMarketplace(
            e.target.value
          )
        }
        className="w-full bg-zinc-800 p-4 rounded-2xl mb-4"
      />

      {/* LINK */}
      <input
        placeholder="Link afiliado"
        value={productAffiliateUrl}
        onChange={(e) =>
          setProductAffiliateUrl(
            e.target.value
          )
        }
        className="w-full bg-zinc-800 p-4 rounded-2xl mb-4"
      />

      {/* UPLOAD */}
      <input
        type="file"
        accept="image/*"
        onChange={
          handleProductImageUpload
        }
        className="w-full bg-zinc-800 p-4 rounded-2xl mb-4"
      />

      {/* PREVIEW */}
      {productImage && (
        <img
          src={productImage}
          className="w-full h-52 object-cover rounded-2xl mb-4"
        />
      )}

      {/* BOTÕES */}
      <div className="flex gap-3">

        <button
          onClick={() => {

            if (editingProduct) {
              handleSaveProduct(
                editingProduct.id
              );
            } else {
              handleCreateProduct();
            }

          }}
          className="flex-1 bg-green-500 hover:bg-green-400 transition text-black py-3 rounded-2xl font-semibold"
        >
          {editingProduct
            ? "Salvar Produto"
            : "Criar Produto"}
        </button>

        <button
          onClick={() =>
            setShowProductModal(
              false
            )
          }
          className="flex-1 bg-zinc-800 py-3 rounded-2xl"
        >
          Cancelar
        </button>

      </div>

    </div>

  </div>

        )}

      </div>

    </div>
  );
  }