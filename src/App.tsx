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
import {
  readings,
  vitaminMeta,
  type VitaminKey,
  type Reading,
  type MetricState,
  type Level,
} from "./data";

type Section = "overview" | "history" | "resources";
type SortKey = "date" | VitaminKey | "notes";

const metricTabs: VitaminKey[] = ["vitaminD", "calcium", "vitaminC", "copper"];
const metricColors: Record<VitaminKey, string> = {
  vitaminD: "#f7b267",
  calcium: "#7bdff2",
  vitaminC: "#f25f5c",
  copper: "#9e7bff",
};

const timeRanges = [
  { key: "30d", label: "30d", days: 30 },
  { key: "90d", label: "90d", days: 90 },
  { key: "6m", label: "6m", days: 183 },
  { key: "1y", label: "1y", days: 365 },
  { key: "all", label: "all", days: null },
] as const;

const levelScore: Record<Level, number> = {
  low: 1,
  med: 2,
  high: 3,
};

const levelLabel: Record<Level, string> = {
  low: "Low",
  med: "Med",
  high: "High",
};

const scoreLabel: Record<number, string> = {
  1: "Low",
  2: "Med",
  3: "High",
};

const formatDate = (value: string | number) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatMonth = (value: string | number) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });

const formatLabel = (value: unknown) => {
  if (typeof value === "string" || typeof value === "number") {
    return formatDate(value);
  }
  return "";
};

const getScoreKey = (metric: VitaminKey) => `${metric}Score` as const;

const formatState = (state: MetricState) => levelLabel[state.level];

const stateScore = (state: MetricState) => levelScore[state.level];

const compareState = (a: MetricState, b: MetricState) => stateScore(a) - stateScore(b);

const getTrend = (previous: MetricState, current: MetricState) => {
  const scoreDiff = stateScore(current) - stateScore(previous);
  if (scoreDiff > 0) {
    return { text: `${formatState(previous)} -> ${formatState(current)}`, direction: "up" as const };
  }
  if (scoreDiff < 0) {
    return { text: `${formatState(previous)} -> ${formatState(current)}`, direction: "down" as const };
  }
  return { text: `No change (${formatState(current)})`, direction: "flat" as const };
};

const sortRows = (rows: Reading[], key: SortKey, direction: "asc" | "desc") => {
  const sorted = [...rows].sort((a, b) => {
    if (key === "date") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (key === "notes") {
      return `${a.notes ?? ""}`.localeCompare(`${b.notes ?? ""}`);
    }
    return compareState(a[key], b[key]);
  });
  if (direction === "desc") {
    sorted.reverse();
  }
  return sorted;
};

const toChartRow = (row: Reading) => ({
  date: row.date,
  vitaminDScore: levelScore[row.vitaminD.level],
  calciumScore: levelScore[row.calcium.level],
  vitaminCScore: levelScore[row.vitaminC.level],
  copperScore: levelScore[row.copper.level],
});

const isMetricKey = (value: string): value is VitaminKey => metricTabs.includes(value as VitaminKey);

