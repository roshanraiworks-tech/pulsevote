import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Button } from "react-bootstrap";

function PollResultsChart({ poll }) {
  const [view, setView] = useState("bar");

  const data = useMemo(() => {
    if (!poll?.options?.length) return [];
    return poll.options.map((option) => ({
      name: option.text,
      votes: option.votes || 0,
    }));
  }, [poll]);

  const totalVotes = poll?.totalVotes || 0;

  const colors = [
    "#8b5cf6",
    "#38bdf8",
    "#22c55e",
    "#f97316",
    "#ec4899",
    "#facc15",
  ];

  if (!data.length) return null;

  return (
    <div className="pv-chart-shell">
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Button
          className={view === "bar" ? "pv-gradient-btn" : "pv-pill-btn"}
          onClick={() => setView("bar")}
        >
          Bar
        </Button>
        <Button
          className={view === "pie" ? "pv-gradient-btn" : "pv-pill-btn"}
          onClick={() => setView("pie")}
        >
          Pie
        </Button>
      </div>

      <div className="pv-chart-box">
        <div className="pv-small-muted mb-3">Total votes: {totalVotes}</div>

        <ResponsiveContainer width="100%" height={360}>
          {view === "bar" ? (
            <BarChart data={data} layout="vertical" margin={{ top: 8, right: 20, left: 20, bottom: 8 }}>
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip />
              <Bar dataKey="votes" radius={[0, 12, 12, 0]}>
                {data.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                dataKey="votes"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={130}
                paddingAngle={3}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PollResultsChart;