import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function StatsPage() {
  const { code } = useParams();
  const [link, setLink] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/links/${code}`)
      .then((res) => setLink(res.data)) 
      .catch((error) => setLink(null));
  }, [code]);

  if (!link) return <p>Not found.</p>;

  return (
    <div className="container">
      <h1>Stats: {link.code}</h1>
      <p><strong>Target URL:</strong> {link.target}</p>
      <p><strong>Total clicks:</strong> {link.clicks}</p>
      <p><strong>Last clicked:</strong> {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "—"}</p>

      <a href={`http://localhost:4000/${link.code}`} target="_blank" rel="noreferrer">Visit Link</a>
      <br /><br />
      <Link to="/">Back</Link>
    </div>
  );
}