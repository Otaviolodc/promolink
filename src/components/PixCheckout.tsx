"use client"

import { useState } from "react"

export default function PixCheckout() {

  const [loading, setLoading] = useState(false)

  const [pixCode, setPixCode] = useState("")

  const [qrCode, setQrCode] = useState("")

  async function handleCheckout() {

    try {

      setLoading(true)

      const response = await fetch("/api/asaas/create-payment", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: "Luis",
          email: "teste@gmail.com",
          cpfCnpj: "12345678909",
          value: 19.90,
          userId: "123",
        }),
      })

      const data = await response.json()

      console.log(data)

      if (data.encodedImage) {

        setQrCode(
          `data:image/png;base64,${data.encodedImage}`
        )

      }

      if (data.payload) {

        setPixCode(data.payload)

      }

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }

  }

  async function copyPix() {

    await navigator.clipboard.writeText(pixCode)

    alert("PIX copiado!")

  }

  return (

    <div className="flex flex-col items-center gap-4">

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="border px-4 py-2 rounded"
      >
        {loading ? "Gerando..." : "Assinar PRO"}
      </button>

      {qrCode && (

        <>
          <img
            src={qrCode}
            alt="QR Code PIX"
            className="w-64 h-64 bg-white p-2 rounded"
          />

          <textarea
            value={pixCode}
            readOnly
            className="w-64 h-20 text-black p-2"
          />

          <button
            onClick={copyPix}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Copiar PIX
          </button>
        </>

      )}

    </div>

  )

}