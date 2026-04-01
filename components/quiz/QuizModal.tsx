"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import quizData from '@/data/quiz_luto_pet.json';
import Button from '../ui/Button';

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ResultCategory = 'high_need' | 'moderate_need' | 'stable';

const answerToCategoryMap: Record<string, ResultCategory> = {
    'recent_1': 'high_need',
    'recent_2': 'high_need',
    'moderate': 'moderate_need',
    'long_term': 'stable',
    'all': 'high_need',
    'routine': 'moderate_need',
    'triggers': 'moderate_need',
    'insomnia': 'moderate_need',
    'severe': 'high_need',
    'escape': 'high_need',
    'interrupted': 'moderate_need',
    'good': 'stable',
    'misunderstood': 'high_need',
    'isolated': 'high_need',
    'partial': 'moderate_need',
    'understood': 'stable',
    'frequent': 'high_need',
    'occasional': 'moderate_need',
    'rare': 'stable',
    'none': 'stable',
    'everything': 'high_need',
    'comfort': 'moderate_need',
    'presence': 'moderate_need',
    'alone': 'high_need',
    'lost': 'high_need',
    'supported': 'stable'
};

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resultCategory, setResultCategory] = useState<ResultCategory | null>(null);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
    const [pixData, setPixData] = useState<{ qrcode: string, qr_code_text: string, txId: string } | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [cardData, setCardData] = useState({ number: '', holderName: '', expMonth: '', expYear: '', cvv: '', cpf: '' });

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (pixData && !paymentSuccess) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/checkout/status?txId=${pixData.txId}`);
                    const data = await res.json();
                    if (data.success && data.transaction?.status === 'paid') {
                        setPaymentSuccess(true);
                        setDownloadUrl(data.downloadUrl || null);
                        setPixData(null);
                    }
                } catch(e) {}
            }, 4000);
        }
        return () => clearInterval(interval);
    }, [pixData, paymentSuccess]);

    const getPainPoint = (userAnswers: string[]) => {
        if (userAnswers.includes('routine')) return 'lidar com a quebra repentina da sua rotina diária';
        if (userAnswers.includes('insomnia') || userAnswers.includes('severe')) return 'lidar com as crises noturnas e a falta de sono';
        if (userAnswers.includes('triggers') || userAnswers.includes('frequent')) return 'conviver com gatilhos e lembranças inesperadas';
        if (userAnswers.includes('alone') || userAnswers.includes('isolated')) return 'processar essa dor sozinho e sem o colo adequado';
        return 'processar o enorme vazio deixado pela ausência física';
    };

    // Reset state when opened/closed if needed, or keep it to resume
    // For now, let's reset it if they close and reopen it from start
    const handleClose = () => {
        // Optional: Reset state
        // setStep(0); setAnswers([]); setResultCategory(null);
        onClose();
    };

    const handleAnswer = (value: string) => {
        const newAnswers = [...answers];
        newAnswers[step] = value;
        setAnswers(newAnswers);
        
        // Auto advance
        setTimeout(() => {
            setStep(step + 1);
        }, 300);
    };

    const calculateResult = (finalAnswers: string[]): ResultCategory => {
        const scores = { high_need: 0, moderate_need: 0, stable: 0 };
        finalAnswers.forEach(ans => {
            const cat = answerToCategoryMap[ans] || 'moderate_need';
            scores[cat]++;
        });
        
        // Find max
        let maxCat: ResultCategory = 'high_need';
        let maxScore = -1;
        (Object.keys(scores) as ResultCategory[]).forEach(cat => {
            if (scores[cat] > maxScore) {
                maxScore = scores[cat];
                maxCat = cat;
            }
        });
        return maxCat;
    };

    const handleSubmitEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        const result = calculateResult(answers);
        setResultCategory(result);

        // Save to Supabase via our API endpoint
        try {
            await fetch('/api/salvar-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    quiz_result: result,
                    answers
                })
            });
        } catch (error) {
            console.error('Failed to save quiz response', error);
        }

        setIsSubmitting(false);
        setStep(step + 1); // Move to results step
    };

    const handleCheckout = () => {
        setShowCheckoutForm(true);
    };

    const handleProcessPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessingPayment(true);
        
        try {
            if (selectedPaymentMethod === 'pix') {
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentMethod: 'pix',
                        email,
                        cpf: cardData.cpf.replace(/\D/g, ''),
                        amount: 2490,
                        quizResult: resultCategory
                    })
                });
                
                const data = await response.json();
                if (!response.ok) throw new Error("Falha no pagamento PIX");
                
                const tx = data.transaction || {};
                // No Marchabb, a string do Copia e Cola vem diretamente dentro de pix.qrcode
                const pixStr = tx.pix?.qrcode || tx.qrcode || '';
                const txId = tx.id || tx.transactionId || '';
                
                setPixData({ qrcode: pixStr, qr_code_text: pixStr, txId });
                setIsProcessingPayment(false);
                return;
            }

            // Cartão de Crédito Flow
            // @ts-ignore
            if (typeof window === 'undefined' || !window.Marchabb) {
                throw new Error("Sistema de pagamento não carregado.");
            }
            
            // @ts-ignore
            await window.Marchabb.setPublicKey(process.env.NEXT_PUBLIC_MARCHAPAY_KEY || '');
            
            const card = {
                number: cardData.number.replace(/\D/g, ''),
                holderName: cardData.holderName,
                expMonth: parseInt(cardData.expMonth, 10),
                expYear: parseInt(cardData.expYear, 10),
                cvv: cardData.cvv
            };
            
            // @ts-ignore
            const token = await window.Marchabb.encrypt(card);
            
            // Chamar backend para processar
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentMethod: 'credit_card',
                    token,
                    email,
                    cpf: cardData.cpf.replace(/\D/g, ''),
                    amount: 2490,
                    quizResult: resultCategory
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error("Falha no pagamento");
            }
            
            setDownloadUrl(data.downloadUrl || null);
            setPaymentSuccess(true);
        } catch (error) {
            console.error('Payment Error:', error);
            alert('Houve um erro ao processar seu pagamento. Verifique os dados e tente novamente.');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    if (!isOpen) return null;

    const totalQuestions = quizData.questions.length;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={handleClose}
            >
                <motion.div 
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                >
                    <button 
                        onClick={handleClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="p-6 sm:p-8">
                        {/* Questions Phase */}
                        {step < totalQuestions && (
                            <div className="min-h-[300px] flex flex-col">
                                <div className="mb-8">
                                    <div className="flex justify-between text-sm text-[#D4AF37] font-semibold mb-2">
                                        <span>Pergunta {step + 1} de {totalQuestions}</span>
                                        <span>{Math.round(((step) / totalQuestions) * 100)}% concluído</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="h-full bg-[#D4AF37]"
                                            initial={{ width: `${((step)/totalQuestions)*100}%` }}
                                            animate={{ width: `${((step + 1)/totalQuestions)*100}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-1 flex flex-col"
                                    >
                                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
                                            {quizData.questions[step].question}
                                        </h2>
                                        <p className="text-sm font-medium text-[#D4AF37] mb-6 flex items-start gap-2">
                                            <span>💡</span> {quizData.questions[step].stat}
                                        </p>

                                        <div className="flex flex-col gap-3 mt-auto">
                                            {quizData.questions[step].options.map((opt, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleAnswer(opt.value)}
                                                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group
                                                        ${answers[step] === opt.value 
                                                            ? 'border-[#D4AF37] bg-yellow-50 text-gray-900 shadow-sm' 
                                                            : 'border-gray-100 text-gray-600 hover:border-[#D4AF37] hover:bg-[#F5E6D3]/30 hover:shadow-sm'
                                                        }`}
                                                >
                                                    <span className="font-medium">{opt.text}</span>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                        ${answers[step] === opt.value ? 'border-[#D4AF37]' : 'border-gray-300 group-hover:border-[#D4AF37]'}
                                                    `}>
                                                        {answers[step] === opt.value && <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Email Capture Phase */}
                        {step === totalQuestions && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-8 text-center"
                            >
                                <div className="w-16 h-16 bg-[#F5E6D3] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-4">
                                    Receba sua análise gratuita
                                </h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Para vermos os resultados que preparamos com carinho para o seu momento, precisamos apenas do seu melhor e-mail.
                                </p>
                                
                                <form onSubmit={handleSubmitEmail} className="max-w-md mx-auto relative">
                                    <div className="relative flex items-center">
                                        <Mail className="w-5 h-5 text-gray-400 absolute left-4" />
                                        <input 
                                            type="email" 
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Seu melhor e-mail"
                                            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#D4AF37] focus:ring-0 outline-none text-gray-800 transition-all font-medium bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <Button 
                                        type="submit"
                                        disabled={isSubmitting || !email}
                                        className="w-full mt-4 bg-[#D4AF37] hover:bg-[#c9a02a] text-white border-none shadow-lg shadow-yellow-100/50 py-4 text-lg"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2 justify-center"><Loader2 className="w-5 h-5 animate-spin" /> Processando...</span>
                                        ) : (
                                            <span className="flex items-center gap-2 justify-center">Ver Meu Resultado <ChevronRight className="w-5 h-5" /></span>
                                        )}
                                    </Button>
                                    <p className="text-xs text-gray-400 mt-4">Prometemos não enviar spam. Seus dados estão seguros conosco.</p>
                                </form>
                            </motion.div>
                        )}

                        {/* Result & Ebook Pitch Phase */}
                        {step > totalQuestions && resultCategory && !showCheckoutForm && !paymentSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-4"
                            >
                                {/* Results Section with Dynamic Diagnosis */}
                                <div className="text-center mb-10 p-6 bg-[#F5E6D3]/50 rounded-2xl">
                                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37] mb-4">
                                        {quizData.results[resultCategory].title}
                                    </h2>
                                    
                                    <div className="bg-white/70 p-5 rounded-xl border border-[#D4AF37]/20 mb-5 text-left shadow-sm">
                                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                            <span className="text-[#D4AF37]">📋</span> Diagnóstico do seu Perfil
                                        </h4>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Identificamos que você está processando um <strong className="text-[#D4AF37]">{resultCategory === 'high_need' ? 'Luto Agudo' : resultCategory === 'moderate_need' ? 'Luto de Transição' : 'Luto de Integração'}</strong>. 
                                            Através de suas respostas de hoje, notamos que a sua maior dificuldade no momento tem sido <strong className="text-[#D4AF37]">{getPainPoint(answers)}</strong>.
                                            Isso é uma prova da profunda conexão real de amor que vocês construíram juntos. 
                                        </p>
                                    </div>
                                    
                                    <p className="text-gray-700 text-lg mb-4">
                                        {quizData.results[resultCategory].message}
                                    </p>
                                    <p className="text-gray-600 font-medium bg-white/40 p-3 rounded-lg inline-block">
                                        💡 {quizData.results[resultCategory].recommendation}
                                    </p>
                                </div>

                                {/* Ebook Pitch Section */}
                                <div className="border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 bg-white shadow-xl shadow-yellow-900/5 relative overflow-hidden flex flex-col items-center">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl" />
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl" />
                                    
                                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-2 relative z-10 text-center">
                                        {quizData.results[resultCategory].cta}
                                    </h3>
                                    <p className="text-gray-500 mb-8 max-w-sm text-center relative z-10">
                                        {quizData.ebook_section.subtitle}
                                    </p>
                                    
                                    <div className="w-full max-w-md bg-gray-50 rounded-xl p-6 shadow-sm mb-6 relative z-10 border border-gray-100">
                                        <ul className="space-y-3">
                                            {quizData.ebook_section.features.slice(0, 4).map((feat, i) => (
                                                <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                                                    <span className="text-[#D4AF37] mt-0.5">✨</span>
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="text-center relative z-10 mb-6">
                                        <div className="text-gray-400 text-sm line-through mb-1">De R$ 49,90 por</div>
                                        <div className="text-4xl text-[#D4AF37] font-bold">R$ 24,90</div>
                                        <div className="text-xs text-gray-500 mt-1">Acesso vitalício</div>
                                    </div>

                                    <Button 
                                        size="lg"
                                        onClick={handleCheckout}
                                        className="w-full max-w-sm bg-[#D4AF37] hover:bg-[#c9a02a] text-white border-none shadow-xl shadow-yellow-200/50 py-4 text-lg font-bold relative z-10"
                                    >
                                        Quero Ter Acesso Hoje
                                    </Button>
                                    
                                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 relative z-10">
                                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Pagamento 100% Seguro
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        
                        {/* Transparent Checkout Form Phase */}
                        {showCheckoutForm && !paymentSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-2"
                            >
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
                                        Finalizar Compra
                                    </h2>
                                    <p className="text-gray-500">
                                        Ebook Amor Eterno - <span className="font-bold text-[#D4AF37]">R$ 24,90</span>
                                    </p>
                                </div>
                                
                                {pixData ? (
                                    <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Pague com PIX</h3>
                                        <p className="text-sm text-gray-500 mb-6">Escaneie o QR Code abaixo com o aplicativo do seu banco ou use o Pix Copia e Cola.</p>
                                        
                                        {pixData.qrcode ? (
                                            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
                                                <img 
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixData.qr_code_text)}`} 
                                                    alt="QR Code Pix" 
                                                    className="w-48 h-48 object-contain" 
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-48 h-48 bg-gray-200 animate-pulse rounded-xl mb-6"></div>
                                        )}
                                        
                                        <div className="w-full relative">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 text-left uppercase">Pix Copia e Cola</label>
                                            <input 
                                                readOnly
                                                value={pixData.qr_code_text}
                                                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-sm text-gray-600 outline-none pr-24"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(pixData.qr_code_text);
                                                    alert('Código copiado!');
                                                }}
                                                className="absolute right-2 top-7 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c9a02a] text-white text-xs font-bold rounded-md transition-colors"
                                            >
                                                Copiar
                                            </button>
                                        </div>
                                        
                                        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
                                            <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                                            Aguardando confirmação do pagamento...
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleProcessPayment} className="max-w-md mx-auto space-y-4">
                                        
                                        {/* Payment Method Selector */}
                                        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPaymentMethod('credit_card')}
                                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${selectedPaymentMethod === 'credit_card' ? 'bg-white shadow border border-gray-200 text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                💳 Cartão
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPaymentMethod('pix')}
                                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${selectedPaymentMethod === 'pix' ? 'bg-white shadow border border-gray-200 text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                💠 Pix
                                            </button>
                                        </div>

                                        {selectedPaymentMethod === 'credit_card' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
                                                    <input 
                                                        type="text" 
                                                        required
                                                        maxLength={19}
                                                        placeholder="0000 0000 0000 0000"
                                                        value={cardData.number}
                                                        onChange={(e) => setCardData({...cardData, number: e.target.value})}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-gray-900"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                                                        <div className="flex gap-2">
                                                            <input 
                                                                type="text" 
                                                                required
                                                                maxLength={2}
                                                                placeholder="MM"
                                                                value={cardData.expMonth}
                                                                onChange={(e) => setCardData({...cardData, expMonth: e.target.value})}
                                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-center text-gray-900"
                                                            />
                                                            <input 
                                                                type="text" 
                                                                required
                                                                maxLength={4}
                                                                placeholder="AAAA"
                                                                value={cardData.expYear}
                                                                onChange={(e) => setCardData({...cardData, expYear: e.target.value})}
                                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-center text-gray-900"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                                        <input 
                                                            type="text" 
                                                            required
                                                            maxLength={4}
                                                            placeholder="123"
                                                            value={cardData.cvv}
                                                            onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-gray-900"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                            <input 
                                                type="text" 
                                                required
                                                placeholder="Seu nome"
                                                value={cardData.holderName}
                                                onChange={(e) => setCardData({...cardData, holderName: e.target.value.toUpperCase()})}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-gray-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                                            <input 
                                                type="text" 
                                                required
                                                maxLength={14}
                                                placeholder="000.000.000-00"
                                                value={cardData.cpf}
                                                onChange={(e) => setCardData({...cardData, cpf: e.target.value})}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-gray-900"
                                            />
                                        </div>

                                        <Button 
                                            type="submit"
                                            disabled={isProcessingPayment}
                                            className="w-full mt-6 bg-[#D4AF37] hover:bg-[#c9a02a] text-white border-none shadow-lg shadow-yellow-200/50 py-4 text-lg"
                                        >
                                            {isProcessingPayment ? (
                                                <span className="flex items-center gap-2 justify-center"><Loader2 className="w-5 h-5 animate-spin" /> Gerando Pagamento...</span>
                                            ) : (
                                                selectedPaymentMethod === 'pix' ? 'Gerar PIX de R$ 24,90' : 'Confirmar Pagamento Seguro'
                                            )}
                                        </Button>
                                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Pagamento encriptado com tecnologia Marcha
                                        </div>
                                    </form>
                                )}
                            </motion.div>
                        )}

                        {/* Success Phase */}
                        {paymentSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 text-center"
                            >
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">
                                    Pagamento Aprovado!
                                </h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Parabéns! O seu E-book Amor Eterno já está disponível para baixar e também foi enviado com segurança para <strong>{email}</strong>
                                </p>
                                
                                {downloadUrl && (
                                    <Button 
                                        onClick={() => window.open(downloadUrl, '_blank')}
                                        className="w-full max-w-sm mx-auto mb-4 bg-[#D4AF37] hover:bg-[#c9a02a] text-white border-none shadow-xl shadow-yellow-200/50 py-4 text-lg font-bold"
                                    >
                                        📥 Baixar E-book Agora
                                    </Button>
                                )}

                                <Button 
                                    onClick={handleClose}
                                    className="w-full max-w-sm mx-auto px-8 bg-gray-100 hover:bg-gray-200 text-gray-800 border-none"
                                >
                                    Fechar e voltar para o site
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default QuizModal;
