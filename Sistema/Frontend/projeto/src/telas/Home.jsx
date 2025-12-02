import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h2>Home</h2>

      <ul>
        <li>
          <Link to="/produtos">Produtos</Link>
        </li>
        <li>
          <Link to="/estoque">Estoque</Link>
        </li>
        <li>
          <Link to="/usuarios">Usuários</Link>
        </li>
      </ul>
    </div>
  );
}
