import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, quiz_result, answers } = body;

        if (!email || !quiz_result) {
            return NextResponse.json(
                { error: 'Email e resultado do quiz são obrigatórios' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('quiz_responses')
            .insert([
                {
                    email: email,
                    resultado: quiz_result,
                    respostas: answers
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Erro ao salvar no supabase:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data }, { status: 201 });

    } catch (error) {
        console.error('Erro na rota POST:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
