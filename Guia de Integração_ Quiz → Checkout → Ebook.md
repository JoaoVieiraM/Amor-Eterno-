# Guia de Integração: Quiz → Checkout → Ebook

## 🎨 Componentes para Adicionar na Página

### 1. **Botão Quiz (Hero Section)**

```html
<!-- Adicionar na seção principal da página -->
<button 
  id="btn-quiz" 
  class="btn-primary"
  onclick="iniciarQuiz()"
>
  ✨ Fazer o Quiz Gratuito
</button>
```

---

### 2. **Modal/Página do Quiz**

```html
<div id="quiz-container" class="quiz-modal" style="display: none;">
  <div class="quiz-content">
    <button class="close-btn" onclick="fecharQuiz()">✕</button>
    
    <div id="quiz-progress" class="progress-bar"></div>
    
    <div id="quiz-questions"></div>
    
    <button id="btn-proximo" onclick="proximaPergunta()" class="btn-primary">
      Próxima
    </button>
  </div>
</div>
```

---

### 3. **Página de Resultado + Apresentação do Ebook**

```html
<div id="resultado-container" style="display: none;">
  <!-- Resultado do Quiz -->
  <div class="resultado-section">
    <h2 id="resultado-titulo"></h2>
    <p id="resultado-mensagem"></p>
    <p id="resultado-recomendacao"></p>
  </div>
  
  <!-- Apresentação do Ebook -->
  <div class="ebook-presentation">
    <div class="ebook-card">
      <img src="ebook-cover.png" alt="Ebook Amor Eterno">
      
      <h3>Ebook Amor Eterno</h3>
      <p>7 Dias de Orações e Estratégias Práticas para o Luto Pet</p>
      
      <ul class="features">
        <li>✨ 7 orações personalizáveis (método do espelho)</li>
        <li>✨ Estratégias práticas para cada desafio</li>
        <li>✨ Dados baseados em pesquisa</li>
        <li>✨ Espaços para reflexão e escrita</li>
        <li>✨ Design acolhedor em dourado e branco</li>
      </ul>
      
      <div class="price">
        <span class="amount">R$ 24,90</span>
        <span class="description">Acesso vitalício</span>
      </div>
      
      <button 
        id="btn-comprar" 
        class="btn-primary btn-large"
        onclick="iniciarCheckout()"
      >
        💳 Comprar Ebook
      </button>
      
      <p class="trust-badge">
        ✓ Pagamento seguro via Marchapay
      </p>
    </div>
  </div>
</div>
```

---

### 4. **Fluxo JavaScript**

