"use client";

import React from "react";
import { motion } from "framer-motion";

const EmotionalSection = () => {
    return (
        <section className="py-12 md:py-24 bg-secondary-50 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className="text-2xl md:text-5xl font-serif font-bold text-secondary-800 mb-6 md:mb-8">
                        Você não está sozinho(a)
                    </h2>
                    <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed font-light">
                        <p>
                            Sabemos que a despedida é um dos momentos mais difíceis da vida.
                            O silêncio em casa, a ausência daquele olhar puro e o toque macio fazem falta a cada segundo.
                        </p>
                        <p>
                            Mas acreditamos que o amor é uma energia que nunca morre.
                            Ele apenas se transforma. Seu anjinho continua existindo, agora livre de dor e velhice,
                            correndo feliz nos campos do arco-íris.
                        </p>
                        <p className="font-medium text-secondary-600 italic mt-8">
                            "Eles não partem. Eles se mudam para dentro do nosso coração."
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-secondary-300 blur-2xl" />
                <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-primary-300 blur-3xl" />
            </div>
        </section>
    );
};

export default EmotionalSection;
