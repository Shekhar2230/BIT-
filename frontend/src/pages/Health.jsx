import { useEffect, useState } from "react";
import axios from "axios";

export default function Health() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:4000/api/health";

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await axios.get(API_URL);
        setHealth(res.data);
      } catch (err) {
        setError("Server not reachable");
      } finally {
        setLoading(false);
      }
    }

    fetchHealth();
  }, []);

  if (loading) return <p className="text-lg">Checking server health...</p>;
  if (error) return <p className="text-red-500 text-lg">{error}</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Server Health</h1>

      <div className="border p-4 rounded shadow">
        <p><b>Status:</b> {health?.status}</p>
        <p><b>Database:</b> {health?.db}</p>
        <p><b>Environment:</b> {health?.env}</p>
        <p><b>Uptime:</b> {health?.uptime} seconds</p>
        <p><b>Timestamp:</b> {health?.time}</p>
      </div>
    </div>
  );
}