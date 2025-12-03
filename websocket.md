# 📡 Planejamento — Módulo de WebSocket & Ranking  
*Habit Forge — Sistema Gamificado de Hábitos e Metas*

---

## 🧭 Visão Geral

Este documento descreve o planejamento técnico da implementação dos módulos de:

- **WebSocket (tempo real com Socket.IO)**
- **Ranking Semanal Dinâmico**

Esses módulos têm como objetivo trazer interatividade, competição saudável e atualização instantânea no Habit Forge.

---

# 🛰️ 1. Objetivo do WebSocket

O WebSocket será usado para:

### ✔ Atualizar dados em tempo real:
- XP do usuário  
- Nível atual  
- Conquistas desbloqueadas  
- Progresso de hábitos  

### ✔ Atualizar o ranking dinamicamente:
Sempre que qualquer usuário completar um hábito, todos os usuários conectados veem o ranking se atualizar automaticamente.

---

# 📡 2. Eventos WebSocket — Servidor → Cliente

| Evento | Payload | Quando ocorre |
|-------|---------|----------------|
| `user:xpUpdated` | `{ userId, xp, level }` | Após o usuário ganhar XP |
| `ranking:update` | `{ rankingList: [...] }` | Após qualquer alteração em XP semanal |
| `achievement:unlocked` | `{ userId, achievement }` | Quando critérios são alcançados |
| `habit:completed` | `{ userId, habitId }` | Quando um hábito é concluído |

---

# 📤 3. Eventos WebSocket — Cliente → Servidor

| Evento | Payload | Função |
|--------|---------|--------|
| `habit:complete` | `{ userId, habitId }` | Marca hábito como concluído |
| `ranking:subscribe` | `{ userId }` | Entra na sala de ranking |
| `disconnect` | — | Evento automático |

---

# 🏆 4. Lógica do Ranking

### 📌 Ranking baseado em XP semanal  
Mérito por constância → mais justo e motivador.

**Cálculo:**


### Fluxo:

1. Cliente conclui hábito → `habit:complete`  
2. Backend atualiza XP semanal e total  
3. Ranking é recalculado  
4. Todos os clientes conectados recebem `ranking:update`

### Exemplo de payload:

```json
{
  "rankingList": [
    {
      "userId": 1,
      "name": "Caio",
      "xpWeek": 330,
      "level": 6,
      "position": 1,
      "avatarUrl": "/avatars/caio.png"
    }
  ]
}
