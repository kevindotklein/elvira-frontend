"use client"

import { Building2 } from "lucide-react"

export function Header() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Corretora Elvira</span>
          </div>

          <nav>
            <button
              onClick={scrollToAbout}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Sobre Mim
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