```javascript
// Estado do quiz
let quizState = {
  currentQuestion: 0,
  answers: [],
  email: '',
  result: null
};

// Dados do quiz (importar do JSON)
const quizData = {
  // ... dados do quiz_luto_pet.json
};

// Iniciar quiz
function iniciarQuiz() {
  document.getElementById('quiz-container').style.display = 'flex';
  renderizarPergunta(0);
}

// Renderizar pergunta
function renderizarPergunta(index) {
  const pergunta = quizData.questions[index];
  const container = document.getElementById('quiz-questions');
  
  let html = `
    <h3>${pergunta.question}</h3>
    <p class="stat">${pergunta.stat}</p>
    <div class="options">
  `;
  
  pergunta.options.forEach((option, i) => {
    html += `
      <label class="option">
        <input 
          type="radio" 
          name="question-${index}" 
          value="${option.value}"
          onchange="selecionarResposta('${option.value}')"
        >
        <span>${option.text}</span>
      </label>
    `;
  });
  
  html += `</div>`;
  container.innerHTML = html;
  
  // Atualizar progress bar
  const progress = ((index + 1) / quizData.questions.length) * 100;
  document.getElementById('quiz-progress').style.width = progress + '%';
}

// Próxima pergunta
function proximaPergunta() {
  if (quizState.currentQuestion < quizData.questions.length - 1) {
    quizState.currentQuestion++;
    renderizarPergunta(quizState.currentQuestion);
  } else {
    // Última pergunta - coletar email e calcular resultado
    coletarEmailEFinalizarQuiz();
  }
}

// Coletar email e finalizar
function coletarEmailEFinalizarQuiz() {
  const email = prompt('Para enviarmos seu ebook, qual é seu email?');
  
  if (!email || !validarEmail(email)) {
    alert('Email inválido. Por favor, tente novamente.');
    return;
  }
  
  quizState.email = email;
  quizState.result = calcularResultado();
  
  // Salvar no Supabase via Antigravity
  salvarQuizNoSupabase(email, quizState.result);
  
  // Mostrar resultado
  mostrarResultado();
}

// Calcular resultado
function calcularResultado() {
  let scores = {
    high_need: 0,
    moderate_need: 0,
    stable: 0
  };
  
  quizState.answers.forEach(answer => {
    scores[answer]++;
  });
  
  // Retornar categoria com maior score
  return Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
}

// Mostrar resultado
function mostrarResultado() {
  document.getElementById('quiz-container').style.display = 'none';
  
  const resultData = quizData.results[quizState.result];
  
  document.getElementById('resultado-titulo').textContent = resultData.title;
  document.getElementById('resultado-mensagem').textContent = resultData.message;
  document.getElementById('resultado-recomendacao').textContent = resultData.recommendation;
  
  document.getElementById('resultado-container').style.display = 'block';
  
  // Scroll para resultado
  document.getElementById('resultado-container').scrollIntoView({ behavior: 'smooth' });
}

// Fechar quiz
function fecharQuiz() {
  document.getElementById('quiz-container').style.display = 'none';
}

// Validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Salvar quiz no Supabase
async function salvarQuizNoSupabase(email, result) {
  // Chamar API Antigravity para salvar
  await fetch('/api/salvar-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      quiz_result: result,
      answers: quizState.answers
    })
  });
}

// Iniciar checkout
function iniciarCheckout() {
  // Redirecionar para Marchapay com email pré-preenchido
  const checkoutUrl = `https://marchapay.com/checkout?email=${quizState.email}&amount=2490&product=ebook_amor_eterno`;
  window.location.href = checkoutUrl;
}
```

---

## 🎨 CSS para Estilizar

```css
/* Quiz Modal */
.quiz-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.quiz-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.progress-bar {
  height: 4px;
  background: #D4AF37;
  border-radius: 2px;
  margin-bottom: 30px;
  transition: width 0.3s ease;
}

.quiz-questions h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #4A4A4A;
}

.stat {
  font-size: 12px;
  color: #D4AF37;
  margin-bottom: 20px;
  font-weight: bold;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option:hover {
  border-color: #D4AF37;
  background: #F5E6D3;
}

.option input[type="radio"] {
  margin-right: 12px;
  cursor: pointer;
}

/* Resultado */
.resultado-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: #F5E6D3;
  border-radius: 12px;
}

.resultado-section h2 {
  color: #D4AF37;
  margin-bottom: 15px;
}

.resultado-section p {
  color: #4A4A4A;
  line-height: 1.6;
  margin-bottom: 10px;
}

/* Ebook Card */
.ebook-presentation {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.ebook-card {
  background: white;
  border: 2px solid #D4AF37;
  border-radius: 16px;
  padding: 40px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.1);
}

