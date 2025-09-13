// app/campaigns/CampaignsClient.jsx
"use client";
import { useEffect, useState } from "react";
import DeliveryLogs from "./DeliveryLogs";

export default function CampaignsClient() {
  const [name, setName] = useState("");
  const [rules, setRules] = useState([{ field: "spend", operator: ">", value: "" }]);
  const [combinator, setCombinator] = useState("AND");
  const [messageTemplate, setMessageTemplate] = useState("Hi {{name}}, here’s 10% off!");
  const [campaigns, setCampaigns] = useState([]);

  // AI
  const [objective, setObjective] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  async function fetchCampaigns() {
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      if (data.ok) setCampaigns(data.campaigns);
    } catch (e) {
      console.error("fetchCampaigns error", e);
    }
  }

  useEffect(() => {
    fetchCampaigns();
  }, []);

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
    try {
      const res = await fetch("/api/customers/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules, combinator }),
      });
      const data = await res.json();
      if (data.ok) alert(`Audience size: ${data.audienceSize}`);
      else alert("Error: " + data.error);
    } catch (e) {
      alert("Preview failed: " + e.message);
    }
  }

  async function createCampaign() {
    try {
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
    } catch (e) {
      alert("Create failed: " + e.message);
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
      if (data.ok) setAiSuggestions(data.suggestions || []);
      else alert("AI Error: " + data.error);
    } catch (e) {
      alert("AI call failed: " + e.message);
    } finally {
      setLoadingAI(false);
    }
  }

  return (
    <main className="container py-5">
      <h2 className="mb-4">Create Campaign</h2>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Campaign Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
          </div>

          <h5 className="mt-3">Rules</h5>
          {rules.map((r, idx) => (
            <div className="row g-2 align-items-center mb-2" key={idx}>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={r.field}
                  onChange={(e) => updateRule(idx, "field", e.target.value)}
                >
                  <option value="spend">Spend</option>
                  <option value="visits">Visits</option>
                  <option value="inactiveDays">Inactive Days</option>
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={r.operator}
                  onChange={(e) => updateRule(idx, "operator", e.target.value)}
                >
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value="=">=</option>
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Value"
                  value={r.value}
                  onChange={(e) => updateRule(idx, "value", e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeRule(idx)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary mb-3" onClick={addRule}>
            + Add Rule
          </button>

          <div className="mb-3">
            <label className="form-label me-2">Combine with:</label>
            <select
              className="form-select w-auto d-inline-block"
              value={combinator}
              onChange={(e) => setCombinator(e.target.value)}
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </div>

          <textarea
            rows={3}
            className="form-control mb-3"
            placeholder="Message template (use {{name}})"
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
          />

          <div className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Campaign Objective (for AI suggestions)"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
            />
            <button
              className="btn btn-warning"
              onClick={getAISuggestions}
              disabled={loadingAI || !objective}
            >
              {loadingAI ? "Getting suggestions..." : "Get AI Suggestions"}
            </button>

            {aiSuggestions.length > 0 && (
              <div className="mt-3">
                <p>Suggestions:</p>
                <ul className="list-group">
                  {aiSuggestions.map((s, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between">
                      <span>{s}</span>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => setMessageTemplate(s)}
                      >
                        Use
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-info" onClick={previewAudience}>
              Preview Audience
            </button>
            <button type="button" className="btn btn-success" onClick={createCampaign}>
              Save Campaign
            </button>
          </div>
        </div>
      </div>

      <h2 className="mt-4">Past Campaigns</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover mt-3">
          <thead className="table-dark">
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
      </div>

      <h2 className="mt-4">Delivery Logs (latest 20)</h2>
      <DeliveryLogs />
    </main>
  );
}
