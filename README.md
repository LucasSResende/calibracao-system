# ⚓ Sistema de Calibração Naval

Aplicação web fullstack para controle de ferramentas de calibração, com autenticação segura, dashboard visual e gerenciamento de validade.

---

## 📌 Visão Geral

O **Sistema de Calibração Naval** foi desenvolvido para substituir controles manuais (planilhas) e oferecer uma solução centralizada, segura e acessível para gestão de ferramentas.

Permite acompanhar prazos de validade, responsáveis e status em tempo real.

---

## 🚀 Tecnologias Utilizadas

### 🖥️ Frontend
- React (Vite)
- JavaScript (ES6+)
- Chart.js (Dashboard)
- CSS (layout responsivo)
- PWA (Progressive Web App)

### ⚙️ Backend
- FastAPI (Python)
- JWT (Autenticação)
- OAuth2PasswordBearer

### 🗄️ Banco de Dados
- PostgreSQL
- Supabase (Cloud)

### ☁️ Deploy
- Vercel (Frontend)
- Render (Backend)

---

## 🔐 Funcionalidades

✔ Autenticação segura com JWT  
✔ Cadastro de ferramentas  
✔ Listagem dinâmica  
✔ Exclusão múltipla com confirmação  
✔ Dashboard com gráfico (Chart.js)  
✔ Status automático:
- OK (válido)
- VENCIDO  

✔ Interface responsiva (Desktop + Mobile)  
✔ Aplicação instalável (PWA)

---

## 📊 Dashboard

- Visualização gráfica de ferramentas válidas e vencidas
- Atualização automática baseada nos dados do banco

---

## 📁 Estrutura do Projeto

```
calibracao-system/
│
├── backend/
│   ├── main.py            # API principal
│   ├── database.py        # conexão com banco
│   ├── security.py        # hash e autenticação JWT
│   ├── models.py          # modelos (em evolução)
│   └── requirements.txt   # dependências backend
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # componente principal
│   │   ├── main.jsx       # entry point React
│   │   ├── index.css      # estilos globais
│   │   └── assets/        # arquivos estáticos
│   │
│   ├── public/
│   ├── package.json       # dependências frontend
│   └── vite.config.js     # config do Vite
│
└── README.md
```

---

## 🔄 Fluxo do Sistema

1. Usuário realiza login  
2. Backend valida credenciais  
3. Token JWT é gerado  
4. Token é salvo no navegador (localStorage)  
5. Requisições usam Authorization Bearer  
6. Backend valida o token  
7. Usuário gerencia ferramentas  

---

## 🌐 API (Backend)

### 🔹 Login
POST /login

### 🔹 Listar ferramentas
GET /tools

### 🔹 Criar ferramenta
POST /tools

### 🔹 Deletar ferramenta
DELETE /tools/{id}

---

## 📱 PWA (Aplicativo)

- Pode ser instalado no celular
- Funciona como app
- Interface responsiva

---

## 🔗 Acesso

Frontend:
https://seu-projeto.vercel.app  

Backend:
https://seu-backend.onrender.com  

---

## ⚠️ Observações Técnicas

- IDs usam UUID (Supabase)
- Senhas armazenadas com hash seguro
- JWT controla autenticação
- CORS habilitado para integração frontend/backend

---

## 🚀 Melhorias Futuras

- Edição de ferramentas  
- Busca e filtros  
- Dashboard avançado  
- Exportação (Excel/PDF)  
- Histórico de alterações  
- Multiempresa (SaaS)  
- Alertas automáticos  

---

## 👨‍💻 Autor

Lucas de Souza Resende  

---

## 🏆 Status do Projeto

🚧 Em evolução  
✅ Funcional e em produção  
🚀 Caminho para SaaS completo  
