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

  const logout = () => {
    localStorage.removeItem("token");
    setLogged(false);
  };

  const loadTools = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/tools`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (Array.isArray(data)) {
      setTools(data);
    } else {
      setTools([]);
    }
  };

  const addTool = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API}/tools?name=${name}&responsible=${responsible}&entry_date=${date}&months=${months}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.ok) {
      loadTools();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLogged(true);
      loadTools();
    }
  }, []);

  if (!logged) {
    return (
      <div>
        <h2>Login</h2>
        <input onChange={e => setUser(e.target.value)} placeholder="Usuário" />
        <input onChange={e => setPass(e.target.value)} type="password" placeholder="Senha" />
        <button onClick={login}>Entrar</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>Usuário logado</strong>
        <button onClick={logout}>Sair</button>
      </div>

      <h2>Sistema de Calibração</h2>

      <input onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input onChange={e => setResponsible(e.target.value)} placeholder="Responsável" />
      <input onChange={e => setDate(e.target.value)} type="date" />
      <input onChange={e => setMonths(e.target.value)} placeholder="Meses" />

      <button onClick={addTool}>Adicionar</button>

      <h3>Ferramentas</h3>

      {tools.length === 0 && <p>Nenhuma ferramenta cadastrada</p>}

      {tools.map(t => (
        <div key={t.id}>
          {t.name} - {t.responsible} - {t.expiry_date}
        </div>
      ))}
    </div>
  );
}
