"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Button from "../ui/Button";

const CommunitySection = () => {
    return (
        <section className="py-12 md:py-20 bg-green-50/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-green-100 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden">
                    {/* Content */}
                    <div className="relative z-10 max-w-xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                            <MessageCircle className="w-3 h-3" />
                            Comunidade Acolhedora
                        </div>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
                            Você não precisa passar por isso sozinho(a)
                        </h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            Entre no nosso grupo de apoio no WhatsApp. Um espaço seguro para compartilhar memórias, receber carinho e conversar com outros tutores que entendem sua dor.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Button
                                size="lg"
                                className="bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-green-200"
                                leftIcon={<MessageCircle className="w-5 h-5" />}
                                onClick={() => window.open('whatsapp://chat?code=CCLp7uWVS439jbwiPjdO2B', '_blank')}
                            >
                                Entrar no Grupo de Apoio
                            </Button>
                        </div>
                    </div>

                    {/* Visuals */}
                    <div className="relative z-10 w-full max-w-sm">
                        <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl flex items-center justify-center p-8 relative group">

                            {/* Mock Chat Interface */}
                            <div className="w-full bg-white rounded-xl shadow-lg p-4 space-y-3 transform transition-transform group-hover:-translate-y-2 duration-500">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs">M</div>
                                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 text-sm text-gray-600 flex-1">
                                        O Thor faz muita falta... 😢
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs">R</div>
                                    <div className="bg-green-100 rounded-2xl rounded-tr-none p-3 text-sm text-gray-800 flex-1">
                                        Força! Ele sabe o quanto foi amado. ❤️
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-xs">A</div>
                                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 text-sm text-gray-600 flex-1">
                                        Obrigada pelo apoio, gente.
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-4 -right-4 bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                +500 membros
                            </div>
                        </div>
                    </div>

                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
                </div>
            </div>
        </section>
    );
};

export default CommunitySection;
