'use client';
import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { deleteExpense } from '@/actions/expenseActions';

export default function ExpenseList({ expenses }: { expenses: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      startTransition(() => {
        deleteExpense(id);
      });
    }
  };

  if (!expenses || expenses.length === 0) {
    return <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No recent expenses found.</p>;
  }

  return (
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '12px 15px' }}>Date</th>
            <th style={{ padding: '12px 15px' }}>Vendor</th>
            <th style={{ padding: '12px 15px' }}>Category</th>
            <th style={{ padding: '12px 15px' }}>Amount</th>
            <th style={{ padding: '12px 15px' }}>Action</th>
          </tr>
        </thead>
        <tbody style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s' }}>
          {expenses.map((expense) => (
            <tr key={expense.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '12px 15px' }}>{new Date(expense.date).toLocaleDateString()}</td>
              <td style={{ padding: '12px 15px', fontWeight: 500 }}>{expense.vendor}</td>
              <td style={{ padding: '12px 15px' }}>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                  {expense.category || 'Other'}
                </span>
              </td>
              <td style={{ padding: '12px 15px', fontWeight: 600 }}>${expense.totalAmount.toFixed(2)}</td>
              <td style={{ padding: '12px 15px' }}>
                <button 
                  onClick={() => handleDelete(expense.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '4px' }}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
