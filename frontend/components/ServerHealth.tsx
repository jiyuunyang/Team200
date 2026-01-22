import { getHealth, postEcho, getMlHealth } from '../api/health.api';
import { useEffect, useState } from 'react';

export function ServerHealth() {
  const [health, setHealth] = useState(null);
  const [echo, setEcho] = useState(null);
  const [mlHealth, setMlHealth] = useState(null);

  useEffect(() => {
    getHealth().then(setHealth).catch(console.error);
    getMlHealth().then(setMlHealth).catch(console.error);
  }, []);

  const sendEcho = async () => {
    const res = await postEcho({
      message: 'hello backend',
      at: new Date().toISOString(),
    });
    setEcho(res);
  };

  return (
    <div>
      서빙 서버 상태
      <pre>{JSON.stringify(health, null, 2)}</pre>
      <button onClick={sendEcho}>Echo</button>
      <pre>{JSON.stringify(echo, null, 2)}</pre>
      ML 서버 상태
      <pre>{JSON.stringify(mlHealth, null, 2)}</pre>
    </div>
  );
}
