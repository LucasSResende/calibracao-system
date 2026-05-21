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

  // LOAD
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

  // ADD
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

  // DELETE
  const deleteSelected = async () => {
    if (selectedTools.length === 0) {
      alert("Selecione itens");
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
          background: "rgba(0,0,50,0.9)",
          padding: 30,
          borderRadius: 10,
          width: 280,
          color: "white",
          textAlign: "center"
        }}>
          <h2>⚓ Login Naval</h2>

          <input placeholder="Usuário" onChange={e => setUser(e.target.value)} /><br /><br />
          <input type="password" placeholder="Senha" onChange={e => setPass(e.target.value)} /><br /><br />

          <button onClick={login}>Entrar</button>
        </div>
      </div>
    );
  }

  const valid = tools.filter(t => new Date(t.expiry_date) >= new Date()).length;
  const expired = tools.filter(t => new Date(t.expiry_date) < new Date()).length;

  const chartData = {
    labels: ["OK", "Vencidos"],
    datasets: [{
      data: [valid, expired],
      backgroundColor: ["green", "red"]
    }]
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "#0f172a",
      color: "white",
      fontSize: 12,
      display: "flex",
      flexDirection: "column"
    }}>

      {/* TOPO */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: 10,
        borderBottom: "1px solid #334155"
      }}>
        <strong>⚓ Sistema Naval</strong>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setDeleteMode(!deleteMode)}>
            🗑️ {deleteMode ? "Cancelar" : "Excluir"}
          </button>

          {deleteMode && (
            <button onClick={deleteSelected}>
              Confirmar
            </button>
          )}

          <button onClick={logout}>
            Logout ⏻
          </button>
        </div>
      </div>

      <div style={{
        padding: 20,
        width: "100%",
        maxWidth: "100%"
      }}>

        {/* FORM + CHART */}
        <div style={{
          display: "flex",
          gap: 20,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}>

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
          width: "100%"
        }}>

          {tools.map(t => {
            const expired = new Date(t.expiry_date) < new Date();

            return (
              <div key={t.id} style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #334155",
                padding: "5px"
              }}>
                <div style={{ display: "flex", gap: 5 }}>

                  {deleteMode && (
                    <input
                      type="checkbox"
                      checked={selectedTools.includes(t.id)}
                      onChange={() => toggleSelect(t.id)}
                    />
                  )}

                  <span>{t.name}</span>
                </div>

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
