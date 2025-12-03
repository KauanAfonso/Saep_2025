import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Schema de validação com Zod
const loginSchema = z.object({
  username: z.string().min(1, "O usuário é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", data);

      // Armazenando dados no LocalStorage
      localStorage.setItem("token", JSON.stringify(response.data.token)); // access/refresh
      localStorage.setItem("user", JSON.stringify(response.data.user)); // id, username, email

      console.log("Login realizado:", response.data);

      navigate("/"); // vai para a Home

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Usuário ou senha inválidos");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Usuário:</label>
          <input type="text" {...register("username")} />
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <div>
          <label>Senha:</label>
          <input type="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
