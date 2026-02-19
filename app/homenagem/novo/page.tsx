"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadForm from "@/components/homenagem/UploadForm";
import ThemeSelector, { THEMES } from "@/components/homenagem/ThemeSelector";
import Button from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";

export default function NovaHomenagem() {
    const router = useRouter();
    const supabase = createClient();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [petName, setPetName] = useState("");
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
    const [error, setError] = useState("");

    const handleNext = () => {
        if (step === 1) {
            if (!file || !petName.trim()) {
                setError("Por favor, adicione uma foto e o nome do seu pet.");
                return;
            }
            setError("");
            setStep(2);
        } else if (step === 2) {
            if (!selectedTheme) {
                setError("Por favor, escolha um tema.");
                return;
            }
            setError("");
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // If not logged in, maybe save state to localstorage and redirect?
                // For now, simpler: alert and redirect
                alert("Você precisa estar logado para criar uma homenagem.");
                router.push("/login?next=/homenagem/novo");
                return;
            }

            if (!file || !selectedTheme) throw new Error("Dados incompletos.");

            // 1. Upload photo
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('pets-photos')
                .upload(fileName, file);

            if (uploadError) throw new Error("Erro ao fazer upload da foto: " + uploadError.message);

            const photoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pets-photos/${fileName}`;

            // 2. Create Pet record
            const { data: petData, error: petError } = await supabase
                .from('pets')
                .insert({
                    user_id: user.id,
                    name: petName,
                    photo_url: photoUrl,
                })
                .select()
                .single();

            if (petError) throw new Error("Erro ao salvar dados do pet: " + petError.message);

            // 3. Create Homenagem record
            const { data: homenagemData, error: homenagemError } = await supabase
                .from('homenagens')
                .insert({
                    user_id: user.id, // Explicitly adding user_id as per schema
                    pet_id: petData.id,
                    theme: selectedTheme,
                    original_photo_url: photoUrl,
                    // generated_image_url will be null initially, updated by backend/worker later
                    // For now we simulate success and redirect
                })
                .select()
                .single();

            if (homenagemError) throw new Error("Erro ao criar homenagem: " + homenagemError.message);

            // Redirect to the homage page (which will likely show a "Generating..." state if we had a real backend process)
            // Since we don't have the image generation backend yet, we might want to mock it or show the "processing" state.
            router.push(`/homenagem/${homenagemData.id}`);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erro desconhecido ao criar homenagem.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto w-full space-y-8">
                {/* Progress Steps */}
                <nav aria-label="Progress">
                    <ol role="list" className="flex items-center justify-center space-x-8">
                        <li className={`relative ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
                            <div className="flex items-center gap-2">
                                <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step >= 1 ? "border-primary bg-primary text-white" : "border-gray-300"}`}>1</span>
                                <span className="font-medium">Pet</span>
                            </div>
                        </li>
                        <li className={`relative ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
                            <div className="flex items-center gap-2">
                                <span className={`bg-gray-200 h-0.5 w-12 block mx-2`}></span>
                                <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step >= 2 ? "border-primary bg-primary text-white" : "border-gray-300"}`}>2</span>
                                <span className="font-medium">Tema</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Qual é o nome do seu anjinho?
                                </label>
                                <input
                                    type="text"
                                    id="petName"
                                    value={petName}
                                    onChange={(e) => setPetName(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-lg p-3 border"
                                    placeholder="Ex: Paçoca"
                                />
                            </div>

                            <UploadForm
                                onFileSelect={setFile}
                                selectedFile={file}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <ThemeSelector
                                selectedThemeId={selectedTheme}
                                onSelectTheme={setSelectedTheme}
                            />
                        </div>
                    )}

                    <div className="mt-8 flex justify-between">
                        {step > 1 ? (
                            <Button variant="outline" onClick={handleBack} disabled={loading}>
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Voltar
                            </Button>
                        ) : (
                            <div /> /* Spacer */
                        )}

                        <Button size="lg" onClick={handleNext} isLoading={loading}>
                            {step === 2 ? "Gerar Homenagem" : "Próximo"}
                            {step !== 2 && <ChevronRight className="w-4 h-4 ml-2" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