.ebook-card img {
  width: 100%;
  max-width: 200px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.ebook-card h3 {
  color: #D4AF37;
  font-size: 24px;
  margin-bottom: 10px;
}

.ebook-card p {
  color: #4A4A4A;
  margin-bottom: 20px;
  line-height: 1.6;
}

.features {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  text-align: left;
}

.features li {
  padding: 8px 0;
  color: #4A4A4A;
  border-bottom: 1px solid #f0f0f0;
}

.price {
  margin: 30px 0;
}

.amount {
  display: block;
  font-size: 32px;
  color: #D4AF37;
  font-weight: bold;
  margin-bottom: 5px;
}

.description {
  font-size: 12px;
  color: #999;
}

.btn-primary {
  background: #D4AF37;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #c9a02a;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

.btn-large {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  margin: 20px 0;
}

.trust-badge {
  font-size: 12px;
  color: #8B9D6F;
  margin-top: 15px;
}

/* Responsivo */
@media (max-width: 768px) {
  .quiz-content {
    padding: 20px;
  }
  
  .ebook-card {
    padding: 20px;
  }
  
  .amount {
    font-size: 24px;
  }
}
```

---

## 🔗 Integração com Marchapay

**Adicionar script no final do body:**

```html
<script src="https://sdk.marchapay.com/checkout.js"></script>

<script>
  function iniciarCheckout() {
    // Inicializar checkout Marchapay
    MarchaCheckout.open({
      publicKey: 'sua_chave_publica_marchapay',
      amount: 2490, // em centavos
      currency: 'BRL',
      customerEmail: quizState.email,
      customerName: quizState.email.split('@')[0],
      description: 'Ebook Amor Eterno - 7 Dias de Orações',
      metadata: {
        quiz_result: quizState.result,
        product_id: 'ebook_amor_eterno'
      },
      onSuccess: function(transaction) {
        console.log('Pagamento realizado:', transaction);
        // Antigravity vai cuidar do resto via webhook
      },
      onError: function(error) {
        alert('Erro no pagamento. Tente novamente.');
        console.error(error);
      }
    });
  }
</script>
```

---

## 📊 Fluxo Visual

```
┌─────────────────────────────────────────┐
│  Página Inicial - Botão "Fazer Quiz"    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Modal Quiz - 7 Perguntas               │
│  (com dados e stats)                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Coletar Email                          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Resultado Personalizado                │
│  + Apresentação do Ebook                │
│  + Botão "Comprar"                      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Marchapay Checkout                     │
│  (email pré-preenchido)                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Webhook Marchapay → Antigravity        │
│  Salvar pagamento no Supabase           │
│  Gerar link único                       │
│  Enviar email com link                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Email com Link de Download             │
│  (válido por 7 dias)                    │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Adicionar botão Quiz na página
- [ ] Criar modal do quiz
- [ ] Importar dados do quiz_luto_pet.json
- [ ] Criar página de resultado
- [ ] Criar card de apresentação do ebook
- [ ] Integrar com Marchapay SDK
- [ ] Configurar CSS responsivo
- [ ] Testar fluxo completo
- [ ] Configurar webhook no Marchapay
- [ ] Testar com pagamento real

---

## 💡 Dicas

1. **Teste tudo antes de publicar** - Use cartão de teste
2. **Email de confirmação** - Sempre envie confirmação de compra
3. **Suporte** - Crie página de FAQ para "link expirado"
4. **Analytics** - Rastreie cada etapa do funil
5. **Otimização** - A/B teste o preço depois


quiz json:
{
  "quiz": {
    "title": "Você está passando por luto pet? Descubra como a Amor Eterno pode ajudar",
    "description": "Um quiz rápido e acolhedor para entender sua jornada de luto",
    "questions": [
      {
        "id": 1,
        "question": "Quanto tempo faz que você perdeu seu pet?",
        "type": "single_choice",
        "options": [
          {
            "text": "Menos de uma semana",
            "value": "recent"
          },
          {
            "text": "Entre 1 semana e 1 mês",
            "value": "recent"
          },
          {
            "text": "Entre 1 e 6 meses",
            "value": "moderate"
          },
          {
            "text": "Mais de 6 meses",
            "value": "long_term"
          }
        ],
        "stat": "73% das pessoas em luto por pet ainda sentem a dor intensamente após 6 meses"
      },
      {
        "id": 2,
        "question": "O que mais dói para você?",
        "type": "single_choice",
        "options": [
          {
            "text": "A rotina quebrada (café da manhã solitário, passeio que não acontece mais)",
            "value": "routine"
          },
          {
            "text": "Os momentos inesperados em que lembro e desabo",
            "value": "triggers"
          },
          {
            "text": "A madrugada insone, quando a saudade grita mais alto",
            "value": "insomnia"
          },
          {
            "text": "Tudo junto, não consigo lidar",
            "value": "all"
          }
        ],
        "stat": "85% das pessoas dizem que a rotina quebrada dói mais que a foto"
      },
      {
        "id": 3,
        "question": "Como você tem dormido desde a perda?",
        "type": "single_choice",
        "options": [
          {
            "text": "Consigo dormir, mas acordo de madrugada com crises emocionais",
            "value": "interrupted"
          },
          {
            "text": "Tenho insônia severa, não consigo dormir",
            "value": "severe"
          },
          {
            "text": "Durmo demais, é minha forma de escapar",
            "value": "escape"
          },
          {
            "text": "Consigo dormir bem",
            "value": "good"
          }
        ],
        "stat": "40% das pessoas em luto por pet sofrem com insônia ou despertares noturnos"
      },
      {
        "id": 4,
        "question": "Você se sente compreendido pelas pessoas ao seu redor?",
        "type": "single_choice",
        "options": [
          {
            "text": "Não, as pessoas minimizam dizendo 'era só um animal'",
            "value": "misunderstood"
          },
          {
            "text": "Parcialmente, alguns entendem, outros não",
            "value": "partial"
          },
          {
            "text": "Sim, tenho pessoas que realmente entendem",
            "value": "understood"
          },
          {
            "text": "Prefiro não falar sobre isso com ninguém",
            "value": "isolated"
          }
        ],
        "stat": "73% das pessoas em luto por pet sentem-se incompreendidas pela sociedade"
      },
      {
        "id": 5,
        "question": "Você tem momentos em que a dor retorna sem aviso (gatilhos)?",
        "type": "single_choice",
        "options": [
          {
            "text": "Sim, constantemente. Uma música, um cheiro, um pet parecido",
            "value": "frequent"
          },
          {
            "text": "Sim, mas menos frequente que antes",
            "value": "occasional"
          },
          {
            "text": "Raramente, consigo controlar melhor agora",
            "value": "rare"
          },
          {
            "text": "Não, já superei",
            "value": "none"
          }
        ],
        "stat": "68% das pessoas têm crises emocionais inesperadas meses ou anos após a perda"
      },
      {
        "id": 6,
        "question": "O que você mais sente falta?",
        "type": "single_choice",
        "options": [
          {
            "text": "A rotina diária com ele",
            "value": "routine"
          },
          {
            "text": "O conforto emocional que ele dava",
            "value": "comfort"
          },
          {
            "text": "Simplesmente sua presença",
            "value": "presence"
          },
          {
            "text": "Tudo. Não consigo escolher",
            "value": "everything"
          }
        ],
        "stat": "A ausência de rotina é o fator mais impactante no luto pet"
      },
      {
        "id": 7,
        "question": "Você tem um espaço seguro para processar seu luto?",
        "type": "single_choice",
        "options": [
          {
            "text": "Não, estou lidando sozinho",
            "value": "alone"
          },
          {
            "text": "Parcialmente, mas preciso de mais apoio",
            "value": "partial"
          },
          {
            "text": "Sim, tenho comunidade ou terapia",
            "value": "supported"
          },
          {
            "text": "Não sei por onde começar",
            "value": "lost"
          }
        ],
        "stat": "Pessoas com apoio comunitário processam o luto 3x mais rápido"
      }
    ],
    "results": {
      "high_need": {
        "title": "Você está em um momento muito difícil 💙",
        "message": "Sua dor é real e merece ser validada. Você não está sozinho nessa jornada. Muitas pessoas passam exatamente pelo que você está passando agora.",
        "recommendation": "Recomendamos que você tenha um espaço estruturado para processar seu luto. Algo que combine acolhimento emocional com estratégias práticas para lidar com os desafios do dia a dia.",
        "cta": "Conheça o Ebook Amor Eterno"
      },
      "moderate_need": {
        "title": "Você está no caminho, mas precisa de apoio 💛",
        "message": "Você já passou pelos momentos mais agudos, mas ainda há desafios. É completamente normal. O luto não é linear.",
        "recommendation": "Um material que combine validação com estratégias práticas pode fazer toda a diferença nessa fase. Algo que você possa voltar sempre que precisar.",
        "cta": "Descubra o Ebook Amor Eterno"
      },
      "stable": {
        "title": "Você está processando bem seu luto 💚",
        "message": "Parabéns pelo trabalho emocional que você tem feito. Você está transformando a dor em crescimento.",
        "recommendation": "Mesmo em um lugar mais estável, ter um espaço para honrar a memória do seu pet e consolidar o aprendizado é valioso. Pode ajudar você a seguir em frente com propósito.",
        "cta": "Explore o Ebook Amor Eterno"
      }
    },
    "ebook_section": {
      "title": "Apresentamos: Ebook Amor Eterno",
      "subtitle": "7 Dias de Orações e Estratégias Práticas para o Luto Pet",
      "description": "Um material único que combina acolhimento emocional com estratégias práticas para lidar com os desafios reais do luto pet.",
      "features": [
        "7 orações personalizáveis (método do espelho)",
        "Estratégias práticas para cada desafio (madrugada insone, rotina quebrada, gatilhos inesperados)",
        "Dados baseados em pesquisa sobre luto pet",
        "Espaços para reflexão e escrita pessoal",
        "Design acolhedor em dourado e branco",
        "Otimizado para imprimir e escrever à mão"
      ],
      "cta_button": "Baixar Ebook Grátis",
      "cta_link": "#download-ebook"
    }
  }
}
