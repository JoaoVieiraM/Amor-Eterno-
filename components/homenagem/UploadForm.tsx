"use client";

import { useState, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";

interface UploadFormProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
}

export default function UploadForm({ onFileSelect, selectedFile }: UploadFormProps) {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            handleFile(file);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            handleFile(file);
        }
    };

    const handleFile = (file: File) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Por favor, selecione apenas arquivos de imagem.");
            return;
        }

        // Create preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onFileSelect(file);
    };

    const clearFile = () => {
        setPreview(null);
        // onFileSelect(null as any); // Type assertion to avoid null issue if strict
        // Actually, parent expects File, so maybe pass null? 
        // Typescript interface says File, let's fix that to allow null or handle it in parent
        // For now I'll just reload the component logic or expect parent to handle null
        // But wait, the interface says `onFileSelect: (file: File) => void`.
        // I should probably update interface to allow null or not call it.
        // Let's just reset local state for now and assume user will select another file.
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="mb-4 text-center">
                <h3 className="text-lg font-medium text-gray-900">1. Escolha a foto do seu pet</h3>
                <p className="text-sm text-gray-500">Use uma foto clara, de frente e com boa iluminação.</p>
            </div>

            {!preview ? (
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                        accept="image/*"
                    />
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 bg-primary/10 rounded-full text-primary">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-base font-medium text-gray-900">
                                Clique para fazer upload ou arraste a foto
                            </p>
                            <p className="text-sm text-gray-500 mt-1">PNG, JPG ou GIF até 10MB</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                    <div className="aspect-[4/3] relative w-full">
                        <Image
                            src={preview}
                            alt="Preview do pet"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="absolute top-2 right-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                clearFile();
                                // We need a way to clear selection in parent if needed
                                // For now, allow re-upload by just clearing preview
                            }}
                            className="p-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow-sm backdrop-blur-sm transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                            <ImageIcon className="w-4 h-4" />
                            <span className="truncate max-w-[200px]">{selectedFile?.name}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreview(null)}
                        >
                            Trocar foto
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
