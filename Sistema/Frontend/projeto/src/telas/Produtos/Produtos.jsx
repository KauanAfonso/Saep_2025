import { useState, useEffect } from "react";
import axios from "axios";

export function Produtos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const product_endpoint = "http://127.0.0.1:8000/api/products/";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(product_endpoint);
        setProducts(response.data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        setError("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (id) => {
    alert(`Editar produto de ID: ${id}`);
    // Aqui você pode navegar para uma tela de edição ou abrir um modal
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await axios.delete(`${product_endpoint}${id}/`);
      setProducts(products.filter((p) => p.id !== id));
      alert("Produto excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      alert("Erro ao excluir produto");
    }
  };

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Lista de Produtos</h2>
      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Código</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.name}</td>
              <td>{prod.cod}</td>
              <td>{prod.description}</td>
              <td>
                <button onClick={() => handleEdit(prod.id)}>Editar</button>
                <button onClick={() => handleDelete(prod.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
