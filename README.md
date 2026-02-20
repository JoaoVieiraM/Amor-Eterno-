# Amor Eterno Pets 🐾

Bem-vindo ao **Amor Eterno Pets**, uma plataforma comovente dedicada a manter viva a memória dos seus amados animais de estimação. Crie homenagens inesquecíveis, personalize temas e compartilhe o legado de amor do seu pet.

## 🚀 Sobre o Projeto

O **Amor Eterno Pets** permite que os usuários criem painéis de homenagens personalizados para seus animais que já partiram. A plataforma oferece:
- Autenticação segura integrada (Google e E-mail) via Supabase;
- Fluxo dinâmico para criação de homenagens com diferentes temas visuais (ex: "Céu Estrelado");
- Galerias de fotos com armazenamento em nuvem;
- Integração com IA generativa para auxiliar na criação de textos emotivos e dedicatórias.

## 🛠️ Tecnologias e Stack

O projeto é construído sobre um stack moderno e robusto:

- **[Next.js](https://nextjs.org/)** - Framework React (utilizando App Router).
- **[React](https://react.dev/)** - Biblioteca principal de UI.
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário para estilização rápida e responsiva.
- **[Framer Motion](https://www.framer.com/motion/)** - Biblioteca para criar animações fluidas e interações avançadas.
- **[Supabase](https://supabase.com/)** - Backend as a Service (PostgreSQL, Authentication, SSR e Storage buckets).
- **[Google Generative AI](https://deepmind.google/technologies/gemini/)** - Geração inteligente de conteúdo textuais para homenagens.
- **[Lucide React](https://lucide.dev/)** - Ícones vetoriais modernos.

## 📦 Estrutura Principal

- `/app`: Rotas principais da aplicação Next.js (ex: `/login`, `/homenagem/novo`, etc.).
- `/components`: Componentes reutilizáveis (UI, layout de cabeçalho, seções de homepage como `GalleryPreview`, temas e seletores).
- `/supabase`: Configurações e clientes para comunicação com o backend Supabase.
- `/utils`: Funções utilitárias e ajudantes compartilhados pela aplicação.
- `/public`: Arquivos e assets estáticos.

## ⚙️ Pré-requisitos e Execução

Para rodar este projeto no seu ambiente local, é recomendável usar o `Node.js` v18 ou superior.

1. **Clone o repositório e acesse a raiz**
   ```bash
   git clone <seu-repositorio>
   cd amor-eterno-pets
   ```

2. **Instale as dependências necessárias**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Configuração de Variáveis de Ambiente**
   Crie ou edite o arquivo `.env.local` na raiz do projeto contendo as credenciais de acesso:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_do_supabase
   # Outras chaves de OAuth (Google) ou IA (Gemini) se definidas pelo projeto
   ```

4. **Inicie o ambiente de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

5. **Acesse no navegador**
   Abra [http://localhost:3000](http://localhost:3000) e veja a aplicação rodando.

## 👨‍💻 Scripts Disponíveis

- `npm run dev` - Roda o servidor de desenvolvimento.
- `npm run build` - Faz o build de produção da aplicação.
- `npm run start` - Inicia a versão de produção logo após o processo de build.
- `npm run lint` - Executa a verificação de lint (ESLint) de todo o projeto.
