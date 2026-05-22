# ⚓ Sistema de Calibração Naval

Sistema web fullstack para gerenciamento de ferramentas de calibração com autenticação segura, dashboard e controle de validade.

---

## 🚀 Tecnologias

### Frontend
- React + Vite
- Chart.js
- PWA

### Backend
- FastAPI
- JWT (Autenticação)

### Banco de Dados
- PostgreSQL (Supabase)

### Deploy
- Vercel (Frontend)
- Render (Backend)

---

## 🔐 Funcionalidades

- Login com JWT
- Cadastro de ferramentas
- Listagem de ferramentas
- Exclusão múltipla com confirmação
- Dashboard com gráfico
- Status automático (OK / Vencido)
- Responsivo (Desktop + Mobile)
- PWA (instalável)

---

## 📊 Dashboard

- Gráfico de status (Ferramentas válidas x vencidas)
- Atualização automática

---

## 📁 Estrutura do Projeto

~~~text
frontend/
 ├── src/
 │   ├── App.jsx
 │   ├── main.jsx
 │   ├── index.css
 └── public/

backend/
 ├── main.py
 ├── database.py
 ├── security.py
~~~

---

## 🔄 Fluxo do Sistema

1. Usuário realiza login  
2. Token JWT é gerado  
3. Token é salvo no navegador  
4. Requisições autenticadas são enviadas ao backend  
5. Usuário gerencia ferramentas  

---

## 📱 PWA (Aplicativo)

- Pode ser usado no celular
- Interface adaptável

---

## 🌐 Acesso

Frontend:
https://seu-projeto.vercel.app

Backend:
https://seu-backend.onrender.com

---

## 🚀 Melhorias Futuras

- Edição de ferramentas
- Filtro e busca
- Alertas automáticos
- Multiusuário
- Exportação para Excel
- Dashboard avançado

---

## 👨‍💻 Autor

Lucas de Souza Resende
