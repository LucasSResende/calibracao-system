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
    } else {
      alert("Erro login");
    }
  };

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
      <h2>Sistema de Calibração</h2>

      <input onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input onChange={e => setResponsible(e.target.value)} placeholder="Responsável" />
      <input onChange={e => setDate(e.target.value)} type="date" />
      <input onChange={e => setMonths(e.target.value)} placeholder="Meses" />

      <button onClick={addTool}>Adicionar</button>

      {tools.map(t => (
        <div key={t.id}>
          {t.name} - {t.responsible} - {t.expiry_date}
        </div>
      ))}
    </div>
  );
}
``