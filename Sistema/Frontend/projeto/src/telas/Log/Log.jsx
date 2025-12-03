import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Log() {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  const endpoint = "http://127.0.0.1:8000/api/logs/";

  async function loadLogs() {
    try {
      const response = await axios.get(endpoint);
      setLogs(response.data);
    } catch {
      alert("Erro ao carregar logs");
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="container"> {/* <- estilização aplicada */}
      
      <button onClick={() => navigate("/")}>⬅ Voltar</button>
      <h2>Histórico de Movimentações</h2>

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Status</th>
            <th>Usuário</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.product_detail?.name}</td>      {/* NOME DO PRODUTO */}
                <td>{log.status}</td>
                <td>{log.user_detail?.username}</td>     {/* NOME DO USUÁRIO */}
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nenhum log registrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
