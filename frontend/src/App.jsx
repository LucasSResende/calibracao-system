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


  const login = async () => {
    console.log("clicou login");

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
    console.log("resposta backend:", data);

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

  const deleteSelected = async () => {
    if (selectedTools.length === 0) {
      alert("Selecione pelo menos um item");
      return;
    }

    const confirmar = window.confirm("Deseja apagar os itens selecionados?");
    if (!confirmar) return;

    const token = localStorage.getItem("token");

    try {
      for (const id of selectedTools) {
        console.log("deletando:", id);

        const res = await fetch(`${API}/tools/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("status:", res.status);

        if (!res.ok) {
          const error = await res.text();
          console.error("erro backend:", error);
          alert("Erro ao deletar item: " + id);
          return;
        }
      }

      alert("Itens deletados com sucesso ✅");

      setSelectedTools([]);
      setDeleteMode(false);
      await loadTools(); // ✅ importante usar await

    } catch (err) {
      console.error("erro geral:", err);
      alert("Erro na conexão com backend");
    }
  };

  const toggleSelect = (id) => {
    if (selectedTools.includes(id)) {
      setSelectedTools(selectedTools.filter(t => t !== id));
    } else {
      setSelectedTools([...selectedTools, id]);
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
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Arial"
    }}>

      {/* MENU LATERAL */}
      <div style={{
        width: "250px",
        backgroundColor: "#1e3a8a",
        color: "white",
        padding: "20px"
      }}>
        <h2>⚓ Sistema</h2>
        <p style={{ marginTop: "20px" }}>Dashboard</p>
      </div>

      {/* CONTEÚDO */}
      <div style={{
        flex: 1,
        background: "linear-gradient(to bottom, #e0f2fe, #f8fafc)",
        padding: "30px",
        overflowY: "auto"
      }}>

        {/* TOPO DIREITO */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end"
        }}>
          <button
            onClick={logout}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer"
            }}
            title="Sair"
          >
            ⏻
          </button>
        </div>

        <h2>Sistema de Calibração</h2>

        {/* GRID */}
        <div style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start"
        }}>

          {/* FORMULÁRIO */}
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
              ⚓ Adicionar
            </button>
          </div>

          {/* GRÁFICO */}
          <div style={{
            width: "250px",
            background: "white",
            padding: "10px",
            borderRadius: "10px"
          }}>
            <h4>Resumo</h4>
            {tools.length > 0 && <Pie data={chartData} />}
          </div>

        </div>

        <br />

        {/* LISTA */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <h3>Ferramentas</h3>

          {tools.length === 0 && (
            <p>Nenhuma ferramenta cadastrada</p>
          )}

          {tools.map(t => {
            const expiry = new Date(t.expiry_date);
            const expired = expiry < new Date();

            return (
              <div
                key={t.id}
                style={{
                  background: expired ? "#fee2e2" : "#dcfce7",
                  padding: "12px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  border: expired ? "1px solid red" : "1px solid green"
                }}
              >
                <strong>{t.name}</strong><br />
                Responsável: {t.responsible}<br />
                Expira em: {t.expiry_date}<br />

                <span>
                  {expired ? "🔴 VENCIDO" : "🟢 EM DIA"}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
