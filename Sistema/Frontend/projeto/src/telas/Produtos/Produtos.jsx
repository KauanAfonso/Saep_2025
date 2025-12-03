import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

// Validação Zod
const productSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  cod: z.string().min(1, "Código obrigatório"),
  description: z.string().optional(),
});

export default function Produtos() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const endpoint = "http://127.0.0.1:8000/api/products/";

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", cod: "", description: "" }
  });

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts(filterName) {
    setLoading(true);
    try {
      const url = filterName ? `${endpoint}?name=${filterName}` : endpoint;
      const res = await axios.get(url);
      setProducts(res.data);
    } catch {
      alert("Erro ao carregar produtos");
    }
    setLoading(false);
  }

  async function saveProduct(data) {
    try {
      if (editingId) {
        await axios.put(`${endpoint}${editingId}/`, data);
        alert("Produto atualizado!");
      } else {
        await axios.post(endpoint, data);
        alert("Produto criado!");
      }
      reset();
      setEditingId(null);
      loadProducts();
    } catch {
      alert("Erro ao salvar produto");
    }
  }

  function editProduct(prod) {
    setEditingId(prod.id);
    reset(prod);
  }

  async function deleteProduct(id) {
    if (!confirm("Deseja realmente excluir?")) return;
    try {
      await axios.delete(`${endpoint}${id}/`);
      alert("Excluído!");
      loadProducts();
    } catch {
      alert("Erro ao excluir");
    }
  }

  function cancelEdit() {
    reset();
    setEditingId(null);
  }

  async function handleSearch() {
    loadProducts(search.trim());
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="container">

      <Link to="/">
        <button>⬅ Voltar</button>
      </Link>

      <h2>Gerenciar Produtos</h2>

      {/* 🔎 BUSCA */}
      <div className="search">
        <input
          placeholder="Pesquisar por nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
        <button onClick={() => { setSearch(""); loadProducts(); }}>Limpar</button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(saveProduct)}>
        <input placeholder="Nome" {...register("name")} />
        {errors.name && <p style={{color:"red"}}>{errors.name.message}</p>}

        <input placeholder="Código" {...register("cod")} />
        {errors.cod && <p style={{color:"red"}}>{errors.cod.message}</p>}

        <input placeholder="Descrição" {...register("description")} />

        <button type="submit">{editingId ? "Atualizar" : "Cadastrar"}</button>
        {editingId && <button onClick={cancelEdit}>Cancelar</button>}
      </form>

      <table>
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
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.cod}</td>
              <td>{p.description}</td>
              <td>
                <button onClick={() => editProduct(p)}>Editar</button>
                <button className="logout" onClick={() => deleteProduct(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
