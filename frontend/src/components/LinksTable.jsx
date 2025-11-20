import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LinksTable() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:4000/api/links";
  const BASE_URL = "http://localhost:4000";

  useEffect(() => {
    async function fetchLinks() {
      try {
        const res = await axios.get(API_URL);
        setLinks(res.data || []);
      } catch (err) {
        console.error(err);
        setLinks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLinks();
  }, []);

  const handleDelete = async (code) => {
    if (!confirm("Delete this link?")) return;

    try {
      const res = await axios.delete(`${API_URL}/${code}`);

      if (res.status === 200) {
        setLinks((prev) => prev.filter((l) => l.code !== code));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const copyToClipboard = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert("Copied!");
    } catch {
      alert("Copy failed");
    }
  };

  if (loading) return <p>Loading links...</p>;
  if (!links.length) return <p>No links created yet.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">All Links</h2>

      <table className="min-w-full border">
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="p-2">Short</th>
            <th className="p-2">Target</th>
            <th className="p-2">Clicks</th>
            <th className="p-2">Last Clicked</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.map((link) => {
            const shortUrl = `${BASE_URL}/${link.code}`;

            return (
              <tr key={link._id} className="border-b">
                <td className="p-2">
                  <a href={shortUrl} target="_blank" rel="noreferrer">
                    {link.code}
                  </a>
                </td>

                <td className="p-2">
                  <a href={link.target} target="_blank" rel="noreferrer">
                    {link.target}
                  </a>
                </td>

                <td className="p-2">{link.clicks}</td>

                <td className="p-2">
                  {link.lastClicked
                    ? new Date(link.lastClicked).toLocaleString()
                    : "—"}
                </td>

                <td className="p-2 space-x-2">
                  <Link
                    to={`/code/${link.code}`}
                    className="text-blue-600 underline"
                  >
                    Stats
                  </Link>

                  <button
                    onClick={() => copyToClipboard(shortUrl)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    Copy
                  </button>

                  <button
                    onClick={() => handleDelete(link.code)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}