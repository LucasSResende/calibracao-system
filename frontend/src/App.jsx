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
    setTools(Array.isArray(data) ? data : []);
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

  // LOGIN
  if (!logged) {
    return (
      <div style={{
        height: "100vh",
        backgroundImage: "url('https://images.unsplash.com/photo-1528184039930-bd03972bd974')",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "rgba(0,0,50,0.85)",
          padding: 30,
          borderRadius: 10,
          color: "white",
          width: 280,
          textAlign: "center",
          boxShadow: "0px 4px 15px rgba(0,0,0,0.8)"
        }}>
          <h2>⚓ Login Naval</h2>

          <input
            placeholder="Usuário"
            onChange={e => setUser(e.target.value)}
            style={{ width: "100%", padding: 6 }}
          /><br /><br />

          <input
            type="password"
            placeholder="Senha"
            onChange={e => setPass(e.target.value)}
            style={{ width: "100%", padding: 6 }}
          /><br /><br />

          <button onClick={login} style={{
            background: "#1e40af",
            color: "white",
            padding: 8,
            border: "none",
            width: "100%"
          }}>
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // GRÁFICO
  const validCount = tools.filter(t => new Date(t.expiry_date) >= new Date()).length;
  const expiredCount = tools.filter(t => new Date(t.expiry_date) < new Date()).length;

  const chartData = {
    labels: ["OK", "Vencidos"],
    datasets: [
      {
        data: [validCount, expiredCount],
        backgroundColor: ["#22c55e", "#dc2626"]
      }
    ]
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      fontSize: 12,
      fontFamily: "Arial"
    }}>
      {/* TOPO */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        borderBottom: "1px solid #334155"
      }}>
        <strong>⚓ Sistema Naval</strong>
        <button onClick={logout} style={{
          background: "none",
          color: "white",
          border: "none"
        }}>
          Logout ⏻
        </button>
      </div>

      <div style={{ padding: 20 }}>

        {/* FORM + CHART */}
        <div style={{ display: "flex", gap: 20 }}>

          <div>
            <h4>Cadastro</h4>

            <input placeholder="Nome" onChange={e => setName(e.target.value)} /><br />
            <input placeholder="Responsável" onChange={e => setResponsible(e.target.value)} /><br />
            <input type="date" onChange={e => setDate(e.target.value)} /><br />
            <input placeholder="Meses" onChange={e => setMonths(e.target.value)} /><br />

            <button onClick={addTool}>Adicionar</button>
          </div>

          <div style={{ width: 200 }}>
            {tools.length > 0 && <Pie data={chartData} />}
          </div>

        </div>

        <br />

        {/* LISTA */}
        <h4>Ferramentas</h4>

        <div style={{
          background: "#1e293b",
          padding: 10,
          borderRadius: 5
        }}>
          {tools.map((t) => {
            const expired = new Date(t.expiry_date) < new Date();

            return (
              <div key={t.id} style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #334155",
                padding: "6px 0"
              }}>
                <span>{t.name}</span>
                <span>{t.responsible}</span>
                <span>{t.expiry_date}</span>
                <span style={{ color: expired ? "red" : "lightgreen" }}>
                  {expired ? "VENCIDO" : "OK"}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
