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
      <div style={{
        minHeight: "100vh",
        backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.9)",
          padding: "30px",
          borderRadius: "10px",
          width: "300px",
          textAlign: "center"
        }}>
          <h2>⚓ Login</h2>

          <input
            placeholder="Usuário"
            onChange={e => setUser(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
          <br /><br />

          <input
            type="password"
            placeholder="Senha"
            onChange={e => setPass(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
          <br /><br />

          <button
            onClick={login}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px",
              width: "100%",
              borderRadius: "5px"
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }


  return (
    <div style={{
      display: "flex",
      height: "100vh",
      fontFamily: "Arial"
    }}>

      {/* 🌊 MENU LATERAL */}
      <div style={{
        width: "250px",
        backgroundColor: "#1e3a8a",
        color: "white",
        padding: "20px"
      }}>
        <h2>⚓ Sistema</h2>

        <p style={{ marginTop: "20px" }}>Usuário logado</p>

        <button
          onClick={logout}
          style={{
            marginTop: "20px",
            background: "white",
            color: "#1e3a8a",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            width: "100%",
            cursor: "pointer"
          }}
        >
          Sair
        </button>
      </div>

      {/* 📊 CONTEÚDO PRINCIPAL */}
      <div style={{
        flex: 1,
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
        backgroundSize: "cover",
        padding: "30px"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.9)",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <h2>Sistema de Calibração</h2>

          {/* FORMULÁRIO */}
          <div style={{ marginBottom: "20px" }}>
            <input
              placeholder="Nome"
              onChange={e => setName(e.target.value)}
            />
            <br /><br />

            <input
              placeholder="Responsável"
              onChange={e => setResponsible(e.target.value)}
            />
            <br /><br />

            <input
              type="date"
              onChange={e => setDate(e.target.value)}
            />
            <br /><br />

            <input
              placeholder="Meses"
              onChange={e => setMonths(e.target.value)}
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
                cursor: "pointer"
              }}
            >
              ⚓ Adicionar Ferramenta
            </button>
          </div>

          {/* LISTA */}
          <h3>Ferramentas</h3>

          {tools.length === 0 && (
            <p>Nenhuma ferramenta cadastrada</p>
          )}

          {tools.map(t => (
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
              <strong>{t.name}</strong><br />
              Responsável: {t.responsible}<br />
              Expira em: {t.expiry_date}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
