'use client';

import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [formState, setFormState] = useState({ name: '', email: '', company: '', role: '' });
  const [formMessage, setFormMessage] = useState({ text: '', isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const policyDbId = '91ed6a9d-02c6-442a-8c30-b058fffbb5ae';
  const waitlistDbId = 'e3bd1017-3951-444f-9634-8306ef607c10';

  useEffect(() => {
    async function fetchPolicies() {
      try {
        const res = await fetch(`https://stg-app.baget.ai/api/public/databases/${policyDbId}/rows`);
        const rows = await res.json();
        setPolicies(rows || []);
      } catch (err) {
        console.error('Failed to load policies');
      }
    }
    fetchPolicies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage({ text: '', isError: false });

    try {
      const res = await fetch(`https://stg-app.baget.ai/api/public/databases/${waitlistDbId}/rows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formState })
      });

      if (res.ok) {
        setFormMessage({ text: 'Confirmed. You are in the queue for the Q2 Beta cohort.', isError: false });
        setFormState({ name: '', email: '', company: '', role: '' });
      } else {
        throw new Error();
      }
    } catch (err) {
      setFormMessage({ text: 'Sync failed. Please check your connection.', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <header>
        <div className="container">
          <nav>
            <a href="#" className="logo">Vigilant</a>
            <div className="nav-links">
              <a href="#vision">Vision</a>
              <a href="#how-it-works">Process</a>
              <a href="#policies">Policies</a>
              <a href="#beta" style={{ color: 'var(--accent-color)' }}>Access Beta</a>
            </div>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <span className="hero-label">High-Trust Architectural Oversight</span>
          <h1>The Automated Staff Engineer for Scaling Teams.</h1>
          <p>Recover 30% of your senior capacity. Vigilant enforces design patterns and prevents structural debt before the merge.</p>
          <div className="hero-img-container">
            <img src="images/a-high-end-minimalist-software-architec.png" alt="Architectural Integrity Dashboard" />
          </div>
        </div>
      </section>

      <section id="vision">
        <div className="container">
          <div className="section-title">
            <h2>Stop the Scaling Chaos.</h2>
            <p>As teams grow from 20 to 100+ developers, architectural consistency collapses. Senior engineers become bottlenecks, spending hours correcting repetitive pattern violations in PRs.</p>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Design Pattern Enforcement</h3>
              <p>Ensures new code follows established patterns like Service/Repository or Hexagonal architecture automatically.</p>
            </div>
            <div className="feature-card">
              <h3>Dependency Integrity</h3>
              <p>Flags circular dependencies and layer violations proactively, maintaining a clean system boundary.</p>
            </div>
            <div className="feature-card">
              <h3>Knowledge Transfer</h3>
              <p>Prevents "reinventing the wheel" by linking PRs to existing internal utilities and shared patterns.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works">
        <div className="container">
          <div className="section-title">
            <h2>Contextual Alignment. Not Just Linting.</h2>
            <p>Standard linters check syntax. Vigilant understands the system. It ingests your entire repository context to provide high-reasoning architectural feedback.</p>
          </div>
          <div style={{ padding: '40px', border: '1px solid var(--border-color)', background: '#fdfdfc' }}>
            <h3 style={{ marginBottom: '20px' }}>The Analysis Loop</h3>
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '250px', borderRight: '1px solid var(--border-color)', paddingRight: '30px' }}>
                <h4 style={{ color: 'var(--accent-color)', marginBottom: '10px' }}>01. Ingest</h4>
                <p style={{ fontSize: '14px' }}>Raw Git diffs are streamed to our High-Reasoning Engine (GPT-4o) with repo-wide context mapping.</p>
              </div>
              <div style={{ flex: '1', minWidth: '250px', borderRight: '1px solid var(--border-color)', paddingRight: '30px' }}>
                <h4 style={{ color: 'var(--accent-color)', marginBottom: '10px' }}>02. Verify</h4>
                <p style={{ fontSize: '14px' }}>Changes are validated against "Policy as Code" definitions stored in your global architectural database.</p>
              </div>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <h4 style={{ color: 'var(--accent-color)', marginBottom: '10px' }}>03. Advise</h4>
                <p style={{ fontSize: '14px' }}>Automated Staff Engineer comments are posted inline on GitHub, suggesting specific structural fixes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="policies">
        <div className="container">
          <div className="section-title">
            <h2>Architectural Guardrails</h2>
            <p>Lead Architects define rules in plain English. Vigilant enforces them across every pull request. Active standards:</p>
          </div>
          <div id="policy-display">
            {policies.length > 0 ? policies.map((row, idx) => (
              <div key={idx} className="policy-item">
                <div className="policy-name">{row.data.name}</div>
                <div className="policy-desc">
                  {row.data.description}
                  <br /><br />
                  <code style={{ fontSize: '12px', color: '#64748B' }}>Rule: {row.data.rule_definition}</code>
                </div>
              </div>
            )) : <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Syncing with Policy Engine...</p>}
          </div>
        </div>
      </section>

      <section id="beta" className="form-section">
        <div className="container">
          <h2>Join the Private Beta</h2>
          <p>Limited to teams of 50-200 developers. Scale without the debt.</p>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Full Name" 
              required 
              value={formState.name}
              onChange={e => setFormState({...formState, name: e.target.value})}
            />
            <input 
              type="email" 
              placeholder="Work Email" 
              required 
              value={formState.email}
              onChange={e => setFormState({...formState, email: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Company Name" 
              required 
              value={formState.company}
              onChange={e => setFormState({...formState, company: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Engineering Role"
              value={formState.role}
              onChange={e => setFormState({...formState, role: e.target.value})}
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Syncing...' : 'Request Early Access'}
            </button>
            {formMessage.text && (
              <div style={{ marginTop: '20px', color: formMessage.isError ? '#E11D48' : '#C9A96E', fontWeight: 600 }}>
                {formMessage.text}
              </div>
            )}
          </form>
        </div>
      </section>

      <footer>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
          <div>&copy; 2026 Vigilant. High-Trust Oversight.</div>
          <div>Built for Mid-Market SaaS.</div>
        </div>
      </footer>
    </main>
  );
}