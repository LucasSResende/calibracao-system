import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

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

  // LOGIN
  const login = async () => {
    const formData = new URLSearchParams();
    formData.append("username", user);
    formData.append("password", pass);

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
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

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setLogged(false);
  };

  // LOAD TOOLS
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

  // ADD TOOL
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

  // AUTH
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLogged(true);
      loadTools();
    }
  }, []);

  // LOGIN SCREEN
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

          <button onClick={login}>Entrar</button>
        </div>
      </div>
    );
  }

  const validCount = Array.isArray(tools)
    ? tools.filter(t => t.expiry_date && new Date(t.expiry_date) >= new Date()).length
    : 0;

  const expiredCount = Array.isArray(tools)
    ? tools.filter(t => t.expiry_date && new Date(t.expiry_date) < new Date()).length
    : 0;

  const chartData = {
    labels: ["Em dia", "Vencidas"],
    datasets: [
      {
        data: [validCount, expiredCount],
        backgroundColor: ["#22c55e", "#ef4444"]
      }
    ]
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Arial"
    }}>

      {/* MENU */}
      <div style={{
        width: "250px",
        backgroundColor: "#1e3a8a",
        color: "white",
        padding: "20px"
      }}>
        <h2>⚓ Sistema</h2>
        <p>Dashboard</p>
      </div>

      {/* CONTENT */}
      <div style={{
        flex: 1,
        background: "linear-gradient(to bottom, #e0f2fe, #f8fafc)",
        padding: "30px",
        overflowY: "auto"
      }}>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={logout}>⏻</button>
        </div>

        <h2>Sistema de Calibração</h2>

        {/* GRID */}
        <div style={{ display: "flex", gap: "20px" }}>

          {/* FORM */}
          <div style={{
            flex: 1,
            background: "white",
            padding: "20px",
            borderRadius: "10px"
          }}>
            <h3>Adicionar ferramenta</h3>

            <input placeholder="Nome" onChange={e => setName(e.target.value)} />
            <br /><br />

            <input placeholder="Responsável" onChange={e => setResponsible(e.target.value)} />
            <br /><br />

            <input type="date" onChange={e => setDate(e.target.value)} />
            <br /><br />

            <input placeholder="Meses" onChange={e => setMonths(e.target.value)} />
            <br /><br />

            <button onClick={addTool}>Adicionar</button>
          </div>

          {/* CHART */}
          <div style={{
            width: "250px",
            background: "white",
            padding: "10px",
            borderRadius: "10px"
          }}>
            <h4>Resumo</h4>

            {tools.length > 0 ? (
              <Pie data={chartData} />
            ) : (
              <p>Sem dados</p>
            )}
          </div>

        </div>

        <br />

        {/* LIST */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <h3>Ferramentas</h3>

          {tools.length === 0 && (
            <p>Nenhuma ferramenta cadastrada</p>
          )}

          {Array.isArray(tools) && tools.map(t => {
            const expiry = t.expiry_date ? new Date(t.expiry_date) : new Date();
            const expired = expiry < new Date();

            return (
              <div
                key={t.id}
                style={{
                  background: expired ? "#fee2e2" : "#dcfce7",
                  padding: "12px",
                  marginBottom: "10px",
                  borderRadius: "6px"
                }}
              >
                <strong>{t.name}</strong><br />
                {t.responsible}<br />
                {t.expiry_date}<br />

                {expired ? "🔴 VENCIDO" : "🟢 OK"}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}