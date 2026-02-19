import React from "react";
import Link from "next/link";
import { Instagram, Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-12">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-primary fill-primary" />
                    </div>
                    <span className="font-serif font-bold text-gray-800">
                        Amor Eterno <span className="text-primary">Pets</span>
                    </span>
                </div>

                <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} Amor Eterno Pets. Feito com amor e saudade.
                </p>

                <div className="flex items-center gap-4">
                    <Link href="https://instagram.com/amoreternopets" target="_blank" className="text-gray-400 hover:text-pink-600 transition-colors">
                        <Instagram className="w-5 h-5" />
                        <span className="sr-only">Instagram</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
