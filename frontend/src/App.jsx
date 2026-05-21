import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale);

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

    for (let id of selectedTools) {
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
    if (selectedTools.includes(id)) {
      setSelectedTools(selectedTools.filter(t => t !== id));
    } else {
      setSelectedTools([...selectedTools, id]);
    }
  };
  ``

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
        label: "Status das ferramentas",
        data: [validCount, expiredCount],
        backgroundColor: ["green", "red"]
      }
    ]
  };


  return (
    <div style={{
      display: "flex",
      height: "100vh",
      fontFamily: "Arial"
    }}>

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
          Logout
        </button>
      </div>

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

          <h3>📊 Resumo</h3>
          <div style={{ background: "white", padding: "10px", borderRadius: "10px" }}>
            <Bar data={chartData} />
          </div>
          <br />

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

          {/* BOTÃO PRINCIPAL */}
          <div style={{ marginBottom: "10px" }}>
            <button
              onClick={() => setDeleteMode(!deleteMode)}
              style={{
                backgroundColor: "orange",
                color: "white",
                padding: "8px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              🗑️ {deleteMode ? "Cancelar" : "Modo deletar"}
            </button>

            {deleteMode && (
              <button
                onClick={deleteSelected}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "red",
                  color: "white",
                  padding: "8px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                ✅ Confirmar exclusão
              </button>
            )}
          </div>

          {/* LISTA */}
          {tools.map(t => {
            const today = new Date();
            const expiry = new Date(t.expiry_date);
            const expired = expiry < today;

            return (
              <div key={t.id} style={{
                background: expired ? "#fee2e2" : "#dcfce7",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "6px",
                border: expired ? "1px solid red" : "1px solid green"
              }}>

                {deleteMode && (
                  <input
                    type="checkbox"
                    checked={selectedTools.includes(t.id)}
                    onChange={() => toggleSelect(t.id)}
                  />
                )}

                <strong>{t.name}</strong><br />
                Responsável: {t.responsible}<br />
                Expira em: {t.expiry_date}<br />

                <span style={{ fontWeight: "bold" }}>
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
