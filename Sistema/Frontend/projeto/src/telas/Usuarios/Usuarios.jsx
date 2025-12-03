import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

// --- VALIDAÇÃO ZOD ---
const userSchema = z.object({
  username: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
  email: z.string().email("Email inválido."),
  password: z.string().min(4, "A senha deve ter no mínimo 4 caracteres.").optional(),
});

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // <<— BOTÃO VOLTAR
  const endpoint = "http://127.0.0.1:8000/api/users/";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { username: "", email: "", password: "" }
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const response = await axios.get(endpoint);
      setUsuarios(response.data);
    } catch {
      alert("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  async function salvarUsuario(data) {
    try {
      if (editId) {
        await axios.put(endpoint + editId + "/", data);
        alert("Usuário atualizado!");
      } else {
        await axios.post(endpoint, data);
        alert("Usuário criado!");
      }

      reset();
      setEditId(null);
      carregarUsuarios();
    } catch {
      alert("Erro ao salvar usuário");
    }
  }

  function editarUsuario(user) {
    setEditId(user.id);
    reset({ username: user.username, email: user.email, password: "" });
  }

  async function excluirUsuario(id) {
    if (!window.confirm("Deseja realmente excluir?")) return;

    try {
      await axios.delete(endpoint + id + "/");
      alert("Usuário deletado");
      carregarUsuarios();
    } catch {
      alert("Erro ao excluir");
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
  <div className="container">

    <button onClick={() => navigate("/")} className="back-btn">⬅ Voltar</button>

    <h2>Gerenciar Usuários</h2>

    {/* FORM */}
    <form onSubmit={handleSubmit(salvarUsuario)}>
      <input placeholder="Nome" {...register("username")} />
      {errors.username && <p>{errors.username.message}</p>}

      <input placeholder="Email" {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" placeholder="Senha" {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">{editId ? "Salvar Alterações" : "Cadastrar"}</button>
      {editId && <button type="button" onClick={() => {reset(); setEditId(null);}}>Cancelar</button>}
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        {usuarios.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>
              <button onClick={() => editarUsuario(user)}>Editar</button>
              <button className="delete" onClick={() => excluirUsuario(user.id)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>
);

}
