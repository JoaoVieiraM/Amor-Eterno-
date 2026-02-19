"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
    {
        id: 1,
        text: "Quando vi a foto do Thor correndo nas nuvens, não consegui segurar o choro. Trouxe uma paz que eu não sentia há meses.",
        author: "Ana Clara",
        role: "Tutora do Thor",
    },
    {
        id: 2,
        text: "É mais que uma imagem, é um abraço na alma. Saber que a Mel está 'bem' no céu me conforta todos os dias.",
        author: "Roberto Silva",
        role: "Tutor da Mel",
    },
    {
        id: 3,
        text: "Obrigada por eternizarem minha Luna com tanta delicadeza. Imprimi e coloquei num quadro na sala.",
        author: "Juliana Costa",
        role: "Tutora da Luna",
    },
];

const Testimonials = () => {
    return (
        <section id="depoimentos" className="py-12 md:py-24 bg-primary-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-8 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                        Histórias de Amor
                    </h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t, index) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-primary/10 relative"
                        >
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
                            <p className="text-gray-600 italic mb-6 leading-relaxed">"{t.text}"</p>
                            <div>
                                <p className="font-bold text-gray-900">{t.author}</p>
                                <p className="text-xs text-primary-600 uppercase tracking-wide">{t.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
