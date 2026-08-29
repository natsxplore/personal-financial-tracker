import { useState, useEffect } from 'react';
import { db } from './db';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: 'expense',
    amount: '',
    category: '',
    note: ''
  });

  // Load data
  const loadTransactions = async () => {
    const data = await db.transactions.orderBy('date').reverse().toArray();
    setTransactions(data);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Add transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return;

    await db.transactions.add({
      ...form,
      amount: parseFloat(form.amount)
    });

    setForm({
      date: new Date().toISOString().slice(0, 10),
      type: 'expense',
      amount: '',
      category: '',
      note: ''
    });

    loadTransactions();
  };

  // Delete
  const handleDelete = async (id) => {
    if (confirm('Delete this transaction?')) {
      await db.transactions.delete(id);
      loadTransactions();
    }
  };

  // Summary
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  // Export JSON
  const handleExport = async () => {
    const data = await db.transactions.toArray();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const imported = JSON.parse(text);

    if (Array.isArray(imported)) {
      if (confirm(`Import ${imported.length} transactions? Current data will be replaced.`)) {
        await db.transactions.clear();
        await db.transactions.bulkAdd(imported);
        loadTransactions();
      }
    }
  };

  return (
    <div className="container">
      <h1>💰 Financial Tracker</h1>

      {/* Summary */}
      <div className="summary">
        <div className="income">Income: ₱{income.toFixed(2)}</div>
        <div className="expense">Expense: ₱{expense.toFixed(2)}</div>
        <div className="balance">Balance: ₱{balance.toFixed(2)}</div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          required
        />
        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          step="0.01"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Note (optional)"
          value={form.note}
          onChange={e => setForm({ ...form, note: e.target.value })}
        />
        <button type="submit">Add Transaction</button>
      </form>

      {/* Actions */}
      <div className="actions">
        <button onClick={handleExport}>Export JSON</button>
        <label className="import-btn">
          Import JSON
          <input type="file" accept=".json" onChange={handleImport} hidden />
        </label>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Note</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className={t.type}>
                <td>{t.date}</td>
                <td>{t.type}</td>
                <td>{t.category}</td>
                <td>₱{t.amount.toFixed(2)}</td>
                <td>{t.note || '-'}</td>
                <td>
                  <button onClick={() => handleDelete(t.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;