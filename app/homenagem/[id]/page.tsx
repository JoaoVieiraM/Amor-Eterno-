import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Download, Share2 } from "lucide-react";

// For now, since we don't have the AI generation running, this page will
// likely show the original photo or a placeholder if 'generated_image_url' is null.

export default async function HomenagemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch Homenagem + Pet details
    const { data: homenagem, error } = await supabase
        .from("homenagens")
        .select(`
      *,
      pets (
        name,
        photo_url
      )
    `)
        .eq("id", id)
        .single();

    if (error || !homenagem) {
        console.error("Error fetching homage:", error);
        return notFound();
    }

    const generatedImage = homenagem.generated_image_url;
    const originalImage = homenagem.original_photo_url || homenagem.pets?.photo_url;
    const petName = homenagem.pets?.name || "Seu pet";

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12 px-4">
            <div className="max-w-4xl w-full text-center space-y-8">

                <div className="space-y-2">
                    <h1 className="text-3xl md:text-5xl font-script text-amber-100">
                        {petName} está em paz agora.
                    </h1>
                    <p className="text-gray-300">
                        Uma homenagem eterna para quem sempre te amou.
                    </p>
                </div>

                <div className="relative aspect-square w-full max-w-xl mx-auto rounded-lg overflow-hidden border-4 border-amber-900/30 shadow-2xl bg-black">
                    {generatedImage ? (
                        <Image
                            src={generatedImage}
                            alt={`Homenagem de ${petName}`}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-gray-400 p-8 text-center space-y-4">
                            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            <div>
                                <p className="text-lg font-medium text-white">Criando sua homenagem...</p>
                                <p className="text-sm">Isso geralmente leva cerca de 30-60 segundos.</p>
                                <p className="text-xs mt-4 opacity-50 text-wrap break-all">Original: {originalImage}</p>
                            </div>
                            {/* 
                     Real Implementation Note:
                     Here we would implement polling or a realtime subscription 
                     to listen for when 'generated_image_url' is updated.
                   */}
                        </div>
                    )}
                </div>

                {generatedImage && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white border-none">
                            <Download className="w-4 h-4 mr-2" />
                            Baixar Imagem
                        </Button>
                        <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                            <Share2 className="w-4 h-4 mr-2" />
                            Compartilhar
                        </Button>
                    </div>
                )}

                <div className="pt-8 border-t border-gray-800">
                    <Link href="/homenagem/novo" className="text-amber-400 hover:text-amber-300 underline underline-offset-4">
                        Criar outra homenagem
                    </Link>
                </div>
            </div>
        </div>
    );
}
