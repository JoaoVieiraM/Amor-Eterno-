import Hero from "@/components/home/Hero";
import EmotionalSection from "@/components/home/EmotionalSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import Testimonials from "@/components/home/Testimonials";
import CommunitySection from "@/components/home/CommunitySection";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

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

      <div id="homenagens">
        <GalleryPreview />
      </div>

      <div id="depoimentos">
        <Testimonials />
      </div>

      {/* CTA Final Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Eternize seu anjinho hoje
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Pacote com 3 imagens exclusivas por apenas R$24,90. Entre em contato pelo WhatsApp e receba a homenagem do seu pet.
          </p>
          <a href="https://wa.me/5511942606739?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20homenagem%20ao%20meu%20pet." target="_blank" rel="noopener noreferrer">
            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Pedir via WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
