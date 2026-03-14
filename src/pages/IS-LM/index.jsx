import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './style.css';

const IsLmPage = () => {
  // Parâmetros da Equação IS (Imagem 1: r = (c0+A+G)/a - [(sy+cy*ty)/a]*y)
  const [is, setIs] = useState({
    c0: 40,      // Consumo autônomo
    a_aut: 60,   // Investimento autônomo (A)
    g: 80,       // Gastos do governo
    sy: 0.2,     // Propensão a poupar
    cy: 0.7,     // Propensão a consumir
    ty: 0.2,     // Alíquota de impostos
    a: 15        // Sensibilidade do investimento aos juros (Divisor)
  });

  // Parâmetros da Equação LM (Imagem 2: i = (l_aut - ms_p)/li + [1/(li*vr)]*y)
  const [lm, setLm] = useState({
    l_aut: 120,  // Procura autônoma por moeda
    ms_p: 100,   // Oferta real de moeda
    vr: 0.4,     // Sensibilidade da procura de moeda à renda (V)
    li: 12       // Sensibilidade da procura de moeda aos juros (Divisor)
  });

  const { dados, multiplicador } = useMemo(() => {
    const pontos = [];
    const maxRenda = 1200;
    
    // Cálculo do Multiplicador Keynesiano: 1 / (sy + cy*ty)
    const m = 1 / (is.sy + (is.cy * is.ty));

    for (let y = 0; y <= maxRenda; y += 20) {
      let ponto = { y: y };

      // FÓRMULA IS: r = (c0 + A + G)/a - [ (sy + cy*ty)/a ] * Y
      const interceptoIS = (is.c0 + is.a_aut + is.g) / is.a;
      const inclinacaoIS = (is.sy + (is.cy * is.ty)) / is.a;
      const r_is = interceptoIS - (inclinacaoIS * y);
      ponto.IS = r_is >= 0 ? Number(r_is.toFixed(2)) : null;

      // FÓRMULA LM: i = (l_aut - ms_p)/li + [ 1 / (li * vr) ] * Y
      const interceptoLM = (lm.l_aut - lm.ms_p) / lm.li;
      const inclinacaoLM = 1 / (lm.li * lm.vr);
      const i_lm = interceptoLM + (inclinacaoLM * y);
      ponto.LM = i_lm >= 0 ? Number(i_lm.toFixed(2)) : null;

      pontos.push(ponto);
    }
    return { dados: pontos, multiplicador: m };
  }, [is, lm]);

  return (
    <div className="page-container">
      <aside className="sidebar">
        <h3>Variáveis das Equações</h3>
        
        <div className="card-curva" style={{background: '#eff6ff', border: '1px solid #bfdbfe', marginBottom: '20px'}}>
           <small style={{color: '#1e40af', fontWeight: 'bold'}}>Multiplicador Keynesiano (k):</small>
           <h2 style={{color: '#1e40af', margin: '5px 0'}}>{multiplicador.toFixed(2)}</h2>
        </div>

        {/* MERCADO DE BENS (IS) */}
        <div className="section-header"><strong>Equação IS (Imagem I)</strong></div>
        <div className="card-curva">
          <div className="grid-inputs">
            <div className="input-group">
              <label>Gastos (G)</label>
              <input type="number" className="input-field" value={is.g} onChange={e => setIs({...is, g: Number(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>Sensib. (a)</label>
              <input type="number" className="input-field" value={is.a} onChange={e => setIs({...is, a: Number(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>Imposto (t)</label>
              <input type="number" step="0.05" className="input-field" value={is.ty} onChange={e => setIs({...is, ty: Number(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>Consumo (c0)</label>
              <input type="number" className="input-field" value={is.c0} onChange={e => setIs({...is, c0: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        {/* MERCADO MONETÁRIO (LM) */}
        <div className="section-header"><strong>Equação LM (Imagem II)</strong></div>
        <div className="card-curva">
          <div className="grid-inputs">
            <div className="input-group">
              <label>Oferta (M/P)</label>
              <input type="number" className="input-field" value={lm.ms_p} onChange={e => setLm({...lm, ms_p: Number(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>Sensib. (li)</label>
              <input type="number" className="input-field" value={lm.li} onChange={e => setLm({...lm, li: Number(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>V. Renda (vr)</label>
              <input type="number" step="0.1" className="input-field" value={lm.vr} onChange={e => setLm({...lm, vr: Number(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>L. Auton (l)</label>
              <input type="number" className="input-field" value={lm.l_aut} onChange={e => setLm({...lm, l_aut: Number(e.target.value)})} />
            </div>
          </div>
        </div>
      </aside>

      <main className="chart-container">
        <div className="chart-wrapper" style={{ minHeight: '550px', background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dados} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f1f5f9" />
              <XAxis dataKey="y" type="number" domain={[0, 1200]} tick={{fontSize: 12}} label={{ value: 'Renda (Y)', position: 'insideBottomRight', offset: -5 }} />
              <YAxis domain={[0, 25]} tick={{fontSize: 12}} label={{ value: 'Juros (i)', angle: -90, position: 'insideLeft', offset: 15 }} />
              <Tooltip />
              <Legend verticalAlign="top" height={40}/>
              <Line name="Curva IS" type="linear" dataKey="IS" stroke="#4f46e5" strokeWidth={4} dot={false} isAnimationActive={false} />
              <Line name="Curva LM" type="linear" dataKey="LM" stroke="#dc2626" strokeWidth={4} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default IsLmPage;