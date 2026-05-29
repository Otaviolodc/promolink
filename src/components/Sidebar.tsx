"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {

  const pathname = usePathname();

  const menu = [
    {
      name: "Links",
      href: "/dashboard/links",
    },
    {
      name: "Perfil",
      href: "/dashboard/profile",
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
    },
    {
      name: "Loja",
      href: "/dashboard/store",
    },
    {
      name: "Upgrade PRO",
      href: "/pricing",
    },
  ];

  return (

    <aside className="
      w-[230px]
      bg-zinc-950
      border-r
      border-zinc-900
      min-h-screen
      p-5
    ">

      <div className="mb-10">

        <h1 className="
          text-3xl
          font-black
          text-green-400
        ">
          PromoLink
        </h1>

        <p className="text-zinc-500 text-sm mt-1">
          Dashboard
        </p>

      </div>

      <nav className="flex flex-col gap-3">

        {menu.map((item) => (

          <Link
            key={item.href}
            href={item.href}
            className={`
              px-4
              py-3
              rounded-2xl
              transition
              font-medium
              ${
                pathname === item.href
                  ? "bg-green-500 text-black"
                  : "bg-zinc-900 hover:bg-zinc-800 text-white"
              }
            `}
          >
            {item.name}
          </Link>

        ))}

      </nav>

    </aside>

  );

}