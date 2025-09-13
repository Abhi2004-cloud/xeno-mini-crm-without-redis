"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DeliveryLogs from "./DeliveryLogs";

export default function Campaigns() {
  const { data: session } = useSession();
  const [name, setName] = useState("");

  // dynamic rules state
  const [rules, setRules] = useState([{ field: "spend", operator: ">", value: "" }]);
  const [combinator, setCombinator] = useState("AND");

  const [messageTemplate, setMessageTemplate] = useState("Hi {{name}}, here’s 10% off!");
  const [campaigns, setCampaigns] = useState([]);

  // AI states
  const [objective, setObjective] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  async function fetchCampaigns() {
    const res = await fetch("/api/campaigns");
    const data = await res.json();
    if (data.ok) setCampaigns(data.campaigns);
  }

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // dynamic rule handlers
  function addRule() {
    setRules([...rules, { field: "spend", operator: ">", value: "" }]);
  }
  function updateRule(index, key, val) {
    const newRules = [...rules];
    newRules[index][key] = val;
    setRules(newRules);
  }
  function removeRule(index) {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
  }

  async function previewAudience() {
    const res = await fetch("/api/customers/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules, combinator }),
    });

    const data = await res.json();
    if (data.ok) {
      alert(`Audience size: ${data.audienceSize}`);
    } else {
      alert("Error: " + data.error);
    }
  }

  async function createCampaign() {
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        rules,
        combinator,
        messageTemplate,
      }),
    });
    const data = await res.json();
    if (data.ok) {
      alert(`Campaign created! Audience size: ${data.campaign.audienceSize}`);
      setName("");
      setRules([{ field: "spend", operator: ">", value: "" }]);
      setCombinator("AND");
      setMessageTemplate("Hi {{name}}, here’s 10% off!");
      fetchCampaigns();
    } else {
      alert("Error: " + data.error);
    }
  }

  async function getAISuggestions() {
    setLoadingAI(true);
    setAiSuggestions([]);
    try {
      const res = await fetch("/api/ai/suggest-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objective,
          audienceSummary: JSON.stringify({ rules, combinator }),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setAiSuggestions(data.suggestions);
      } else {
        alert("AI Error: " + data.error);
      }
    } catch (e) {
      alert("AI call failed: " + e.message);
    } finally {
      setLoadingAI(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Create Campaign</h2>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Campaign Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", marginBottom: 8, padding: 6 }}
        />

        {/* Rule Builder */}
        <h4>Rules</h4>
        {rules.map((r, idx) => (
          <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: 6 }}>
            <select value={r.field} onChange={(e) => updateRule(idx, "field", e.target.value)}>
              <option value="spend">Spend</option>
              <option value="visits">Visits</option>
              <option value="inactiveDays">Inactive Days</option>
            </select>
            <select value={r.operator} onChange={(e) => updateRule(idx, "operator", e.target.value)}>
              <option value=">">{">"}</option>
              <option value="<">{"<"}</option>
              <option value="=">=</option>
            </select>
            <input
              type="number"
              value={r.value}
              onChange={(e) => updateRule(idx, "value", e.target.value)}
              placeholder="Value"
            />
            <button onClick={() => removeRule(idx)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addRule}>+ Add Rule</button>

        <div style={{ margin: "8px 0" }}>
          <label>
            Combine with:
            <select value={combinator} onChange={(e) => setCombinator(e.target.value)}>
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </label>
        </div>

        <textarea
          rows={3}
          placeholder="Message template (use {{name}})"
          value={messageTemplate}
          onChange={(e) => setMessageTemplate(e.target.value)}
          style={{ display: "block", marginBottom: 8, padding: 6, width: "100%" }}
        />

        {/* AI Suggestions */}
        <div style={{ marginTop: 10, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Campaign Objective (for AI suggestions)"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            style={{ display: "block", marginBottom: 8, padding: 6, width: "100%" }}
          />
          <button onClick={getAISuggestions} disabled={loadingAI || !objective}>
            {loadingAI ? "Getting suggestions..." : "Get AI Suggestions"}
          </button>

          {aiSuggestions.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <p>Suggestions:</p>
              <ul>
                {aiSuggestions.map((s, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>
                    <button onClick={() => setMessageTemplate(s)} style={{ marginRight: 8 }}>
                      Use
                    </button>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: 12 }}>
          <button type="button" onClick={previewAudience}>Preview Audience</button>
          <button type="button" onClick={createCampaign}>Save Campaign</button>
        </div>
      </div>

      <h2>Past Campaigns</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", marginTop: 12 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Audience Size</th>
            <th>Status</th>
            <th>Sent</th>
            <th>Failed</th>
            <th>Pending</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.audienceSize}</td>
              <td>{c.status}</td>
              <td>{c.stats?.sent}</td>
              <td>{c.stats?.failed}</td>
              <td>{c.stats?.pending}</td>
              <td>{c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Delivery Logs (latest 20)</h2>
      <DeliveryLogs />
    </main>
  );
}