export default function App() {
  const [section, setSection] = useState<Section>("overview");
  const [overviewMetric, setOverviewMetric] = useState<VitaminKey>("vitaminD");
  const [rangeKey, setRangeKey] = useState<(typeof timeRanges)[number]["key"]>("6m");
  const [selectedMetrics, setSelectedMetrics] = useState<VitaminKey[]>([
    ...metricTabs,
  ]);
  const [showGuides, setShowGuides] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const latest = readings[readings.length - 1];
  const previous = readings[readings.length - 2];

  const overviewRows = useMemo(() => {
    const lastSixMonths = readings.filter((row) => {
      const cutoff = new Date(latest.date);
      cutoff.setMonth(cutoff.getMonth() - 6);
      return new Date(row.date) >= cutoff;
    });
    return lastSixMonths.map(toChartRow);
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

  const historyChartRows = useMemo(() => sortedRows.slice().reverse().map(toChartRow), [sortedRows]);

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

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="phone-frame">
      <div className="app">
        <header className="app-header">
          <div>
            <h1>VitaLines</h1>
            <p className="subhead">
              Dashboard focused on detectable categories: Low, Med, and High.
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
                const currentState = latest[key];
                const status = levelLabel[currentState.level];
                const trend = getTrend(previous[key], currentState);
                return (
                  <div className="stat-card" key={key}>
                    <div className="stat-header">
                      <p>{meta.label}</p>
                      <span className={`badge badge-${currentState.level}`}>{status}</span>
                    </div>
                    <div className="stat-value">
                      <span>{formatState(currentState)}</span>
                    </div>
                    <p className={`delta ${trend.direction}`}>{trend.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="card chart-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Trend - last 6 months</p>
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
                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="date" tickFormatter={formatMonth} tick={{ fill: "#dbe0ff" }} />
                    <YAxis
                      tick={{ fill: "#dbe0ff" }}
                      domain={[0.8, 3.2]}
                      ticks={[1, 2, 3]}
                      tickFormatter={(value) => scoreLabel[value] ?? ""}
                    />
                    <Tooltip
                      labelFormatter={formatLabel}
                      formatter={(value) => {
                        const score = typeof value === "number" ? value : Number(value);
                        return [scoreLabel[score] ?? "", overviewMetricMeta.label];
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey={getScoreKey(overviewMetric)}
                      stroke={metricColors[overviewMetric]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    {showGuides && (
                      <>
                        <ReferenceLine y={1.5} stroke="rgba(255,255,255,0.22)" strokeDasharray="4 6" />
                        <ReferenceLine y={2.5} stroke="rgba(255,255,255,0.22)" strokeDasharray="4 6" />
                      </>
                    )}
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
                      {metricTabs.map((metric) => (
                        <th key={metric}>{vitaminMeta[metric].label}</th>
                      ))}
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRows.map((row) => (
                      <tr key={row.date}>
                        <td>{formatDate(row.date)}</td>
                        {metricTabs.map((metric) => (
                          <td key={metric}>
                            <span className={`status-pill status-${row[metric].level}`}>
                              {formatState(row[metric])}
                            </span>
                          </td>
                        ))}
                        <td>{row.notes ?? "--"}</td>
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
                <div className="filter-list filter-list-row">
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
                <p className="filter-title">Guides</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={showGuides}
                    onChange={() => setShowGuides((value) => !value)}
                  />
                  <span>Show Low/Med/High guide lines</span>
                </label>
              </div>
            </aside>

            <div className="history-content">
              <div className="card chart-card">
                <div className="card-header">
                  <div>
                    <p className="eyebrow">History - {selectedRange?.label}</p>
                    <h2>Vitamin trends</h2>
                  </div>
                  <p className="muted">Categorical trend view</p>
                </div>
                <div className="chart-shell chart-shell-lg">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyChartRows}>
                      <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="date" tickFormatter={formatMonth} tick={{ fill: "#dbe0ff" }} />
                      <YAxis
                        tick={{ fill: "#dbe0ff" }}
                        domain={[0.8, 3.2]}
                        ticks={[1, 2, 3]}
                        tickFormatter={(value) => scoreLabel[value] ?? ""}
                      />
                      <Tooltip
                        labelFormatter={formatLabel}
                        formatter={(value, name, item) => {
                          const score = typeof value === "number" ? value : Number(value);
                          const dataKey = `${item?.dataKey ?? ""}`;
                          const metric = dataKey.replace("Score", "");
                          if (isMetricKey(metric)) {
                            return [scoreLabel[score] ?? "", vitaminMeta[metric].label];
                          }
                          return [scoreLabel[score] ?? "", `${name}`];
                        }}
                      />
                      <Legend />
                      {metricTabs
                        .filter((metric) => selectedMetrics.includes(metric))
                        .map((metric) => (
                          <Line
                            key={metric}
                            type="monotone"
                            dataKey={getScoreKey(metric)}
                            name={vitaminMeta[metric].label}
                            stroke={metricColors[metric]}
                            strokeWidth={3}
                            dot={{ r: 3 }}
                          />
                        ))}
                      {showGuides && (
                        <>
                          <ReferenceLine y={1.5} stroke="rgba(255,255,255,0.28)" strokeDasharray="4 6" />
                          <ReferenceLine y={2.5} stroke="rgba(255,255,255,0.28)" strokeDasharray="4 6" />
                        </>
                      )}
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
                  <p className="muted">Category sorting enabled</p>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th onClick={() => handleSort("date")}>
                          Date {sortKey === "date" ? (sortDir === "asc" ? "^" : "v") : ""}
                        </th>
                        {metricTabs.map((metric) => (
                          <th key={metric} onClick={() => handleSort(metric)}>
                            {vitaminMeta[metric].label}{" "}
                            {sortKey === metric ? (sortDir === "asc" ? "^" : "v") : ""}
                          </th>
                        ))}
                        <th onClick={() => handleSort("notes")}>
                          Notes {sortKey === "notes" ? (sortDir === "asc" ? "^" : "v") : ""}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRows.map((row) => (
                        <tr key={row.date}>
                          <td>{formatDate(row.date)}</td>
                          {metricTabs.map((metric) => (
                            <td key={metric}>
                              <span className={`status-pill status-${row[metric].level}`}>
                                {formatState(row[metric])}
                              </span>
                            </td>
                          ))}
                          <td>{row.notes ?? "--"}</td>
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
                      <span>Target state</span>
                      <strong>{meta.targetState}</strong>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
