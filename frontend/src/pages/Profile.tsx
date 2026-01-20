import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "../axios";
import "../profile.css";
import axios from "axios";

type User = {
  handle: string;
  rank: string;
  rating: number;
  maxRank: string;
  best: number;
  email: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState("");

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

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Not authenticated</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/api/handle", {
        handle,
      });

      setUser((prev) =>
        prev
          ? {
              ...prev,
              handle,
            }
          : prev
      );
    } catch (err) {
      console.error("Failed to update handle", err);
    }
  };


  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-card">
          <div className="profile-info">
            <p className="rank">{user.rank}</p>

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
                <button type="submit" className="submit-btn">Submit</button>

              </form>
            )}

            <div className="stats">
              <div className="stat">
                <p className="label">Contest Rating</p>
                <p className="value">
                  {user.rating} <span className="muted">(max. {user.maxRank})</span>
                </p>
              </div>

              <div className="stat">
                <p className="label">Best Performance</p>
                <p className="value">{user.best}</p>
              </div>

              <div className="stat">
                <p className="label">Email</p>
                <p className="value email">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="graph-card">
          <h2 className="graph-title">Rating Progress</h2>
          <div className="graph-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[]}>
                <XAxis dataKey="date" />
                <YAxis domain={[800, 2200]} />
                <Tooltip />
                <Line type="monotone" dataKey="rating" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
