"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4 text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Erro de Autenticação</h1>
            <p className="text-lg mb-8 text-gray-600 max-w-md">
                Houve um problema ao verificar seu código de login.
            </p>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 max-w-lg break-words">
                    <p className="font-bold text-sm uppercase mb-1">Detalhes do erro:</p>
                    <p className="font-mono text-sm">{decodeURIComponent(error)}</p>
                </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-8 max-w-md text-left space-y-2">
                <p className="font-bold">Dicas para resolver:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Abra o link no <strong>mesmo navegador</strong> e dispositivo que você usou para digitar o email.</li>
                    <li>Tente fazer login novamente (o link pode ter expirado).</li>
                    <li>Se estiver usando aba anônima, evite fechar o navegador antes de clicar no link.</li>
                </ul>
            </div>

            <Link href="/login" className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors">
                Tentar Login Novamente
            </Link>
        </div>
    );
}

export default function AuthCodeError() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ErrorContent />
        </Suspense>
    );
}
