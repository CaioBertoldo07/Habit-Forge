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

habit-forge/
│
├── backend/ # API Node.js (Express + Prisma)
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── prisma/
│ │ ├── middlewares/
│ │ └── server.js
│ └── package.json
│
├── frontend/ # Interface React
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── hooks/
│ │ └── services/
│ └── package.json
│
├── docker-compose.yml # (opcional) Configuração do ambiente completo
└── README.md

