import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { readings, vitaminMeta, type VitaminKey, type Reading } from "./data";

type Section = "overview" | "history" | "resources";

const metricTabs: VitaminKey[] = ["vitaminD", "calcium", "thiamine"];

const timeRanges = [
  { key: "30d", label: "30d", days: 30 },
  { key: "90d", label: "90d", days: 90 },
  { key: "6m", label: "6m", days: 183 },
  { key: "1y", label: "1y", days: 365 },
  { key: "all", label: "all", days: null },
] as const;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatMonth = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });

const getStatus = (key: VitaminKey, value: number) => {
  const { low, high } = vitaminMeta[key];
  if (value < low) return "Low";
  if (value > high) return "High";
  return "In Range";
};

const toNumber = (value: number) => Math.round(value * 10) / 10;

const csvEscape = (value: string | number | null | undefined) => {
  const raw = value ?? "";
  const str = `${raw}`;
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const buildCsv = (rows: Reading[]) => {
  const headers = [
    "Date",
    "Vitamin D (ng/mL)",
    "Calcium (mg/dL)",
    "B1 (nmol/L)",
    "Notes",
  ];
  const lines = rows.map((row) =>
    [
      formatDate(row.date),
      toNumber(row.vitaminD),
      toNumber(row.calcium),
      toNumber(row.thiamine),
      row.notes ?? "",
    ].map(csvEscape),
  );
  return [headers.map(csvEscape), ...lines]
    .map((line) => line.join(","))
    .join("\n");
};

const downloadCsv = (filename: string, rows: Reading[]) => {
  const blob = new Blob([buildCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const sortRows = (
  rows: Reading[],
  key: keyof Reading,
  direction: "asc" | "desc",
) => {
  const sorted = [...rows].sort((a, b) => {
    const valueA = a[key] ?? "";
    const valueB = b[key] ?? "";
    if (typeof valueA === "number" && typeof valueB === "number") {
      return valueA - valueB;
    }
    return `${valueA}`.localeCompare(`${valueB}`);
  });
  if (direction === "desc") {
    sorted.reverse();
  }
  return sorted;
};

export default function App() {
  const [section, setSection] = useState<Section>("overview");
  const [overviewMetric, setOverviewMetric] = useState<VitaminKey>("vitaminD");
  const [rangeKey, setRangeKey] =
    useState<(typeof timeRanges)[number]["key"]>("6m");
  const [selectedMetrics, setSelectedMetrics] = useState<VitaminKey[]>([
    "vitaminD",
    "calcium",
    "thiamine",
  ]);
  const [showGoal, setShowGoal] = useState(true);
  const [sortKey, setSortKey] = useState<keyof Reading>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const latest = readings[readings.length - 1];
  const previous = readings[readings.length - 2];

  const overviewRows = useMemo(() => {
    const lastSixMonths = readings.filter((row) => {
      const cutoff = new Date(latest.date);
      cutoff.setMonth(cutoff.getMonth() - 6);
      return new Date(row.date) >= cutoff;
    });
    return lastSixMonths;
  }, [latest.date]);

  const selectedRange = timeRanges.find((range) => range.key === rangeKey);
  const filteredRows = useMemo(() => {
    if (!selectedRange || selectedRange.days === null) return readings;
    const cutoff = new Date(latest.date);
    cutoff.setDate(cutoff.getDate() - selectedRange.days);
    return readings.filter((row) => new Date(row.date) >= cutoff);
  }, [selectedRange, latest.date]);

  const sortedRows = useMemo(
    () => sortRows(filteredRows, sortKey, sortDir),
    [filteredRows, sortKey, sortDir],
  );

  const recentRows = readings.slice(-6).reverse();

  const overviewMetricMeta = vitaminMeta[overviewMetric];

  const toggleMetric = (metric: VitaminKey) => {
    setSelectedMetrics((current) => {
      if (current.includes(metric)) {
        return current.filter((item) => item !== metric);
      }
      return [...current, metric];
    });
  };

  const handleSort = (key: keyof Reading) => {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Vitamin Levels Dashboard</h1>
          <p className="subhead">
            Mock data demo of vitamin monitoring and insights.
          </p>
        </div>
        <nav className="nav-tabs">
          <button
            className={section === "overview" ? "active" : ""}
            onClick={() => setSection("overview")}
          >
            Overview
          </button>
          <button
            className={section === "history" ? "active" : ""}
            onClick={() => setSection("history")}
          >
            History
          </button>
          <button
            className={section === "resources" ? "active" : ""}
            onClick={() => setSection("resources")}
          >
            Resources
          </button>
        </nav>
      </header>

      {section === "overview" && (
        <section className="section">
          <div className="card-grid">
            {metricTabs.map((key) => {
              const meta = vitaminMeta[key];
              const value = latest[key];
              const delta = value - previous[key];
              const status = getStatus(key, value);
              return (
                <div className="stat-card" key={key}>
                  <div className="stat-header">
                    <p>{meta.label}</p>
                    <span
                      className={`badge badge-${status.replace(" ", "").toLowerCase()}`}
                    >
                      {status}
                    </span>
                  </div>
                  <div className="stat-value">
                    <span>{toNumber(value)}</span>
                    <small>{meta.unit}</small>
                  </div>
                  <p className={`delta ${delta >= 0 ? "up" : "down"}`}>
                    {delta >= 0 ? "+" : ""}
                    {toNumber(delta)} since last test
                  </p>
                </div>
              );
            })}
          </div>

          <div className="card chart-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Trend · last 6 months</p>
                <h2>{overviewMetricMeta.label}</h2>
              </div>
              <div className="pill-tabs">
                {metricTabs.map((key) => (
                  <button
                    key={key}
                    className={overviewMetric === key ? "active" : ""}
                    onClick={() => setOverviewMetric(key)}
                  >
                    {vitaminMeta[key].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="chart-shell">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overviewRows}>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="rgba(255,255,255,0.08)"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatMonth}
                    tick={{ fill: "#dbe0ff" }}
                  />
                  <YAxis tick={{ fill: "#dbe0ff" }} domain={["auto", "auto"]} />
                  <Tooltip
                    formatter={(value) => `${value} ${overviewMetricMeta.unit}`}
                    labelFormatter={formatDate}
                  />
                  <Line
                    type="monotone"
                    dataKey={overviewMetric}
                    stroke="#f7b267"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <ReferenceLine
                    y={overviewMetricMeta.goal}
                    stroke="#f25f5c"
                    strokeDasharray="6 6"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card table-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Recent results</p>
                <h2>Latest readings</h2>
              </div>
              <p className="muted">Updated {formatDate(latest.date)}</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Vitamin D</th>
                    <th>Calcium</th>
                    <th>B1 (Thiamine)</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRows.map((row) => (
                    <tr key={row.date}>
                      <td>{formatDate(row.date)}</td>
                      <td>{toNumber(row.vitaminD)}</td>
                      <td>{toNumber(row.calcium)}</td>
                      <td>{toNumber(row.thiamine)}</td>
                      <td>{row.notes ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {section === "history" && (
        <section className="section history-section">
          <aside className="filters">
            <div className="filter-block">
              <p className="filter-title">Date range</p>
              <div className="filter-list">
                {timeRanges.map((range) => (
                  <button
                    key={range.key}
                    className={rangeKey === range.key ? "active" : ""}
                    onClick={() => setRangeKey(range.key)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-block">
              <p className="filter-title">Metrics</p>
              <div className="filter-list">
                {metricTabs.map((metric) => (
                  <label key={metric} className="checkbox">
                    <input
                      type="checkbox"
                      checked={selectedMetrics.includes(metric)}
                      onChange={() => toggleMetric(metric)}
                    />
                    <span>{vitaminMeta[metric].label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-block">
              <p className="filter-title">Targets</p>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={showGoal}
                  onChange={() => setShowGoal((value) => !value)}
                />
                <span>Show goal line</span>
              </label>
            </div>
          </aside>

          <div className="history-content">
            <div className="card chart-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">History · {selectedRange?.label}</p>
                  <h2>Vitamin trends</h2>
                </div>
                <button
                  className="ghost"
                  onClick={() => downloadCsv("vitamin-history.csv", sortedRows)}
                >
                  Export CSV
                </button>
              </div>
              <div className="chart-shell chart-shell-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sortedRows.slice().reverse()}>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke="rgba(255,255,255,0.08)"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatMonth}
                      tick={{ fill: "#dbe0ff" }}
                    />
                    <YAxis
                      tick={{ fill: "#dbe0ff" }}
                      domain={["auto", "auto"]}
                    />
                    <Tooltip labelFormatter={formatDate} />
                    <Legend />
                    {selectedMetrics.includes("vitaminD") && (
                      <Line
                        type="monotone"
                        dataKey="vitaminD"
                        name={vitaminMeta.vitaminD.label}
                        stroke="#f7b267"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                      />
                    )}
                    {selectedMetrics.includes("calcium") && (
                      <Line
                        type="monotone"
                        dataKey="calcium"
                        name={vitaminMeta.calcium.label}
                        stroke="#7bdff2"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                      />
                    )}
                    {selectedMetrics.includes("thiamine") && (
                      <Line
                        type="monotone"
                        dataKey="thiamine"
                        name={vitaminMeta.thiamine.label}
                        stroke="#f25f5c"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                      />
                    )}
                    {showGoal &&
                      selectedMetrics.map((metric) => (
                        <ReferenceLine
                          key={metric}
                          y={vitaminMeta[metric].goal}
                          stroke="rgba(255,255,255,0.3)"
                          strokeDasharray="4 6"
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card table-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">All readings</p>
                  <h2>History table</h2>
                </div>
                <p className="muted">Sorting enabled</p>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("date")}>
                        Date{" "}
                        {sortKey === "date"
                          ? sortDir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                      <th onClick={() => handleSort("vitaminD")}>
                        Vitamin D{" "}
                        {sortKey === "vitaminD"
                          ? sortDir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                      <th onClick={() => handleSort("calcium")}>
                        Calcium{" "}
                        {sortKey === "calcium"
                          ? sortDir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                      <th onClick={() => handleSort("thiamine")}>
                        B1{" "}
                        {sortKey === "thiamine"
                          ? sortDir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                      <th onClick={() => handleSort("notes")}>
                        Notes{" "}
                        {sortKey === "notes"
                          ? sortDir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRows.map((row) => (
                      <tr key={row.date}>
                        <td>{formatDate(row.date)}</td>
                        <td>{toNumber(row.vitaminD)}</td>
                        <td>{toNumber(row.calcium)}</td>
                        <td>{toNumber(row.thiamine)}</td>
                        <td>{row.notes ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {section === "resources" && (
        <section className="section resources-section">
          <div className="resources-grid">
            {metricTabs.map((key) => {
              const meta = vitaminMeta[key];
              return (
                <article className="resource-card" key={key}>
                  <h2>{meta.label}</h2>
                  <p className="resource-desc">{meta.description}</p>
                  <div className="resource-tips">
                    <p className="eyebrow">Ways to improve</p>
                    <ul>
                      {meta.tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="resource-footer">
                    <span>Goal target</span>
                    <strong>
                      {meta.goal} {meta.unit}
                    </strong>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
