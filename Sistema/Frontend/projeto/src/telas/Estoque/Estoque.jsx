import React, { useEffect, useState } from "react";
import axios from "axios";

export function Estoque() {
  const [stocks, setStocks] = useState([]);

  const get_stock = async () =>{
    await axios.get("http://127.0.0.1:8000/api/stocks/") // ajuste a URL se necessário
      .then((res) => {
        console.log(res.data)
        setStocks(res.data);
      })
      .catch((err) => {
        console.error("Erro ao carregar estoque:", err);
      });
  }  

  useEffect(() => {
    get_stock()
  }, []);

  const handleEdit = (id) => {
    console.log("Editar stock:", id);
  };

  const handleDelete = (id) => {
    console.log("Excluir stock:", id);
  };

  return (
    <div>
      <h2>Lista de Estoque</h2>

      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome Produto</th>
            <th>Código</th>
            <th>Quantidade</th>
            <th>Qtd Mínima</th>
            <th>Abaixo do mínimo?</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.product?.name}</td>
              <td>{item.product?.cod}</td>
              <td>{item.quantity}</td>
              <td>{item.min_quantity}</td>
              <td>{item.is_below ? "Sim" : "Não"}</td>
              <td>
                <button onClick={() => handleEdit(item.id)}>Editar</button>
                <button onClick={() => handleDelete(item.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
