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

/*CF RANK LOGIC */

function getCfRank(rating?: number | null) {
  if (rating == null) return { title: "Unrated", color: "#999" };

  if (rating >= 2900) return { title: "Legendary Grandmaster", color: "#ff0000" };
  if (rating >= 2600) return { title: "International Grandmaster", color: "#ff0000" };
  if (rating >= 2400) return { title: "Grandmaster", color: "#ff0000" };

  if (rating >= 2300) return { title: "International Master", color: "#ff8c00" };
  if (rating >= 2200) return { title: "Master", color: "#ff8c00" };

  if (rating >= 1900) return { title: "Candidate Master", color: "#a0a" };

  if (rating >= 1600) return { title: "Expert", color: "#0000ff" };
  if (rating >= 1400) return { title: "Specialist", color: "#03a89e" };
  if (rating >= 1200) return { title: "Pupil", color: "#008000" };

  return { title: "Newbie", color: "#808080" };
}

/* COMPONENT */

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState("");
  const [histogram, setHistogram] = useState<number[]>([]);

  /* Fetch user */
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

  /* Fetch histogram after handle exists  */
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
        console.error("Histogram fetch failed", err);
      }
    };

    fetchHistogram();
  }, [user?.handle]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Not authenticated</p>;

  const rankInfo = getCfRank(user.rating);

  const histogramData = histogram.map((count, index) => ({
    day: `${30 - index}d`,
    solved: count,
  }));

  /* Submit handle (one time)  */
  const handleSubmit = async () => {
    try {
      await api.post("/api/handle", { handle });

      const res = await api.get<User>("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Handle submit failed", err);
    }
  };

  /* Refresh rating */
  const refreshProfile = async () => {
    try {
      const res = await api.get<{ rating: number }>("/api/refresh/user");
      setUser((prev) =>
        prev ? { ...prev, rating: res.data.rating } : prev
      );
    } catch (err) {
      console.error("Refresh failed", err);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* PROFILE CARD */}
        <div className="profile-card">
          <div className="profile-info">

            {user.handle ? (
<div className="handle-row">
  <div>
    <h1 className="handle" style={{ color: rankInfo.color }}>
      {rankInfo.title === "Legendary Grandmaster" ? (
        <>
          <span style={{ color: "red" }}>{user.handle![0]}</span>
          {user.handle!.slice(1)}
        </>
      ) : (
        user.handle
      )}
    </h1>

    <p className="rank" style={{ color: rankInfo.color }}>
      {rankInfo.title}
    </p>
  </div>

  <button className="refresh-btn" onClick={refreshProfile}>
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
                <p className="label">Rating</p>
                <p className="value">{user.rating ?? "-"}</p>
              </div>

              <div className="stat">
                <p className="label">Email</p>
                <p className="value email">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* HISTOGRAM */}
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
                <Bar
                  dataKey="solved"
                  fill={rankInfo.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
