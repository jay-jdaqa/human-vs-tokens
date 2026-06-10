import { useState, useMemo } from "react";

const MODEL_GROUPS = [
  {
    provider: "Anthropic",
    color: "#d97706",
    models: [
      { id: "claude-fable-5", name: "Claude Fable 5", badge: "NEW", inputPer1M: 10.0, outputPer1M: 50.0, color: "#f59e0b" },
      { id: "claude-opus-4-8", name: "Claude Opus 4.8", inputPer1M: 5.0, outputPer1M: 25.0, color: "#d97706" },
      { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", inputPer1M: 3.0, outputPer1M: 15.0, color: "#b45309" },
      { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", inputPer1M: 0.8, outputPer1M: 4.0, color: "#92400e" },
    ],
  },
  {
    provider: "OpenAI",
    color: "#2563eb",
    models: [
      { id: "gpt-5-5", name: "GPT-5.5", badge: "NEW", inputPer1M: 5.0, outputPer1M: 30.0, color: "#3b82f6" },
      { id: "gpt-5-5-pro", name: "GPT-5.5 Pro", inputPer1M: 30.0, outputPer1M: 180.0, color: "#1d4ed8" },
      { id: "gpt-4o", name: "GPT-4o", inputPer1M: 2.5, outputPer1M: 10.0, color: "#2563eb" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", inputPer1M: 0.15, outputPer1M: 0.6, color: "#60a5fa" },
      { id: "o3", name: "o3", inputPer1M: 10.0, outputPer1M: 40.0, color: "#7c3aed" },
      { id: "o4-mini", name: "o4-mini", inputPer1M: 1.1, outputPer1M: 4.4, color: "#8b5cf6" },
    ],
  },
  {
    provider: "Google",
    color: "#dc2626",
    models: [
      { id: "gemini-3-5-flash", name: "Gemini 3.5 Flash", badge: "NEW", inputPer1M: 1.5, outputPer1M: 9.0, color: "#ef4444" },
      { id: "gemini-3-1-pro", name: "Gemini 3.1 Pro", inputPer1M: 2.0, outputPer1M: 12.0, color: "#dc2626" },
      { id: "gemini-3-flash", name: "Gemini 3 Flash", inputPer1M: 0.5, outputPer1M: 3.0, color: "#f87171" },
      { id: "gemini-3-1-flashlite", name: "Gemini 3.1 Flash-Lite", inputPer1M: 0.1, outputPer1M: 0.4, color: "#fca5a5" },
    ],
  },
  {
    provider: "xAI",
    color: "#6b7280",
    models: [
      { id: "grok-4-1", name: "Grok 4.1", inputPer1M: 0.2, outputPer1M: 0.5, color: "#9ca3af" },
    ],
  },
  {
    provider: "DeepSeek",
    color: "#06b6d4",
    models: [
      { id: "deepseek-v3", name: "DeepSeek V3", inputPer1M: 0.27, outputPer1M: 1.1, color: "#06b6d4" },
    ],
  },
];

const MODELS = MODEL_GROUPS.flatMap(g => g.models.map(m => ({ ...m, provider: g.provider })));

// advantage: "ai" | "human" | "mixed"
const TASK_CATEGORIES = [
  {
    id: "engineering",
    label: "Engineering",
    subcategories: [
      {
        id: "quality",
        label: "Quality",
        tasks: [
          { label: "Write automation tests", inputK: 12, outputK: 20, humanMin: 60, advantage: "ai", note: "AI generates boilerplate fast" },
          { label: "Generate test data sets", inputK: 6, outputK: 30, humanMin: 90, advantage: "ai", note: "Repetitive, well-scoped" },
          { label: "Regression test plan", inputK: 10, outputK: 25, humanMin: 120, advantage: "ai", note: "Strong AI case" },
          { label: "Bug triage + root cause", inputK: 20, outputK: 8, humanMin: 30, advantage: "mixed", note: "AI fast; human judgment on severity" },
          { label: "Test coverage analysis", inputK: 30, outputK: 12, humanMin: 60, advantage: "ai", note: "Static analysis, clear win" },
          { label: "Accessibility audit", inputK: 20, outputK: 15, humanMin: 90, advantage: "mixed", note: "AI catches code issues; human tests feel" },
          { label: "Exploratory testing session", inputK: 5, outputK: 5, humanMin: 60, advantage: "human", note: "Intuition and UX feel required" },
          { label: "QA sign-off on release", inputK: 15, outputK: 10, humanMin: 45, advantage: "human", note: "Accountability can't be delegated" },
        ],
      },
      {
        id: "development",
        label: "Development",
        tasks: [
          { label: "Full PR review", inputK: 40, outputK: 15, humanMin: 45, advantage: "mixed", note: "AI on style/logic; human on intent" },
          { label: "API docs generation", inputK: 25, outputK: 50, humanMin: 180, advantage: "ai", note: "Massive AI advantage" },
          { label: "Code refactor suggestions", inputK: 35, outputK: 20, humanMin: 60, advantage: "ai", note: "Pattern recognition strength" },
          { label: "Dependency upgrade analysis", inputK: 20, outputK: 15, humanMin: 45, advantage: "ai", note: "Changelog parsing at scale" },
          { label: "Incident post-mortem draft", inputK: 25, outputK: 30, humanMin: 90, advantage: "ai", note: "Templated structure, AI wins" },
          { label: "On-call handoff writeup", inputK: 10, outputK: 20, humanMin: 30, advantage: "ai", note: "Structured prose, clear AI case" },
          { label: "Security vulnerability scan", inputK: 60, outputK: 20, humanMin: 90, advantage: "mixed", note: "Known CVE matching; human validates" },
          { label: "Architecture decision review", inputK: 30, outputK: 20, humanMin: 120, advantage: "human", note: "Org context and tradeoffs matter" },
        ],
      },
    ],
  },
];

const ADVANTAGE_META = {
  ai:    { label: "AI wins",    color: "#16a34a", dot: "#22c55e" },
  mixed: { label: "Mixed",      color: "#d97706", dot: "#f59e0b" },
  human: { label: "Human wins", color: "#dc2626", dot: "#f87171" },
};

function fmt(val) {
  if (val < 0.001) return `$${val.toExponential(2)}`;
  if (val < 0.01) return `$${val.toFixed(4)}`;
  if (val < 1) return `$${val.toFixed(3)}`;
  return `$${val.toFixed(2)}`;
}

function fmtMultiplier(ratio) {
  if (ratio >= 1000) return `${Math.round(ratio / 100) * 100}×`;
  if (ratio >= 100) return `${Math.round(ratio / 10) * 10}×`;
  if (ratio >= 10) return `${ratio.toFixed(0)}×`;
  return `${ratio.toFixed(1)}×`;
}

export default function App() {
  const [selectedModel, setSelectedModel] = useState(MODELS.find(m => m.id === "claude-fable-5") || MODELS[0]);
  const [selectedTask, setSelectedTask] = useState(TASK_CATEGORIES[0].subcategories[0].tasks[0]);
  const [inputTokensK, setInputTokensK] = useState(12);
  const [outputTokensK, setOutputTokensK] = useState(20);
  const [humanMin, setHumanMin] = useState(60);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [runsPerDay, setRunsPerDay] = useState(10);

  // Accordion state: which top-level category and which subcategory are open
  const [openCategory, setOpenCategory] = useState("engineering");
  const [openSubcategory, setOpenSubcategory] = useState("quality");

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setInputTokensK(task.inputK);
    setOutputTokensK(task.outputK);
    setHumanMin(task.humanMin);
  };

  const result = useMemo(() => {
    const inputTokens = inputTokensK * 1000;
    const outputTokens = outputTokensK * 1000;
    const tokenCost =
      (inputTokens / 1e6) * selectedModel.inputPer1M +
      (outputTokens / 1e6) * selectedModel.outputPer1M;
    const humanCost = (humanMin / 60) * hourlyRate;
    const ratio = humanCost / tokenCost;
    const dailyTokenCost = tokenCost * runsPerDay;
    const dailyHumanCost = humanCost * runsPerDay;
    const annualSavings = (dailyHumanCost - dailyTokenCost) * 250;
    return { tokenCost, humanCost, ratio, dailyTokenCost, dailyHumanCost, annualSavings };
  }, [selectedModel, inputTokensK, outputTokensK, humanMin, hourlyRate, runsPerDay]);

  const allModelCosts = useMemo(() => {
    return MODELS.map((m) => {
      const cost =
        (inputTokensK * 1000 / 1e6) * m.inputPer1M +
        (outputTokensK * 1000 / 1e6) * m.outputPer1M;
      return { ...m, cost };
    }).sort((a, b) => a.cost - b.cost);
  }, [inputTokensK, outputTokensK]);

  const winnerColor =
    result.ratio > 5 ? "#16a34a" : result.ratio > 2 ? "#d97706" : "#dc2626";

  const s = { // shared styles shorthand
    card: { background: "#16161f", borderRadius: 10, padding: "16px 18px", border: "1px solid #1e1e2e" },
    label: { fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", display: "block", marginBottom: 10 },
  };

  return (
    <div style={{ fontFamily: "'Inter', 'system-ui', sans-serif", background: "#0f0f13", minHeight: "100vh", color: "#e8e8f0" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e1e2e", padding: "24px 32px 20px" }}>
        <div style={{ maxWidth: 940, margin: "0 auto" }}>
          <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b7280", fontWeight: 500 }}>Cost Intelligence</span>
          <h1 style={{ margin: "4px 0 2px", fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: "#f0f0f8" }}>Human vs. Token</h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>Find the crossover point where AI stops being cheap</p>
        </div>
      </div>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "28px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Model selector */}
            <div style={s.card}>
              <label style={s.label}>Model</label>
              {MODEL_GROUPS.map((group) => (
                <div key={group.provider} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: group.color, marginBottom: 5, fontWeight: 600 }}>{group.provider}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                    {group.models.map((m) => (
                      <button key={m.id} onClick={() => setSelectedModel(m)} style={{
                        background: selectedModel.id === m.id ? "#1e1e2e" : "transparent",
                        border: selectedModel.id === m.id ? `1px solid ${m.color}` : "1px solid #1e1e2e",
                        borderRadius: 6, padding: "6px 9px", cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: selectedModel.id === m.id ? m.color : "#9ca3af" }}>{m.name}</span>
                          {m.badge && <span style={{ fontSize: 8, background: m.color + "33", color: m.color, borderRadius: 3, padding: "1px 4px", fontWeight: 700 }}>{m.badge}</span>}
                        </div>
                        <div style={{ fontSize: 10, color: "#4b5563", marginTop: 1 }}>${m.inputPer1M}/${m.outputPer1M}/1M</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Task Categories — accordion */}
            <div style={s.card}>
              <label style={s.label}>Task Preset</label>

              {/* Legend */}
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                {Object.entries(ADVANTAGE_META).map(([key, meta]) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: meta.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: "#4b5563" }}>{meta.label}</span>
                  </div>
                ))}
              </div>

              {TASK_CATEGORIES.map((cat) => {
                const catOpen = openCategory === cat.id;
                return (
                  <div key={cat.id} style={{ marginBottom: 6 }}>
                    {/* Top-level category row */}
                    <button
                      onClick={() => setOpenCategory(catOpen ? null : cat.id)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: catOpen ? "#1e1e2e" : "#13131a",
                        border: catOpen ? "1px solid #2a2a3a" : "1px solid #1a1a26",
                        borderRadius: catOpen ? "7px 7px 0 0" : 7,
                        padding: "9px 12px", cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 700, color: catOpen ? "#e8e8f0" : "#9ca3af", letterSpacing: "-0.01em" }}>{cat.label}</span>
                      <span style={{ fontSize: 11, color: "#4b5563", transition: "transform 0.15s", display: "inline-block", transform: catOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                    </button>

                    {catOpen && (
                      <div style={{ border: "1px solid #2a2a3a", borderTop: "none", borderRadius: "0 0 7px 7px", overflow: "hidden" }}>
                        {cat.subcategories.map((sub, si) => {
                          const subOpen = openSubcategory === sub.id;
                          return (
                            <div key={sub.id}>
                              {/* Subcategory row */}
                              <button
                                onClick={() => setOpenSubcategory(subOpen ? null : sub.id)}
                                style={{
                                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                                  background: subOpen ? "#191926" : "#141420",
                                  border: "none",
                                  borderTop: si > 0 ? "1px solid #1e1e2e" : "none",
                                  padding: "8px 14px", cursor: "pointer", transition: "background 0.12s",
                                }}
                              >
                                <span style={{ fontSize: 11, fontWeight: 600, color: subOpen ? "#c4b5fd" : "#6b7280", letterSpacing: "0.02em", textTransform: "uppercase" }}>{sub.label}</span>
                                <span style={{ fontSize: 10, color: "#374151", transition: "transform 0.15s", display: "inline-block", transform: subOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                              </button>

                              {subOpen && (
                                <div style={{ background: "#0f0f13", borderTop: "1px solid #1e1e2e" }}>
                                  {sub.tasks.map((task, ti) => {
                                    const isSelected = selectedTask.label === task.label;
                                    const adv = ADVANTAGE_META[task.advantage];
                                    return (
                                      <button
                                        key={task.label}
                                        onClick={() => handleTaskSelect(task)}
                                        style={{
                                          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                                          background: isSelected ? "#1a1a2e" : "transparent",
                                          border: "none",
                                          borderTop: ti > 0 ? "1px solid #161620" : "none",
                                          padding: "8px 16px 8px 20px",
                                          cursor: "pointer", textAlign: "left", transition: "background 0.1s",
                                        }}
                                      >
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: adv.dot, flexShrink: 0 }} />
                                          <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: 12, color: isSelected ? "#e8e8f0" : "#9ca3af", fontWeight: isSelected ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.label}</div>
                                            <div style={{ fontSize: 10, color: "#374151", marginTop: 1 }}>{task.note}</div>
                                          </div>
                                        </div>
                                        <div style={{ fontSize: 10, color: "#374151", flexShrink: 0, marginLeft: 8, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                                          {task.humanMin}m
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Custom row */}
              <button
                onClick={() => setSelectedTask({ label: "Custom", inputK: null, outputK: null, humanMin: null, advantage: "mixed", note: "Set your own values below" })}
                style={{
                  width: "100%", marginTop: 6,
                  background: selectedTask.label === "Custom" ? "#1e1e2e" : "transparent",
                  border: selectedTask.label === "Custom" ? "1px solid #4b5563" : "1px solid #1e1e2e",
                  borderRadius: 7, padding: "8px 12px", cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                }}
              >
                <span style={{ fontSize: 12, color: selectedTask.label === "Custom" ? "#e8e8f0" : "#4b5563", fontWeight: 500 }}>Custom — set sliders manually</span>
              </button>
            </div>

            {/* Token sliders */}
            <div style={s.card}>
              <label style={s.label}>Token Usage</label>
              {[
                { label: "Input tokens", val: inputTokensK, set: setInputTokensK, max: 200 },
                { label: "Output tokens", val: outputTokensK, set: setOutputTokensK, max: 100 },
              ].map(({ label, val, set, max }) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#e8e8f0", fontVariantNumeric: "tabular-nums" }}>{val}k <span style={{ color: "#4b5563", fontWeight: 400 }}>tokens</span></span>
                  </div>
                  <input type="range" min={1} max={max} value={val} onChange={(e) => set(Number(e.target.value))} style={{ width: "100%", accentColor: selectedModel.color }} />
                </div>
              ))}
            </div>

            {/* Human inputs */}
            <div style={s.card}>
              <label style={s.label}>Human Baseline</label>
              {[
                { label: "Time to complete", val: humanMin, set: setHumanMin, max: 480, suffix: "min" },
                { label: "Fully-loaded hourly rate", val: hourlyRate, set: setHourlyRate, max: 300, suffix: "$/hr" },
                { label: "Runs per day", val: runsPerDay, set: setRunsPerDay, max: 100, suffix: "runs" },
              ].map(({ label, val, set, max, suffix }) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#e8e8f0", fontVariantNumeric: "tabular-nums" }}>{val} <span style={{ color: "#4b5563", fontWeight: 400 }}>{suffix}</span></span>
                  </div>
                  <input type="range" min={1} max={max} value={val} onChange={(e) => set(Number(e.target.value))} style={{ width: "100%", accentColor: "#6b7280" }} />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Active task callout */}
            {selectedTask.label !== "Custom" && (
              <div style={{ background: "#16161f", borderRadius: 10, padding: "12px 16px", border: `1px solid ${ADVANTAGE_META[selectedTask.advantage].dot}33`, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: ADVANTAGE_META[selectedTask.advantage].dot, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8f0" }}>{selectedTask.label}</div>
                  <div style={{ fontSize: 11, color: "#4b5563", marginTop: 1 }}>{selectedTask.note}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: ADVANTAGE_META[selectedTask.advantage].color, flexShrink: 0 }}>{ADVANTAGE_META[selectedTask.advantage].label}</div>
              </div>
            )}

            {/* Main verdict */}
            <div style={{ background: "#16161f", borderRadius: 10, padding: "20px 22px", border: `1px solid ${winnerColor}33` }}>
              <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", marginBottom: 12 }}>Cost per run</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div style={{ background: "#0f0f13", borderRadius: 8, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Token cost</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: selectedModel.color, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{fmt(result.tokenCost)}</div>
                  <div style={{ fontSize: 10, color: "#4b5563", marginTop: 3 }}>{selectedModel.name}</div>
                </div>
                <div style={{ background: "#0f0f13", borderRadius: 8, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Human cost</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#9ca3af", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{fmt(result.humanCost)}</div>
                  <div style={{ fontSize: 10, color: "#4b5563", marginTop: 3 }}>{humanMin}min @ ${hourlyRate}/hr</div>
                </div>
              </div>
              <div style={{ background: "#0f0f13", borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>AI is cheaper by</div>
                <div style={{ fontSize: 42, fontWeight: 800, color: winnerColor, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
                  {fmtMultiplier(result.ratio)}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  {result.ratio > 20 ? "Strong automation case" : result.ratio > 5 ? "Clear AI advantage" : result.ratio > 2 ? "Modest advantage — factor quality" : "Near parity — human may be better"}
                </div>
              </div>
            </div>

            {/* Daily + annual */}
            <div style={s.card}>
              <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", marginBottom: 12 }}>Scale ({runsPerDay} runs/day)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { label: "AI / day", val: result.dailyTokenCost, color: selectedModel.color },
                  { label: "Human / day", val: result.dailyHumanCost, color: "#6b7280" },
                  { label: "Annual savings", val: result.annualSavings, color: "#16a34a" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ background: "#0f0f13", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>{fmt(val)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Model comparison bar chart */}
            <div style={s.card}>
              <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", marginBottom: 12 }}>All models — this task</div>
              {allModelCosts.map((m) => {
                const barPct = Math.max(2, (m.cost / allModelCosts[allModelCosts.length - 1].cost) * 100);
                const isSelected = m.id === selectedModel.id;
                return (
                  <div key={m.id} style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => setSelectedModel(MODELS.find(x => x.id === m.id))}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: isSelected ? "#e8e8f0" : "#6b7280", fontWeight: isSelected ? 600 : 400 }}>{m.name}</span>
                      <span style={{ fontSize: 11, color: isSelected ? m.color : "#4b5563", fontVariantNumeric: "tabular-nums", fontWeight: isSelected ? 600 : 400 }}>{fmt(m.cost)}</span>
                    </div>
                    <div style={{ height: 5, background: "#0f0f13", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${barPct}%`, background: isSelected ? m.color : "#2a2a3a", borderRadius: 3, transition: "width 0.3s ease" }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #1e1e2e" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: "#4b5563" }}>Human equivalent</span>
                  <span style={{ fontSize: 10, color: "#9ca3af", fontVariantNumeric: "tabular-nums" }}>{fmt(result.humanCost)}</span>
                </div>
                <div style={{ height: 5, background: "#0f0f13", borderRadius: 3, overflow: "hidden", marginTop: 3 }}>
                  <div style={{ height: "100%", width: "100%", background: "#374151", borderRadius: 3 }} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
