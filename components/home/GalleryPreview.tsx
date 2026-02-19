"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

// Mock data for preview
const EXAMPLES = [
    {
        id: 1,
        theme: "Nas Nuvens",
        petName: "Thor",
        color: "bg-blue-100",
    },
    {
        id: 2,
        theme: "Jardim do Paraíso",
        petName: "Mel",
        color: "bg-green-100",
    },
    {
        id: 3,
        theme: "Céu Estrelado",
        petName: "Luna",
        color: "bg-indigo-100",
    },
    {
        id: 4,
        theme: "Com Anjos",
        petName: "Bob",
        color: "bg-yellow-100",
    },
];

const GalleryPreview = () => {
    return (
        <section id="exemplos" className="py-12 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-8 md:mb-16">
                    <span className="text-primary font-medium tracking-wider uppercase text-sm">
                        Galeria do Arco-Íris
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2 mb-4">
                        Transformações Reais
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Veja como transformamos fotos comuns em homenagens eternas e emocionantes usando nossa tecnologia.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {EXAMPLES.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-md transition-shadow hover:shadow-xl">
                                {/* Placeholder for actual image */}
                                <div className={`absolute inset-0 ${item.color} flex flex-col items-center justify-center p-6 text-center`}>
                                    <Star className="w-8 h-8 text-primary/50 mb-2" />
                                    <p className="text-gray-500 text-sm font-medium italic">
                                        [Imagem de {item.petName}]
                                        <br />
                                        Tema: {item.theme}
                                    </p>
                                </div>

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-serif font-bold text-xl text-gray-800">{item.petName}</h3>
                                <p className="text-sm text-primary-600">{item.theme}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-sm text-gray-500 italic">
                        * Imagens geradas 100% por Inteligência Artificial
                    </p>
                </div>
            </div>
        </section>
    );
};

export default GalleryPreview;
