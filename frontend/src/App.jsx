import { useState, useEffect } from "react";

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

    const res = await fetch("http://127.0.0.1:8000/login", {
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

    const res = await fetch("http://127.0.0.1:8000/tools", {
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
      `http://127.0.0.1:8000/tools?name=${name}&responsible=${responsible}&entry_date=${date}&months=${months}`,
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
        <input placeholder="Usuário" onChange={e => setUser(e.target.value)} />
        <input type="password" placeholder="Senha" onChange={e => setPass(e.target.value)} />
        <button onClick={login}>Entrar</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Sistema de Calibração</h2>

      <input placeholder="Nome" onChange={e => setName(e.target.value)} />
      <input placeholder="Responsável" onChange={e => setResponsible(e.target.value)} />
      <input type="date" onChange={e => setDate(e.target.value)} />
      <input placeholder="Meses" onChange={e => setMonths(e.target.value)} />

      <button onClick={addTool}>Adicionar</button>

      {tools.map(t => (
        <div key={t.id}>
          {t.name} - {t.responsible} - {t.expiry_date}
        </div>
      ))}
    </div>
  );
}