import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardTitle } from "../ui/Card";

type SolveHistogramProps = {
  data: number[];
};

export function SolveHistogram({ data }: SolveHistogramProps) {
  const chartData = data.map((count, index) => ({
    day: `${30 - index}d`,
    solved: count,
  }));

  return (
    <Card>
      <CardTitle>Problems Solved (Last 30 Days)</CardTitle>
      <div className="h-72 text-gray-900 dark:text-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="day" hide />
            <YAxis allowDecimals={false} stroke="currentColor" tick={{ fill: "currentColor" }} />
            <Tooltip />
            <Bar dataKey="solved" fill="currentColor" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
