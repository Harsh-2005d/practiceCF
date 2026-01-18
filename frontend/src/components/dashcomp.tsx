import type { Solve } from "../services/api";

type FilterButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export const FilterButton = ({ label, active, onClick }: FilterButtonProps) => (
  <button
    onClick={onClick}
    className={`filter-button ${active ? "active" : ""}`}
  >
    {label}
  </button>
);

type QuestionsTableProps = {
  solves: Solve[];
  title: string;
};

export const QuestionsTable = ({ solves, title }: QuestionsTableProps) => {
  if (solves.length === 0) return <p>No solves found.</p>;

  return (
    <div>
      <h2 className="questions-title">{title}</h2>
      <ul className="questions-list">
        {solves.map((s) => (
          <li key={`${s.contestId}-${s.index}-${s.solvedAt}`} className="question-item">
            <a
              href={s.link}
              target="_blank"
              rel="noreferrer"
              className="question-link"
            >
              <div className="question-code">
                {s.contestId}
                {s.index}
              </div>
              <div className="question-time">
                {new Date(s.solvedAt).toLocaleString()}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
