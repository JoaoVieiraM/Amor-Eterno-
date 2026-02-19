"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

// Mock data for preview
const EXAMPLES = [
    {
        id: 1,
        theme: "Nas Nuvens",
        petName: "Thor",
        color: "bg-blue-100",
        images: ["/examples/gallery-thor-1.jpg", "/examples/gallery-thor-2.jpg", "/examples/gallery-thor-3.jpg"]
    },
    {
        id: 2,
        theme: "Jardim do Paraíso",
        petName: "Mel",
        color: "bg-green-100",
        images: ["/examples/gallery-mel-1.jpg", "/examples/gallery-mel-2.jpg", "/examples/gallery-mel-3.jpg"]
    },
    {
        id: 3,
        theme: "Céu Estrelado",
        petName: "Luna",
        color: "bg-indigo-100",
        images: ["/examples/gallery-luna-1.jpg", "/examples/gallery-luna-2.jpg", "/examples/gallery-luna-3.jpg"]
    },
    {
        id: 4,
        theme: "Com Anjos",
        petName: "Bob",
        color: "bg-yellow-100",
        images: ["/examples/gallery-bob-1.jpg", "/examples/gallery-bob-2.jpg", "/examples/gallery-bob-3.jpg"]
    },
];

const GalleryCard = ({ item, index }: { item: typeof EXAMPLES[0], index: number }) => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
        }, 3000 + (index * 500)); // Stagger animations slightly

        return () => clearInterval(interval);
    }, [item.images.length, index]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
        >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-md transition-shadow hover:shadow-xl">
                <div className={`absolute inset-0 ${item.color} flex flex-col items-center justify-center text-center`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={item.images[currentImageIndex]}
                                alt={`Homenagem de ${item.petName}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Dots indicator */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {item.images.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? "bg-white scale-125" : "bg-white/50"}`}
                        />
                    ))}
                </div>
            </div>
            <div className="text-center">
                <h3 className="font-serif font-bold text-xl text-gray-800">{item.petName}</h3>
                <p className="text-sm text-primary-600">{item.theme}</p>
            </div>
        </motion.div>
    );
};

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
                        <GalleryCard key={item.id} item={item} index={index} />
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
