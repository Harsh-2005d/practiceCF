import { useEffect, useState } from "react";
import { getRevisionSolves } from "../services/api";
import type { Solve } from "../services/api";
import { FilterButton, QuestionsTable } from "../components/dashcomp";
import "../styles/dashboard.css";

type TimeFilter = "yesterday" | "sevenDaysAgo" | "thirtyDaysAgo";

type DashboardData = {
  yesterday: Solve[];
  sevenDaysAgo: Solve[];
  thirtyDaysAgo: Solve[];
};

export default function Dashboard() {
  const [filter, setFilter] = useState<TimeFilter>("yesterday");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSolves = async () => {
      try {
        const res = await getRevisionSolves();

        setData({
          yesterday: res.previousDay,
          sevenDaysAgo: res.previousWeek,
          thirtyDaysAgo: res.previousMonth,
        });
      } catch (e) {
        console.error(e);
        setError(
          "Failed to load solves. Are you logged in? If yes, enter your handle in the profile section."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSolves();
  }, []);

  const solves = data?.[filter] ?? [];

  const title =
    filter === "sevenDaysAgo"
      ? "7 Days Ago"
      : filter === "thirtyDaysAgo"
      ? "30 Days Ago"
      : "Yesterday";

  return (
    <div className="dashboard-root">
      <main className="dashboard-container">
        <div className="filter-tabs">
          <FilterButton
            label="Yesterday"
            active={filter === "yesterday"}
            onClick={() => setFilter("yesterday")}
          />

          <FilterButton
            label="7 Days Ago"
            active={filter === "sevenDaysAgo"}
            onClick={() => setFilter("sevenDaysAgo")}
          />

          <FilterButton
            label="30 Days Ago"
            active={filter === "thirtyDaysAgo"}
            onClick={() => setFilter("thirtyDaysAgo")}
          />
        </div>

        <div className="questions-card">
          {loading && <p>Loading solves...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && (
            <QuestionsTable solves={solves} title={title} />
          )}
        </div>
      </main>
    </div>
  );
}
