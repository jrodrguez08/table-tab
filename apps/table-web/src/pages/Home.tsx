import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  return (
    <div style={{ padding: 16, maxWidth: 520, margin: '0 auto' }}>
      <h1>TableTap</h1>
      <p>Pega el publicCode del QR para abrir el menú.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!code.trim()) return;
          navigate(`/t/${encodeURIComponent(code.trim())}`);
        }}
      >
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ej: TBL-LABIRRA-M1"
          style={{ width: '100%', padding: 10, fontSize: 16 }}
        />
        <button style={{ marginTop: 12, padding: 10, width: '100%', fontSize: 16 }}>
          Abrir menú
        </button>
      </form>
    </div>
  );
}
