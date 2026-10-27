import type { Solve } from "../../types/solve";
import { ProblemNote } from "./ProblemNote";

type SolveListProps = {
  solves: Solve[];
};

export function SolveList({ solves }: SolveListProps) {
  if (solves.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        No problems solved in this period.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {solves.map((solve) => (
        <li key={`${solve.contestId}-${solve.index}-${solve.solvedAt}`}>
          <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 px-1 py-1">
              <div className="flex min-w-0 flex-wrap items-center gap-1">
                <a
                  href={solve.link}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate rounded-lg py-1 font-medium text-gray-900 transition-colors hover:text-blue-700 dark:text-gray-100 dark:hover:text-blue-300"
                >
                  {solve.problemName}
                </a>
                <ProblemNote
                  contestId={solve.contestId}
                  index={solve.index}
                  problemName={solve.problemName}
                />
              </div>
              <span className="pt-1.5 text-right text-xs text-gray-500 dark:text-gray-400">
                {new Date(solve.solvedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
