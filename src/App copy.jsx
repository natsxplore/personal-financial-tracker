import { useState, useEffect } from 'react';
import { db } from './db';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const txs = await db.transactions.orderBy('date').reverse().toArray();
    const buds = await db.budgets.toArray();
    const accs = await db.accounts.toArray();
    const gls = await db.goals.toArray();

    setTransactions(txs);
    setBudgets(buds.length ? buds : defaultBudgets);
    setAccounts(accs.length ? accs : defaultAccounts);
    setGoals(gls.length ? gls : defaultGoals);
  };

  // Default data (para may laman agad)
  const defaultBudgets = [
    { id: 1, name: 'Needs', percentage: 50, budgetAmount: 11550, color: '#3b82f6', icon: '🛒' },
    { id: 2, name: 'Emergency Fund', percentage: 15, budgetAmount: 3150, color: '#22c55e', icon: '🛡️' },
    { id: 3, name: 'House & Lot', percentage: 15, budgetAmount: 3150, color: '#f97316', icon: '🏠' },
    { id: 4, name: 'Marriage Fund', percentage: 10, budgetAmount: 2100, color: '#ec4899', icon: '❤️' },
    { id: 5, name: 'Business/Career', percentage: 5, budgetAmount: 1050, color: '#8b5cf6', icon: '💼' },
    { id: 6, name: 'Fun', percentage: 5, budgetAmount: 1050, color: '#14b8a6', icon: '😊' },
  ];

  const defaultAccounts = [
    { id: 1, name: 'MariBank (Emergency)', balance: 13150, color: '#22c55e' },
    { id: 2, name: 'OwnBank (House & Lot)', balance: 21500, color: '#f97316' },
    { id: 3, name: 'Maya (Marriage Fund)', balance: 7800, color: '#ec4899' },
    { id: 4, name: 'GoTyme (Business/Career)', balance: 4250, color: '#8b5cf6' },
    { id: 5, name: 'Main Account (Spending)', balance: 6825, color: '#6366f1' },
  ];

  const defaultGoals = [
    { id: 1, name: 'Emergency Fund', current: 13150, target: 30000, color: '#22c55e', icon: '🛡️' },
    { id: 2, name: 'House & Lot', current: 21500, target: 50000, color: '#f97316', icon: '🏠' },
    { id: 3, name: 'Marriage Fund', current: 7800, target: 30000, color: '#ec4899', icon: '❤️' },
    { id: 4, name: 'Business/Career', current: 4250, target: 15000, color: '#8b5cf6', icon: '💼' },
  ];

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyNet = 21000; // temporary fixed for design

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <button className="menu-btn">☰</button>
        <div className="header-center">
          <h1>Financial Tracker</h1>
          <div className="month-selector">September 2026 ▾</div>
        </div>
        <button className="notif-btn">🔔</button>
      </header>

      <main className="content">
        {activeTab === 'home' && (
          <>
            {/* Total Monthly Net */}
            <div className="net-card">
              <div className="net-label">Total Monthly Net</div>
              <div className="net-amount">₱{monthlyNet.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
              <div className="wallet-icon">👛</div>
            </div>

            {/* Cutoffs */}
            <div className="cutoffs">
              <div className="cutoff">
                <div className="cutoff-label">Cutoff 1 Net</div>
                <div className="cutoff-amount">₱10,500.00</div>
                <span className="status received">✓ Received</span>
              </div>
              <div className="divider"></div>
              <div className="cutoff">
                <div className="cutoff-label">Cutoff 2 Net</div>
                <div className="cutoff-amount">₱10,500.00</div>
                <span className="status pending">Pending</span>
              </div>
            </div>

            {/* Budget Overview */}
            <section className="section">
              <div className="section-header">
                <h2>Budget Overview</h2>
                <a href="#">View Details →</a>
              </div>

              <div className="budget-list">
                {budgets.map(b => {
                  const spent = b.name === 'Needs' ? 7000 :
                                b.name === 'Emergency Fund' ? 3150 :
                                b.name === 'House & Lot' ? 3150 :
                                b.name === 'Marriage Fund' ? 1600 :
                                b.name === 'Business/Career' ? 900 : 600;
                  const remaining = b.budgetAmount - spent;
                  const percent = Math.min((spent / b.budgetAmount) * 100, 100);

                  return (
                    <div className="budget-item" key={b.id}>
                      <div className="budget-icon" style={{ background: b.color + '22', color: b.color }}>
                        {b.icon}
                      </div>
                      <div className="budget-info">
                        <div className="budget-name">
                          {b.name} <span>({b.percentage}%)</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${percent}%`, background: b.color }}></div>
                        </div>
                        <div className="budget-amount">Budget: ₱{b.budgetAmount.toLocaleString()}</div>
                      </div>
                      <div className="budget-stats">
                        <div className="spent">₱{spent.toLocaleString()}</div>
                        <div className="remaining" style={{ color: remaining > 0 ? b.color : '#ef4444' }}>
                          ₱{remaining.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Accounts + Goals */}
            <div className="two-col">
              <section className="section">
                <div className="section-header">
                  <h2>Accounts</h2>
                  <a href="#">View All</a>
                </div>
                <div className="accounts-list">
                  {accounts.map(a => (
                    <div className="account-item" key={a.id}>
                      <div className="account-icon" style={{ background: a.color + '22', color: a.color }}>🏦</div>
                      <div className="account-name">{a.name}</div>
                      <div className="account-balance">₱{a.balance.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="section">
                <div className="section-header">
                  <h2>Goals Progress</h2>
                  <a href="#">View All</a>
                </div>
                <div className="goals-list">
                  {goals.map(g => {
                    const percent = Math.round((g.current / g.target) * 100);
                    return (
                      <div className="goal-item" key={g.id}>
                        <div className="goal-header">
                          <span>{g.icon} {g.name}</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${percent}%`, background: g.color }}></div>
                        </div>
                        <div className="goal-amount">₱{g.current.toLocaleString()} / ₱{g.target.toLocaleString()}</div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Recent Transactions */}
            <section className="section">
              <div className="section-header">
                <h2>Recent Transactions</h2>
                <a href="#">View All →</a>
              </div>
              <div className="transactions-list">
                <div className="tx-item">
                  <div className="tx-icon income">↓</div>
                  <div className="tx-info">
                    <div className="tx-title">Salary – Cutoff 1</div>
                    <div className="tx-date">Sep 15, 2026</div>
                  </div>
                  <div className="tx-amount income">+ ₱10,500.00</div>
                </div>
                <div className="tx-item">
                  <div className="tx-icon expense">🛒</div>
                  <div className="tx-info">
                    <div className="tx-title">Groceries</div>
                    <div className="tx-date">Sep 16, 2026 • Needs</div>
                  </div>
                  <div className="tx-amount expense">- ₱350.00</div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab !== 'home' && (
          <div className="coming-soon">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Page</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
          <span>🏠</span>
          <small>Home</small>
        </button>
        <button className={activeTab === 'budget' ? 'active' : ''} onClick={() => setActiveTab('budget')}>
          <span>📊</span>
          <small>Budget</small>
        </button>
        <button className={activeTab === 'transactions' ? 'active' : ''} onClick={() => setActiveTab('transactions')}>
          <span>📋</span>
          <small>Transactions</small>
        </button>
        <button className={activeTab === 'goals' ? 'active' : ''} onClick={() => setActiveTab('goals')}>
          <span>🎯</span>
          <small>Goals</small>
        </button>
        <button className={activeTab === 'accounts' ? 'active' : ''} onClick={() => setActiveTab('accounts')}>
          <span>🏦</span>
          <small>Accounts</small>
        </button>
      </nav>
    </div>
  );
}

export default App;