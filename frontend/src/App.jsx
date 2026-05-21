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
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "Arial",
        padding: "30px"
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "600px",
          margin: "auto"
        }}
      >
        {/* 🔝 TOPO */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#1e3a8a",
            color: "white",
            padding: "10px",
            borderRadius: "5px"
          }}
        >
          <strong>⚓ Sistema de Calibração</strong>
          <button
            onClick={logout}
            style={{
              background: "white",
              color: "#1e3a8a",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Sair
          </button>
        </div>

        <br />

        {/* 📥 INPUTS */}
        <input
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Responsável"
          onChange={(e) => setResponsible(e.target.value)}
        />
        <br /><br />

        <input
          type="date"
          onChange={(e) => setDate(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Meses"
          onChange={(e) => setMonths(e.target.value)}
        />
        <br /><br />

        <button
          onClick={addTool}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%"
          }}
        >
          ⚓ Adicionar Ferramenta
        </button>

        <br /><br />

        {/* 📋 LISTA */}
        <h3>Ferramentas</h3>

        {tools.length === 0 && (
          <p>Nenhuma ferramenta cadastrada</p>
        )}

        {tools.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#f0f9ff",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #bae6fd"
            }}
          >
            <strong>{t.name}</strong>
            <br />
            Responsável: {t.responsible}
            <br />
            Expira em: {t.expiry_date}
          </div>
        ))}
      </div>
    </div>
  );
}
