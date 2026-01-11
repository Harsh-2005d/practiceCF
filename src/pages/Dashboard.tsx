import { useState } from "react";
import Navbar from "../components/Navbar";

type TimeFilter = "yesterday" | "lastWeek" | "lastMonth";

const Dashboard = () => {
  const [filter, setFilter] = useState<TimeFilter>("yesterday");

  return (
    <div className="min-h-screen bg-gray-100">

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-3 bg-white p-2 rounded-xl shadow w-fit">
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

        {/* Content */}
        <div className="mt-6 bg-white rounded-xl shadow p-6">
          <QuestionsTable filter={filter} />
        </div>
      </main>
    </div>
  );
};

type FilterButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

const FilterButton = ({ label, active, onClick }: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white shadow"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
};

type QuestionsTableProps = {
  filter: TimeFilter;
};

const QuestionsTable = ({ filter }: QuestionsTableProps) => {
  const data = {
    yesterday: ["Question 1", "Question 2", "Question 3"],
    lastWeek: ["Question 4", "Question 5", "Question 6"],
    lastMonth: ["Question 7", "Question 8", "Question 9"],
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {filter === "lastWeek"
          ? "Last Week"
          : filter === "lastMonth"
          ? "Last Month"
          : "Yesterday"}
      </h2>

      <ul className="space-y-3">
        {data[filter].map((q) => (
          <li
            key={q}
            className="border rounded-lg px-4 py-3 hover:bg-gray-50 transition"
          >
            {q}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
