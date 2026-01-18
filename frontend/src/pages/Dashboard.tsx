import { useEffect, useState } from "react";
import { getRevisionSolves } from "../services/api";
import type { Solve } from "../services/api";
import "../styles/dashboard.css";

// useEffect(() => {
//   if (!localStorage.getItem("token")) {
//     window.location.href = "/login";
//   }
// }, []);


type TimeFilter = "yesterday" | "lastWeek" | "lastMonth";

const Dashboard = () => {
  const [filter, setFilter] = useState<TimeFilter>("yesterday");
  const [data, setData] = useState<{
    yesterday: Solve[];
    lastWeek: Solve[];
    lastMonth: Solve[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRevisionSolves()
      .then((res) => {
        setData({
          yesterday: res.previousDay,
          lastWeek: res.previousWeek,
          lastMonth: res.previousMonth,
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load solves. Are you logged in?");
      })
      .finally(() => setLoading(false));
  }, []);

  const solves = data ? data[filter] : [];

  const title =
    filter === "lastWeek"
      ? "Last Week"
      : filter === "lastMonth"
      ? "Last Month"
      : "Yesterday";

  return (
    <div className="dashboard-root">
      <main className="dashboard-container">
        {/* Filter Tabs */}
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

        {/* Questions */}
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

/* ---------- Filter Button ---------- */

type FilterButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

const FilterButton = ({ label, active, onClick }: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`filter-button ${active ? "active" : ""}`}
    >
      {label}
    </button>
  );
};

/* ---------- Questions Table ---------- */

type QuestionsTableProps = {
  solves: Solve[];
  title: string;
};

const QuestionsTable = ({ solves, title }: QuestionsTableProps) => {
  if (solves.length === 0) {
    return <p>No solves found.</p>;
  }

  return (
    <div>
      <h2 className="questions-title">{title}</h2>
      <ul className="questions-list">
  {solves.map((s) => (
    <li key={s.id} className="question-item">
      <a
        href={s.link}
        target="_blank"
        rel="noreferrer"
        className="question-link"
      >
        {s.contestId}{s.index}
      </a>
      <div>{new Date(s.solvedAt).toLocaleString()}</div>
    </li>
  ))}
</ul>

    </div>
  );
};

export default Dashboard;
