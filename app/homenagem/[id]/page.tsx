import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import HomageDisplay from "./HomageDisplay"; // We will create this

export default async function HomenagemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

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

    const originalImage = homenagem.original_photo_url || homenagem.pets?.photo_url;
    const petName = homenagem.pets?.name || "Seu pet";
    const theme = homenagem.theme || "Padrão";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto w-full">
                <HomageDisplay
                    petName={petName}
                    originalImage={originalImage}
                    theme={theme}
                />
            </div>
        </div>
    );
}
