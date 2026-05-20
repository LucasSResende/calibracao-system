import { useState, useEffect } from "react";

const API = "https://calibracao-system.onrender.com";

export default function App() {
  const [logged, setLogged] = useState(false);
  const [tools, setTools] = useState([]);

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [name, setName] = useState("");
  const [responsible, setResponsible] = useState("");
  const [date, setDate] = useState("");
  const [months, setMonths] = useState("");

  // ✅ LOGIN
  const login = async () => {
    const formData = new URLSearchParams();
    formData.append("username", user);
    formData.append("password", pass);

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      setLogged(true);
      loadTools();
    } else {
      alert("Erro login");
    }
  };

  // ✅ CARREGAR FERRAMENTAS
  const loadTools = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/tools`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setTools(data);
  };

  // ✅ ADICIONAR FERRAMENTA
  const addTool = async () => {
    const token = localStorage.getItem("token");

    await fetch(
      `${API}/tools?name=${name}&responsible=${responsible}&entry_date=${date}&months=${months}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    loadTools();
  };

  // ✅ MANTER LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLogged(true);
      loadTools();
    }
  }, []);

  // ✅ TELA LOGIN
  if (!logged) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Login</h2>
        <input placeholder="Usuário" onChange={e => setUser(e.target.value)} />
        <br /><br />
        <input
          type="password"
          placeholder="Senha"
          onChange={e => setPass(e.target.value)}
        />
        <br /><br />
        <button onClick={login}>Entrar</button>
      </div>
    );
  }

  // ✅ TELA PRINCIPAL
  return (
    <div style={{ padding: "20px" }}>
      <h2>Sistema de Calibração</h2>

      <input placeholder="Nome" onChange={e => setName(e.target.value)} />
      <input placeholder="Responsável" onChange={e => setResponsible(e.target.value)} />
      <input type="date" onChange={e => setDate(e.target.value)} />
      <input placeholder="Meses" onChange={e => setMonths(e.target.value)} />

      <button onClick={addTool}>Adicionar</button>

      <h3>Ferramentas</h3>

      {tools.map(t => (
        <div key={t.id}>
          {t.name} - {t.responsible} - {t.expiry_date}
        </div>
      ))}
    </div>
  );
}