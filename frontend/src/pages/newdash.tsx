import { useEffect, useState } from "react";
import { getRevisionSolves } from "../services/api";
import type { Solve } from "../services/api";
import { FilterButton,QuestionsTable } from "../components/dashcomp";
import "../styles/dashboard.css";

type TimeFilter = "yesterday" | "lastWeek" | "lastMonth";

type DashboardData = {
  yesterday: Solve[];
  lastWeek: Solve[];
  lastMonth: Solve[];
};

export default function Dashboard () {
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
          lastWeek: res.previousWeek,
          lastMonth: res.previousMonth,
        });
      } catch (e) {
        console.error(e);
        setError("Failed to load solves. Are you logged in? If yes, Enter your handle in profile section.");
      } finally {
        setLoading(false);
      }
    };

    loadSolves();
  }, []);

  const solves = data?.[filter] ?? [];

  const title =
    filter === "lastWeek"
      ? "Last Week"
      : filter === "lastMonth"
      ? "Last Month"
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
            label="Last Week"
            active={filter === "lastWeek"}
            onClick={() => setFilter("lastWeek")}
          />
          <FilterButton
            label="Last Month"
            active={filter === "lastMonth"}
            onClick={() => setFilter("lastMonth")}
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
};




