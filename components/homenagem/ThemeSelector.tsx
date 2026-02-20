"use client";

import { Check } from "lucide-react";


// Theme definitions based on specifications
export const THEMES = [
    {
        id: "nas-nuvens",
        title: "Nas Nuvens",
        description: "Paz celestial sobre nuvens fofinhas e arco-íris.",
        previewUrl: "/themes/nas-nuvens-preview.jpg", // Placeholder, will use colors/icons if image missing
        color: "from-blue-100 to-white",
    },
    {
        id: "com-anjos",
        title: "Com Anjos",
        description: "Cercado por anjos guardiões em um jardim divino.",
        previewUrl: "/themes/com-anjos-preview.jpg",
        color: "from-yellow-50 to-white",
    },
    {
        id: "com-jesus",
        title: "Com Jesus",
        description: "Ao lado de Jesus em um campo iluminado de paz.",
        previewUrl: "/themes/com-jesus-preview.jpg",
        color: "from-amber-50 to-white",
    },
    {
        id: "ceu-estrelado",
        title: "Céu Estrelado",
        description: "Brilhando entre estrelas em um paraíso cósmico.",
        previewUrl: "/themes/ceu-estrelado-preview.jpg",
        color: "from-indigo-50 to-white",
    },
    {
        id: "jardim-paraiso",
        title: "Jardim do Paraíso",
        description: "Natureza exuberante, flores e luz dourada eterna.",
        previewUrl: "/themes/jardim-paraiso-preview.jpg",
        color: "from-green-50 to-emerald-50",
    },
];

interface ThemeSelectorProps {
    selectedThemeId: string | null;
    onSelectTheme: (themeId: string) => void;
}

export default function ThemeSelector({ selectedThemeId, onSelectTheme }: ThemeSelectorProps) {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="mb-6 text-center">
                <h3 className="text-lg font-medium text-gray-900">2. Escolha o tema da homenagem</h3>
                <p className="text-sm text-gray-500">Como você imagina seu anjinho agora?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {THEMES.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;

                    return (
                        <button
                            key={theme.id}
                            onClick={() => onSelectTheme(theme.id)}
                            className={`relative group text-left rounded-xl overflow-hidden border-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isSelected
                                ? "border-primary ring-2 ring-primary/20 scale-[1.02] shadow-lg"
                                : "border-gray-200 hover:border-primary/50 hover:shadow-md"
                                }`}
                        >
                            <div className={`h-32 w-full bg-gradient-to-br ${theme.color} p-4 flex flex-col justify-end relative`}>
                                {/* Provide visual fallback if no image */}
                                <div className="absolute inset-0 opacity-10 bg-pattern-dots" />
                                <div className="relative z-10 text-gray-900">
                                    <h4 className="font-serif font-bold text-lg leading-tight">{theme.title}</h4>
                                </div>
                            </div>

                            <div className="p-4 bg-white">
                                <p className="text-sm text-gray-600 line-clamp-2">{theme.description}</p>
                            </div>

                            {isSelected && (
                                <div className="absolute top-3 right-3 bg-primary text-white p-1 rounded-full shadow-sm animate-in zoom-in duration-200">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
