"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

interface VideoPlayerAltProps {
  videoUrl: string
  coverUrl: string
  title: string
  isAdmin?: boolean
}

export function VideoPlayerAlt({ videoUrl, coverUrl, title, isAdmin = false }: VideoPlayerAltProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const handlePlay = () => {
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
    <div
      className="relative rounded-lg overflow-hidden shadow-lg group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="aspect-video relative">
        <Image src={coverUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />

        {/* Overlay con gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {!isPlaying && (
          <div className="absolute bottom-4 right-4 transition-all duration-300 transform scale-90 group-hover:scale-100">
            <button
              onClick={handlePlay}
              className="bg-white rounded-full p-3 shadow-lg hover:bg-pink-50 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Reproducir video"
            >
              <Play className="h-6 w-6 text-pink-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

