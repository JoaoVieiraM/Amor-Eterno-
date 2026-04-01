import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const txId = searchParams.get('txId');

    if (!txId) {
      return NextResponse.json({ error: 'txId é obrigatório' }, { status: 400 });
    }

    const publicKey = process.env.NEXT_PUBLIC_MARCHAPAY_KEY;
    const secretKey = process.env.MARCHAPAY_SECRET_KEY;

    if (!publicKey || !secretKey) {
      return NextResponse.json({ error: 'Chaves não configuradas' }, { status: 500 });
    }

    const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

    const response = await fetch(`https://api.marchabb.com/v1/transactions/${txId}`, {
      method: 'GET',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json({ error: 'Erro ao buscar status' }, { status: response.status });
    }

    let downloadToken = null;
    let tParams = null;
    if (data.status === 'paid') {
      const timestamp = Date.now().toString();
      const hash = crypto.createHmac('sha256', secretKey)
                         .update(`${txId}|${timestamp}`)
                         .digest('hex');
      downloadToken = hash;
      tParams = timestamp;
    }

    // Retorna o status encontrado (geralmente data.status ou similar)
    return NextResponse.json({ 
      success: true, 
      transaction: data,
      downloadUrl: downloadToken ? `/api/download?txId=${txId}&t=${tParams}&hash=${downloadToken}` : null
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
