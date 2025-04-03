"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

interface VideoPlayerProps {
  videoUrl: string
  coverUrl: string
  title: string
  isAdmin?: boolean
  isInactive?: boolean
}

export function VideoPlayer({ videoUrl, coverUrl, title, isAdmin = false, isInactive = false }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    if (isInactive && !isAdmin) return

    setIsPlaying(true)

    // Intentar abrir una ventana emergente primero
    const popupWindow = window.open(
      videoUrl,
      "VideoPlayer",
      "width=1280,height=720,resizable=yes,scrollbars=no,status=no",
    )

    // Si el navegador bloquea la ventana emergente, abrir en una nueva pestaña
    if (!popupWindow || popupWindow.closed || typeof popupWindow.closed === "undefined") {
      window.open(videoUrl, "_blank")
    }
  }

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg ${isInactive ? "opacity-60" : ""}`}>
      <div className="aspect-video relative">
        <Image
          src={coverUrl || "/placeholder.svg"}
          alt={title}
          fill
          className={`object-cover ${isInactive ? "grayscale" : ""}`}
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-end justify-end p-4">
            <button
              onClick={handlePlay}
              className={`bg-white bg-opacity-90 rounded-full p-3 shadow-lg transition-all transform ${
                isInactive && !isAdmin
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-opacity-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500"
              }`}
              aria-label="Reproducir video"
              disabled={isInactive && !isAdmin}
            >
              <Play className={`h-6 w-6 ${isInactive ? "text-gray-400" : "text-pink-500"}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

