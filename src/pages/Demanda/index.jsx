import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './style.css';

const DemandaPage = () => {
  const [curvas, setCurvas] = useState([
    { id: 1, a: 100, b: 2, nome: "Demanda Base", cor: "#2563eb" }
  ]);

  const adicionarCurva = () => {
    const cores = ["#2563eb", "#dc2626", "#059669", "#7c3aed", "#ea580c"];
    const nova = { 
      id: Date.now(), 
      a: 100, 
      b: 2, 
      nome: `Demanda ${curvas.length + 1}`,
      cor: cores[curvas.length % cores.length]
    };
    setCurvas([...curvas, nova]);
  };

  const removerCurva = (id) => {
    if (curvas.length > 1) setCurvas(curvas.filter(c => c.id !== id));
  };

  const dados = useMemo(() => {
    const pontos = [];
    const maxA = Math.max(...curvas.map(c => c.a), 10);
    const limitePreco = maxA * 1.2;

    for (let p = 0; p <= limitePreco; p += limitePreco / 100) {
      let ponto = { preco: Number(p.toFixed(2)) };
      curvas.forEach(c => {
        const q = c.a - (c.b * p);
        ponto[c.nome] = q >= 0 ? Number(q.toFixed(2)) : null;
      });
      pontos.push(ponto);
    }
    return pontos;
  }, [curvas]);

  return (
    <div className="page-container">
      <aside className="sidebar">
        <h3>Análise de Demanda</h3>
        <button className="btn-add" onClick={adicionarCurva}>+ Nova Curva</button>
        {curvas.map(c => (
          <div key={c.id} className="card-curva">
            <div className="card-header">
              <input 
                className="input-nome" 
                style={{ color: c.cor }} 
                value={c.nome} 
                onChange={(e) => setCurvas(curvas.map(i => i.id === c.id ? {...i, nome: e.target.value} : i))}
              />
              <button className="btn-remove" onClick={() => removerCurva(c.id)}>✕</button>
            </div>
            <div className="grid-inputs">
              <div className="input-group">
                <label>Intercepto (a)</label>
                <input type="number" className="input-field" value={c.a} onChange={e => setCurvas(curvas.map(i => i.id === c.id ? {...i, a: Number(e.target.value)} : i))} />
              </div>
              <div className="input-group">
                <label>Inclinação (b)</label>
                <input type="number" className="input-field" value={c.b} onChange={e => setCurvas(curvas.map(i => i.id === c.id ? {...i, b: Number(e.target.value)} : i))} />
              </div>
            </div>
          </div>
        ))}
      </aside>

      <main className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="preco" type="number" domain={[0, 'auto']} label={{ value: 'Preço (P)', position: 'insideBottomRight', offset: -10 }} />
            <YAxis type="number" domain={[0, 'auto']} label={{ value: 'Quantidade (Q)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {curvas.map(c => (
              <Line key={c.id} name={c.nome} type="monotone" dataKey={c.nome} stroke={c.cor} strokeWidth={4} dot={false} connectNulls={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </main>
    </div>
  );
};

export default DemandaPage;