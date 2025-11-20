import { useEffect, useState } from "react";
import axios from "axios";
import LinkForm from "../components/LinkForm";
import LinksTable from "../components/LinksTable";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/links");
      setLinks(res.data.data);
    } catch (err) {
      console.error("Error loading links", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="container">
      <h1>TinyLink Dashboard</h1>
      <LinkForm onSuccess={fetchLinks} />
      {loading ? <p>Loading...</p> : <LinksTable links={links} refresh={fetchLinks} />}
    </div>
  );
}
