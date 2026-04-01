import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const txId = searchParams.get('txId');
    const t = searchParams.get('t');
    const hash = searchParams.get('hash');

    if (!txId || !t || !hash) {
        return new NextResponse('Link inválido ou quebrado. Parâmetros ausentes.', { status: 400 });
    }

    const secretKey = process.env.MARCHAPAY_SECRET_KEY || '';
    if (!secretKey) {
        return new NextResponse('Erro interno de configuração (Chave).', { status: 500 });
    }

    const generatedHash = crypto.createHmac('sha256', secretKey).update(`${txId}|${t}`).digest('hex');

    if (hash !== generatedHash) {
        return new NextResponse('Acesso não autorizado. A assinatura do link é inválida.', { status: 403 });
    }

    // Proteção de tempo (24 horas = 86400000 ms)
    if (Date.now() - parseInt(t) > 86400000) {
        return new NextResponse('Este link de download expirou (validade de 24h gerada no momento do pagamento). Entre em contato com o suporte caso precise de um novo link.', { status: 403 });
    }

    const filePath = path.join(process.cwd(), 'private', 'ebook.pdf');
    try {
        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="Ebook-Amor-Eterno-Guia.pdf"'
            }
        });
    } catch (error) {
        return new NextResponse('O arquivo do E-book não foi encontrado no servidor. Por favor, contate o administrador.', { status: 500 });
    }
}
