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

  // -------------------------
  // Fetch logged-in user
  // -------------------------
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

  // -------------------------
  // Fetch histogram AFTER handle exists
  // -------------------------
  useEffect(() => {
    if (!user?.handle) return;

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
  }, [user?.handle]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Not authenticated</p>;

  const histogramData = histogram.map((count, index) => ({
    day: `${30 - index}d`,
    solved: count,
  }));

  // -------------------------
  // Submit handle (ONCE)
  // -------------------------
  const handleSubmit = async () => {
    try {
      await api.post("/api/handle", { handle });

      // refetch user → triggers histogram useEffect
      const res = await api.get<User>("/api/auth/me");
      setUser(res.data);

      // optional retry (CF sync delay safety)
      setTimeout(async () => {
        try {
          const histRes = await api.get<HistogramResponse>(
            "/api/stats/histogram",
            { withCredentials: true }
          );
          setHistogram(histRes.data.data);
        } catch {}
      },3000);
    } catch (err) {
      console.error("Failed to set handle", err);
    }
  };

  // Refresh rating only
  const refreshProfile = async () => {
    try {
      const res = await api.get<User>("/api/refresh/user");
      setUser({
        handle: user.handle,
        rating: res.data.rating,
        email: user.email,
      });
    } catch (err) {
      console.error("Failed to refresh profile", err);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-info">
            {user.handle ? (
              <div className="handle-row">
                <h1 className="handle">{user.handle}</h1>
                <button
                  type="button"
                  className="refresh-btn"
                  onClick={refreshProfile}
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="handle-row">
                <input
                  type="text"
                  className="handle-input"
                  placeholder="Enter your handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                />
                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={!handle.trim()}
                >
                  Submit
                </button>
              </div>
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
