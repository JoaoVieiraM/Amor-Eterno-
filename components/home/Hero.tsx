"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Heart, MessageCircle } from "lucide-react";
import Button from "../ui/Button";

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-20">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

            </div>

            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center md:text-left"
                >
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-6">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-primary" />
                        <span>O amor não acaba, ele muda de forma</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-tight mb-6">
                        Eternize seu anjinho e encontre <span className="text-primary italic">apoio real</span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                        Crie homenagens celestiais com Inteligência Artificial e faça parte de uma comunidade que acolhe sua saudade.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start w-full sm:w-auto">
                        <Link href="/homenagem/novo" className="w-full sm:w-auto">
                            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />} className="w-full sm:w-auto">
                                Criar Homenagem
                            </Button>
                        </Link>
                        <Button
                            variant="secondary"
                            size="lg"
                            leftIcon={<MessageCircle className="w-5 h-5" />}
                            className="bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-green-200 w-full sm:w-auto"
                            onClick={() => window.open('https://chat.whatsapp.com/LTVtkhsBKqM8llLmmii2Yj', '_blank')}
                        >
                            Comunidade WhatsApp
                        </Button>
                    </div>

                    <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs overflow-hidden">
                                    {/* Placeholder avatars until we have real ones */}
                                    <span className="opacity-50">👤</span>
                                </div>
                            ))}
                        </div>
                        <p>+2.000 homenagens e membros</p>
                    </div>
                </motion.div>

                {/* Visual Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative w-full max-w-[350px] md:max-w-full mx-auto"
                >
                    <div className="relative aspect-square max-w-[500px] mx-auto">
                        {/* Decorative Elements */}
                        <div className="absolute -inset-4 border border-primary/30 rounded-full animate-spin-slow opacity-50" style={{ animationDuration: '20s' }} />
                        <div className="absolute -inset-8 border border-accent/30 rounded-full animate-spin-reverse-slow opacity-40" style={{ animationDuration: '25s' }} />

                        {/* Main Image Container */}
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            {/* 
                  TODO: Replace with a high-quality generated example image. 
                  For now using a placeholder color block that implies an image 
                */}
                            <div className="absolute inset-0 bg-gray-100">
                                <Image
                                    src="/examples/hero-dog-heaven.jpg"
                                    alt="Homenagem Exemplo"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Floating Cards - Hidden on very small screens, adjusted for mobile */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="hidden xs:flex absolute -bottom-6 -left-2 sm:-left-6 bg-white p-3 sm:p-4 rounded-xl shadow-lg items-center gap-3 max-w-[180px] sm:max-w-[200px]"
                        >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500">Resultado</p>
                                <p className="font-bold text-sm sm:text-base text-gray-800">Emocionante</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                            className="hidden xs:flex absolute top-10 -right-2 sm:-right-6 bg-white p-3 sm:p-4 rounded-xl shadow-lg items-center gap-3 max-w-[180px] sm:max-w-[200px]"
                        >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-green-600" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500">Comunidade</p>
                                <p className="font-bold text-sm sm:text-base text-gray-800">Acolhedora</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
