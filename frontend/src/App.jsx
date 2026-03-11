import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { supabase } from './supabaseClient'



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


function Button({count}) {
    return (       
      <>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </>
  )
}

function Button2({string}) {
    return (       
      <>
        <button>
            {string}
        </button>
      </>
  )
}


function App() {
  const [count, setCount] = useState(0)
  const user = {
      name: "John",
      age: 30
  };
  console.log("1")
  return (
    <>
      <TestConnection/>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button count={count}/>
        <Button2 string={user["name"]}/>
        <Button2 string={user["age"]}/>      
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
