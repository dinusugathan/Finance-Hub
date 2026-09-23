'use client';
import { useState } from 'react';
import { PlusCircle, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import UploadModal from './UploadModal';
import ExpenseChart from './ExpenseChart';
import ExpenseList from './ExpenseList';

export default function Dashboard({ stats, recentExpenses, monthlyTrend }: { stats: any, recentExpenses: any[], monthlyTrend: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadSuccess = () => {
    setIsModalOpen(false);
    window.location.reload(); // Simple way to refresh data
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-1px' }}>Finance Hub</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage your company expenses effortlessly.</p>
        </div>
        <button className="btn" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', padding: '12px 24px' }}>
          <PlusCircle size={20} />
          Upload Invoice
        </button>
      </header>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '15px', borderRadius: '12px', color: 'var(--accent-color)' }}>
            <DollarSign size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Today's Expenses</p>
            <h2 style={{ fontSize: '2rem', marginTop: '5px' }}>${stats.daily.toFixed(2)}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '15px', borderRadius: '12px', color: 'var(--success-color)' }}>
            <Calendar size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>This Month</p>
            <h2 style={{ fontSize: '2rem', marginTop: '5px' }}>${stats.monthly.toFixed(2)}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '15px', borderRadius: '12px', color: 'var(--danger-color)' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>This Year</p>
            <h2 style={{ fontSize: '2rem', marginTop: '5px' }}>${stats.yearly.toFixed(2)}</h2>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px' }}>
        {/* Chart Section */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '10px' }}>Monthly Trend</h3>
          <ExpenseChart data={monthlyTrend} />
        </div>

        {/* Recent Expenses List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '10px' }}>Recent Expenses</h3>
          <ExpenseList expenses={recentExpenses} />
        </div>
      </div>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUploadSuccess={handleUploadSuccess} />
    </div>
  );
}
