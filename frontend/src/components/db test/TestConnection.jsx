import { useEffect, useState } from 'react'

import { supabase } from './../../supabaseClient'


function TestConnection() {
  const [firstItem, setFirstItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFirstItem() {
      try {
        // Запрос: берём первую запись из таблицы todos
        const { data, error } = await supabase
          .from('schedule')
          .select('*')
          .limit(1)
          .single(); // .single() гарантирует, что вернётся один объект, а не массив

        if (error) throw error;
        setFirstItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFirstItem();
  }, []);

  if (loading) return <div>Проверка подключения...</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid green' }}>
      <h3>✅ Подключение работает!</h3>
      <p>Первый элемент в таблице <strong>todos</strong>:</p>
      <pre>{JSON.stringify(firstItem, null, 2)}</pre>
    </div>
  );
}

export default TestConnection
