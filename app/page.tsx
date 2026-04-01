import Hero from "@/components/home/Hero";
import EmotionalSection from "@/components/home/EmotionalSection";
import CommunitySection from "@/components/home/CommunitySection";
import Button from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <div id="inicio">
        <Hero />
      </div>

      <EmotionalSection />

      <div id="comunidade">
        <CommunitySection />
      </div>

      {/* CTA Final Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Você não está sozinho(a)
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            A dor da perda de um pet que tanto amamos pode ser esmagadora, mas a dor compartilhada pesa menos. Junte-se gratuitamente à nossa comunidade no WhatsApp.
          </p>
          <a href="https://chat.whatsapp.com/J6lEhbz9Mt53Ur1k34Ega6" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-green-200" leftIcon={<MessageCircle className="w-5 h-5" />}>
              Entrar no Grupo de Apoio
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
