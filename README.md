# 🧠 Habit Forge

Sistema de Metas e Hábitos Gamificado  
Projeto desenvolvido por **Caio Bertoldo Bezerra**, **Guilherme Pereira Montenegro**, **Diogo Gomes dos Santos** e **Mário Bessa**  
Universidade do Estado do Amazonas – UEA

---

## 📘 Sobre o Projeto

O **Habit Forge** é um sistema web **fullstack gamificado** que ajuda o usuário a **criar, acompanhar e manter hábitos e metas pessoais** de forma divertida e eficiente.  
A aplicação combina **mecânicas de jogos** (XP, níveis, conquistas, ranking) com **painéis de progresso, gráficos e notificações**, oferecendo uma experiência envolvente e motivadora.

> “Forme hábitos, não apenas intenções.” 💪

---

## 🎯 Objetivo

Desenvolver uma aplicação que auxilie o usuário a estabelecer, acompanhar e consolidar hábitos e metas através de:
- Painéis de progresso e estatísticas;
- Mecânicas de gamificação (XP, níveis, conquistas);
- Notificações e lembretes automáticos;
- Reforço positivo com elementos visuais e sociais.

---

## 🧩 Funcionalidades Principais

✅ Cadastro e autenticação segura (JWT e cookies seguros)  
✅ Criação e acompanhamento de hábitos e metas  
✅ Sistema de pontuação (XP) e progressão de níveis  
✅ Conquistas e recompensas visuais  
✅ Dashboard com gráficos e taxa de cumprimento  
✅ Notificações e lembretes automáticos  
✅ Ranking entre amigos e grupos (extra)  
✅ Módulo de recomendações/IA leve (extra)

---

## 🧱 Tecnologias Utilizadas

### 🖥️ Frontend
- **React.js** — Framework SPA moderno
- **TailwindCSS** — Estilização rápida e responsiva
- **Axios** — Comunicação com a API
- **Chart.js / Recharts** — Gráficos e dashboards

### ⚙️ Backend
- **Node.js** — Ambiente de execução JavaScript
- **Express.js** — Framework para rotas e middlewares
- **Prisma ORM** — Manipulação do banco de dados
- **JWT (JSON Web Token)** — Autenticação segura
- **WebSocket (Socket.IO)** — Atualizações em tempo real

### 🗄️ Banco de Dados
- **MySQL** — Armazenamento relacional dos dados da aplicação

---

## 🧰 Arquitetura do Projeto

```
habit-forge/
│
├── backend/                 # API Node.js (Express + Prisma)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── prisma/
│   │   ├── middlewares/
│   │   └── server.js
│   └── package.json
│
├── frontend/                # Interface React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   └── package.json
│
├── docker-compose.yml       # (opcional) Configuração do ambiente completo
└── README.md
```

---

## ⚙️ Como Executar o Projeto

### 🔧 Pré-requisitos
- Node.js (v18+)
- MySQL instalado
- Git

### 🚀 Passos para rodar localmente

```bash
# Clone o repositório
git clone https://github.com/seuusuario/habit-forge.git

# Entre na pasta do backend e instale as dependências
cd habit-forge/backend
npm install

# Configure o .env
cp .env.example .env
# Edite o arquivo com suas credenciais MySQL e JWT_SECRET

# Rode as migrações do Prisma
npx prisma migrate dev

# Inicie o servidor backend
npm run dev
```

Em outro terminal:

```bash
# Vá para o frontend
cd ../frontend

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

Acesse em:  
👉 http://localhost:3000

---

## 📆 Cronograma de Desenvolvimento

| Etapa | Início | Fim |
|-------|--------|-----|
| Escolha da Stack | 14/10/2025 | 14/10/2025 |
| Setup do Repositório | 15/10/2025 | 15/10/2025 |
| Backend: Autenticação e Modelos Básicos | 16/10/2025 | 21/10/2025 |
| CRUD de Hábitos e API de Progresso | 22/10/2025 | 27/10/2025 |
| Frontend: Login, Dashboard e Hábitos | 28/10/2025 | 03/11/2025 |
| Sistema de XP, Níveis e Conquistas | 04/11/2025 | 10/11/2025 |
| WebSocket e Ranking | 11/11/2025 | 17/11/2025 |
| Testes e Documentação | 18/11/2025 | 25/11/2025 |
| Correções e Deploy | 26/11/2025 | 04/12/2025 |

---

## 📊 Resultados Esperados
- Aplicação funcional com painel de progresso e gamificação completa;
- Código modular e documentado;
- Protótipo escalável para versão mobile ou API pública;
- Documentação técnica e guia de uso no repositório GitHub.

---

## 👥 Autores
- **Caio Bertoldo Bezerra**
- **Guilherme Pereira Montenegro**
- **Diogo Gomes dos Santos**
- **Mário Bessa**

Universidade do Estado do Amazonas – UEA  
Manaus – AM – Brasil

---

## 📚 Referências

- D. Eyal, *Hooked: How to Build Habit-Forming Products*, 2014.
- J. Fogg, *Tiny Habits: The Small Changes That Change Everything*, 2020.

---

> 💡 *Habit Forge — transforme esforço em progresso, e progresso em conquista.*
