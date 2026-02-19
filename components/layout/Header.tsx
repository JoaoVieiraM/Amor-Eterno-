"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import Button from "../ui/Button";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            router.refresh();
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, [supabase, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/login");
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-md py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-primary shadow-sm group-hover:scale-105 transition-transform">
                        <Image
                            src="/logo.jpg"
                            alt="Amor Eterno Pets Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-xl font-serif font-bold text-gray-800 tracking-tight">
                        Amor Eterno <span className="text-primary">Pets</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#inicio" className="text-gray-600 hover:text-primary font-medium transition-colors">
                        Início
                    </Link>
                    <Link href="#homenagens" className="text-gray-600 hover:text-primary font-medium transition-colors">
                        Homenagens
                    </Link>
                    <Link href="#depoimentos" className="text-gray-600 hover:text-primary font-medium transition-colors">
                        Depoimentos
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Olá, {user.email?.split('@')[0]}</span>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                Sair
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="outline" size="sm" leftIcon={<Heart className="w-4 h-4" />}>
                                Entrar
                            </Button>
                        </Link>
                    )}

                    <Button size="sm">
                        Criar Homenagem
                    </Button>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-full left-0 right-0 bg-white border-t p-4 shadow-lg flex flex-col gap-4"
                    >
                        <Link href="#inicio" className="text-gray-600 hover:text-primary font-medium p-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Início
                        </Link>
                        <Link href="#homenagens" className="text-gray-600 hover:text-primary font-medium p-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Homenagens
                        </Link>
                        <Link href="#depoimentos" className="text-gray-600 hover:text-primary font-medium p-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Depoimentos
                        </Link>
                        <div className="flex flex-col gap-2 mt-2">
                            {user ? (
                                <>
                                    <div className="text-center text-sm text-gray-600 p-2">
                                        Logado como {user.email}
                                    </div>
                                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                                        Sair
                                    </Button>
                                </>
                            ) : (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full" leftIcon={<Heart className="w-4 h-4" />}>
                                        Entrar
                                    </Button>
                                </Link>
                            )}
                            <Button className="w-full">
                                Criar Homenagem
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
