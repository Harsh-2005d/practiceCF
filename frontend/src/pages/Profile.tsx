import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { api } from "../axios";
import "../profile.css";

type User = {
  handle?: string | null;
  rating?: number | null;
  email?: string;
};

type HistogramResponse = {
  data: number[];
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState("");

  const [histogram, setHistogram] = useState<number[]>([]);

  //Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<User>("/api/auth/me");
        setUser(res.data);
        setHandle(res.data.handle ?? "");
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔹 Fetch histogram
  useEffect(() => {
    const fetchHistogram = async () => {
      try {
        const res = await api.get<HistogramResponse>(
          "/api/stats/histogram",
          { withCredentials: true }
        );
        setHistogram(res.data.data);
      } catch (err) {
        console.error("Failed to fetch histogram", err);
      }
    };

    fetchHistogram();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Not authenticated</p>;

  const histogramData = histogram.map((count, index) => ({
    day: `${30 - index}d`,
    solved: count,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/handle", { handle });
      setUser((prev) => (prev ? { ...prev, handle } : prev));
    } catch (err) {
      console.error("Failed to update handle", err);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-info">
            {user.handle ? (
              <h1 className="handle">{user.handle}</h1>
            ) : (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Enter your handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  required
                />
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </form>
            )}

            <div className="stats">
              <div className="stat">
                <p className="label">Contest Rating</p>
                <p className="value">{user.rating ?? "-"}</p>
              </div>

              <div className="stat">
                <p className="label">Email</p>
                <p className="value email">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="graph-card">
          <h2 className="graph-title">
            Problems Solved (Last 30 Days)
          </h2>

          <div className="graph-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={histogramData}>
                <XAxis dataKey="day" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="solved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
