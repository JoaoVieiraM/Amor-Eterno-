import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, email, cpf, name, amount, quizResult, paymentMethod = 'credit_card' } = body;

    const publicKey = process.env.NEXT_PUBLIC_MARCHAPAY_KEY;
    const secretKey = process.env.MARCHAPAY_SECRET_KEY;

    if (!publicKey || !secretKey) {
      return NextResponse.json({ error: 'Chaves da API não configuradas' }, { status: 500 });
    }

    const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

    const customerName = name || email.split('@')[0];
    
    // O Marcha obriga o objeto 'document' e 'items' estritos.
    const payload: any = {
      amount,
      paymentMethod,
      customer: {
        name: customerName,
        email,
        document: {
          type: 'cpf',
          number: cpf.replace(/\D/g, '')
        }
      },
      items: [
        {
          title: 'Ebook Amor Eterno',
          unitPrice: amount,
          quantity: 1,
          tangible: false
        }
      ],
      metadata: "ecommerce-ebook"
    };

    if (paymentMethod === 'credit_card') {
      payload.cardToken = token;
    }

    const response = await fetch('https://api.marchabb.com/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Erro na API da Marcha:', data);
      return NextResponse.json({ error: data.message || 'Falha no pagamento' }, { status: response.status });
    }

    let downloadToken = null;
    let tParams = null;
    if (data.status === 'paid') {
      const timestamp = Date.now().toString();
      const hash = crypto.createHmac('sha256', secretKey)
                         .update(`${data.id}|${timestamp}`)
                         .digest('hex');
      downloadToken = hash;
      tParams = timestamp;
    }

    return NextResponse.json({ 
      success: true, 
      transaction: data,
      downloadUrl: downloadToken ? `/api/download?txId=${data.id}&t=${tParams}&hash=${downloadToken}` : null
    });
  } catch (error) {
    console.error('Erro interno na rota de checkout:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
