import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const stockSchema = z.object({
  id_product: z.string().nonempty("Selecione um produto"),
  quantity: z.number().min(1, "Quantidade obrigatória"),
  min_quantity: z.number().min(1, "Quantidade mínima obrigatória"),
  movement: z.enum(["Entrada", "Saida"], { required_error: "Selecione a movimentação" })
});

export default function Estoque() {

  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  if(!userId) {
    alert("Você precisa estar logado.");
    navigate("/login");
  }

  const { register, handleSubmit, reset, setValue, formState: { errors }} = useForm({
    resolver: zodResolver(stockSchema)
  });

  const endpoint = "http://127.0.0.1:8000/api/stocks/";
  const product_endpoint = "http://127.0.0.1:8000/api/products/";
  const log_endpoint = "http://127.0.0.1:8000/api/logs/";

  async function load() {
    setStocks((await axios.get(endpoint)).data);
    setProducts((await axios.get(product_endpoint)).data);
  }

  useEffect(()=>{ load(); },[]);


  async function save(data) {

    const existing = stocks.find(s => s.id_product === Number(data.id_product));
    let newQuantity = existing ? existing.quantity : 0;

    if(data.movement === "Entrada") newQuantity += data.quantity;
    else if(data.movement === "Saida") newQuantity -= data.quantity;

    const payload = {
      id_product: Number(data.id_product),
      quantity: newQuantity,
      min_quantity: data.min_quantity,
      is_below_min: newQuantity < data.min_quantity
    };

    try{
      let stockResponse;

      if(editId){
        stockResponse = await axios.put(`${endpoint}${editId}/`, payload);
      } else {
        // se estoque do produto já existir, atualiza em vez de criar duplicado
        if(existing){
          stockResponse = await axios.put(`${endpoint}${existing.id}/`, payload);
        } else {
          stockResponse = await axios.post(endpoint, payload);
        }
      }

      // ---- CRIA LOG AUTOMATICAMENTE ----
      await axios.post(log_endpoint,{
        id_product:Number(data.id_product),
        status:data.movement,
        id_user:userId
      });

      alert("Movimentação registrada com LOG ✔");
      reset(); setEditId(null); load();

    }catch(e){
      console.error(e);
      alert("Erro ao salvar");
    }
  }


  function edit(item){
    setEditId(item.id);
    setValue("id_product", item.id_product.toString());
    setValue("quantity", 0);
    setValue("min_quantity", item.min_quantity);
  }

  async function remove(id){
    if(!confirm("Remover item?")) return;
    await axios.delete(`${endpoint}${id}/`);
    load();
  }


  return (
    <div className="container">

      <button onClick={()=>navigate("/")}>⬅ Voltar</button>
      <h2>Controle de Estoque</h2>

      <form onSubmit={handleSubmit(save)}>

        <select {...register("id_product")}>
          <option value="">Selecione o produto</option>
          {products.map(p=>(
            <option key={p.id} value={p.id}>{p.name} - {p.cod}</option>
          ))}
        </select>
        {errors.id_product && <p>{errors.id_product.message}</p>}

        <input type="number" placeholder="Quantidade" {...register("quantity",{valueAsNumber:true})}/>
        {errors.quantity && <p>{errors.quantity.message}</p>}

        <input type="number" placeholder="Qtd mínima" {...register("min_quantity",{valueAsNumber:true})}/>
        {errors.min_quantity && <p>{errors.min_quantity.message}</p>}

        <select {...register("movement")}>
          <option value="">Movimentação</option>
          <option value="Entrada">Entrada</option>
          <option value="Saida">Saida</option>
        </select>
        {errors.movement && <p>{errors.movement.message}</p>}

        <button type="submit">{editId ? "Atualizar" : "Registrar Movimentação"}</button>
        {editId && <button type="button" onClick={()=>{ reset(); setEditId(null)}}>Cancelar</button>}
      </form>


      {/* ==================== LISTA ==================== */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Mín</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {stocks.map(s=>(
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.product?.name}</td>
              <td>{s.quantity}</td>
              <td>{s.min_quantity}</td>
              <td>{s.is_below_min ? <span className="danger">⚠ Baixo</span> : "OK"}</td>
              <td>
                <button onClick={()=>edit(s)}>Editar</button>
                <button className="logout" onClick={()=>remove(s.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
