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

  const [selectedTools, setSelectedTools] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);

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
    setTools(Array.isArray(data) ? data : []);
  };

  // ADD TOOL
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

  // DELETE SELECIONADOS ✅
  const deleteSelected = async () => {
    if (selectedTools.length === 0) {
      alert("Selecione itens para excluir");
      return;
    }

    if (!window.confirm("Confirmar exclusão?")) return;

    const token = localStorage.getItem("token");

    for (const id of selectedTools) {
      await fetch(`${API}/tools/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    setSelectedTools([]);
    setDeleteMode(false);
    loadTools();
  };

  // SELEÇÃO CHECKBOX
  const toggleSelect = (id) => {
    setSelectedTools(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

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
        height: "100vh",
        background: "#e0f2fe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "white",
          padding: 30,
          borderRadius: 10,
          width: 300
        }}>
          <h2>⚓ Login</h2>

          <input placeholder="Usuário" onChange={e => setUser(e.target.value)} />
          <br /><br />
          <input type="password" placeholder="Senha" onChange={e => setPass(e.target.value)} />
          <br /><br />

          <button onClick={login}>Entrar</button>
        </div>
      </div>
    );
  }

  // CHART
  const validCount = tools.filter(t => new Date(t.expiry_date) >= new Date()).length;
  const expiredCount = tools.filter(t => new Date(t.expiry_date) < new Date()).length;

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
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>

      {/* MENU */}
      <div style={{
        width: 220,
        background: "#1e3a8a",
        color: "white",
        padding: 20
      }}>
        <h2>⚓ Sistema</h2>
      </div>

      {/* CONTEÚDO */}
      <div style={{ flex: 1, padding: 20, background: "#f1f5f9" }}>

        {/* TOPO */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={() => setDeleteMode(!deleteMode)}>
            🗑️ {deleteMode ? "Cancelar" : "Excluir"}
          </button>

          {deleteMode && (
            <button onClick={deleteSelected} style={{ background: "red", color: "white" }}>
              Confirmar
            </button>
          )}

          <button onClick={logout}>
            Logout ⏻
          </button>
        </div>

        <h2>Sistema de Calibração</h2>

        {/* GRID */}
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <h3>Adicionar ferramenta</h3>

            <input placeholder="Nome" onChange={e => setName(e.target.value)} /><br /><br />
            <input placeholder="Responsável" onChange={e => setResponsible(e.target.value)} /><br /><br />
            <input type="date" onChange={e => setDate(e.target.value)} /><br /><br />
            <input placeholder="Meses" onChange={e => setMonths(e.target.value)} /><br /><br />

            <button onClick={addTool}>Adicionar</button>
          </div>

          <div style={{ width: 200 }}>
            {tools.length > 0 && <Pie data={chartData} />}
          </div>
        </div>

        <br />

        {/* LISTA */}
        <h3>Ferramentas</h3>

        {tools.map(t => {
          const expired = new Date(t.expiry_date) < new Date();

          return (
            <div key={t.id} style={{
              background: "white",
              padding: 10,
              marginBottom: 10,
              borderLeft: `5px solid ${expired ? "red" : "green"}`
            }}>
              {deleteMode && (
                <input
                  type="checkbox"
                  checked={selectedTools.includes(t.id)}
                  onChange={() => toggleSelect(t.id)}
                />
              )}

              <strong>{t.name}</strong><br />
              {t.responsible}<br />
              {t.expiry_date}<br />
              {expired ? "🔴 VENCIDO" : "🟢 OK"}
            </div>
          );
        })}
      </div>
    </div>
  );
}
