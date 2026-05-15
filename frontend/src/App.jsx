
import React, { useState, useEffect } from "react";

// ⚠️ Em produção isso viria de um backend (API + banco de dados)
const USERS = [
  { username: "admin", password: "1234" }
];
function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    const found = USERS.find(u => u.username === user && u.password === pass);
    if (found) onLogin(user);
    else alert("Credenciais inválidas");
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Login</h1>
      <input className="border p-2 mb-2" placeholder="Usuário" onChange={(e) => setUser(e.target.value)} />
      <input type="password" className="border p-2 mb-2" placeholder="Senha" onChange={(e) => setPass(e.target.value)} />
      <button className="bg-blue-500 text-white p-2" onClick={handleLogin}>Entrar</button>
    </div>
  )
}

function getStatus(expiryDate) {
  const today = new Date();
  const exp = new Date(expiryDate);

  if (exp.toDateString() === today.toDateString()) return "hoje";
  if (exp < today) return "expirado";
  return "ok";
}

function notify(tool) {
  if (Notification.permission === "granted") {
    new Notification(`⚠️ ${tool.name} expirada!`, {
      body: "Necessita recalibração"
    });
  }
}


export default function App() {
  const [logged, setLogged] = useState(null);
  const [tools, setTools] = useState([]);
  const [history, setHistory] = useState([]);


  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [months, setMonths] = useState("");
  const [responsible, setResponsible] = useState("");
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tools") || "[]");
    const hist = JSON.parse(localStorage.getItem("history") || "[]");
    setTools(saved);
    setHistory(hist);


    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const addTool = () => {
    const entry = new Date(date);
    const expiry = new Date(entry);
    expiry.setMonth(expiry.getMonth() + parseInt(months));
    const newTool = {
      id: Date.now(),
      name,
      responsible,
      entryDate: date,
      expiryDate: expiry.toISOString().substring(0, 10),
      months
    };

    const updated = [...tools, newTool];
    setTools(updated);
    localStorage.setItem("tools", JSON.stringify(updated));
  }

  const recalibrate = (tool) => {
    const hist = [...history, { ...tool, recalibratedAt: new Date().toISOString() }];
    setHistory(hist);
    localStorage.setItem("history", JSON.stringify(hist));
    const updated = tools.filter(t => t.id !== tool.id);
    setTools(updated);
    localStorage.setItem("tools", JSON.stringify(updated));
  }


  if (!logged) return <Login onLogin={setLogged} />;


  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Controle de Calibração</h1>
      <p>Usuário: {logged}</p>
      <div className="mb-4">
        <input className="border p-2 m-1" placeholder="Ferramenta" onChange={e => setName(e.target.value)} />
        <input className="border p-2 m-1" placeholder="Responsável" onChange={e => setResponsible(e.target.value)} />
        <input type="date" className="border p-2 m-1" onChange={e => setDate(e.target.value)} />
        <input className="border p-2 m-1" placeholder="Período (meses)" onChange={e => setMonths(e.target.value)} />
        <button className="bg-green-500 text-white p-2" onClick={addTool}>Adicionar</button>
      </div>

      <h2 className="text-xl">Ferramentas</h2>
      <table className="border w-full mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th>Nome</th>
            <th>Responsável</th>
            <th>Entrada</th>
            <th>Expiração</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((t) => {
            const status = getStatus(t.expiryDate);
            const color = status === "ok" ? "bg-green-200" : status === "hoje" ? "bg-yellow-200" : "bg-red-200";

            if (status === "expirado") {
              notify(t);
            }

            return (
              <tr key={t.id} className={color}>
                <td>{t.name}</td>
                <td>{t.responsible}</td>
                <td>{t.entryDate}</td>
                <td>{t.expiryDate}</td>
                <td>{status}</td>
                <td>
                  <button className="bg-blue-500 text-white p-1" onClick={() => recalibrate(t)}>
                    Recalibrar
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <h2 className="text-xl">Histórico</h2>
      <table className="border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th>Nome</th>
            <th>Responsável</th>
            <th>Recalibrado em</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i}>
              <td>{h.name}</td>
              <td>{h.responsible}</td>
              <td>{h.recalibratedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>


      <div className="mt-4">
        <p><span className="bg-green-200 p-1">Verde</span> Dentro do prazo</p>
        <p><span className="bg-yellow-200 p-1">Amarelo</span> Expira hoje</p>
        <p><span className="bg-red-200 p-1">Vermelho</span> Expirado</p>
      </div>
    </div>
  );
}
