"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Download, Share2, Loader2 } from "lucide-react";

interface HomageDisplayProps {
    petName: string;
    originalImage: string;
    theme: string;
}

export default function HomageDisplay({ petName, originalImage, theme }: HomageDisplayProps) {
    const [isGenerating, setIsGenerating] = useState(true);

    useEffect(() => {
        // Simulate a generation delay since we don't have the AI backend connected.
        const timer = setTimeout(() => {
            setIsGenerating(false);
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-2">
                        Preparando sua homenagem...
                    </h2>
                    <p className="text-gray-600">
                        Compondo com carinho para o tema &quot;{theme}&quot;
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="text-center space-y-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
                    {petName} está em paz.
                </h1>
                <p className="text-lg text-gray-600">
                    Uma lembrança eterna, preenchida de amor.
                </p>
            </div>

            {/* Themed Frame for the original image */}
            <div className="relative w-full max-w-lg mx-auto aspect-square rounded-2xl shadow-2xl border-[12px] border-white overflow-hidden bg-white group">
                {/* Subtle outer glow matching the theme */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none z-10" />
                <Image
                    src={originalImage}
                    alt={`Homenagem de ${petName}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="w-full sm:w-auto shadow-md">
                    <Download className="w-5 h-5 mr-2" />
                    Baixar Homenagem
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm">
                    <Share2 className="w-5 h-5 mr-2" />
                    Compartilhar
                </Button>
            </div>

            <div className="pt-8 border-t border-gray-200">
                <Link
                    href="/homenagem/novo"
                    className="text-primary hover:text-primary-700 font-medium transition-colors"
                >
                    Criar outra homenagem
                </Link>
            </div>
        </div>
    );
}
