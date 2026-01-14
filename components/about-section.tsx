import { Card } from "@/components/ui/card"
import { Mail, Phone } from "lucide-react"
import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20">
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-2/5 h-80 md:h-auto">
            <Image src="/photo.jpeg" alt="Corretor de Imóveis" fill className="object-cover" />
          </div>

          <div className="flex-1 p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Sobre Mim</h2>

            <div className="space-y-4 leading-relaxed">
              <p>
                Olá! Sou corretora de imóveis há mais de 2 anos representando o grupo Kallas, com uma paixão genuína por conectar pessoas aos seus
                lares ideais. Minha missão é transformar o sonho da casa própria em realidade, oferecendo um atendimento
                personalizado e transparente.
              </p>

              <p>
                Com vasta experiência no mercado imobiliário de São Paulo e região, especializo-me em imóveis
                residenciais e para investimentos, popular (MCMV), médio e alto padrão. Cada cliente é único, e por isso dedico tempo para entender suas
                necessidades específicas e encontrar seu imóvel perfeito.
              </p>

              <p>
                Acredito que comprar ou vender um imóvel é uma das decisões mais importantes da vida, e estou aqui para
                guiá-lo em cada etapa desse processo com profissionalismo, ética e comprometimento.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-foreground">
                <Phone className="h-5 w-5 text-primary" />
                <span className="font-medium">(11) 99809-1991</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Mail className="h-5 w-5 text-primary" />
                <span className="font-medium">lairmklein@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
