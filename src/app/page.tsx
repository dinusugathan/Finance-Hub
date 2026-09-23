import Dashboard from '@/components/Dashboard';
import { getDashboardStats, getRecentExpenses, getMonthlyTrend } from '@/actions/expenseActions';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const stats = await getDashboardStats();
  const recentExpenses = await getRecentExpenses();
  const monthlyTrend = await getMonthlyTrend();

  return (
    <Dashboard 
      stats={stats} 
      recentExpenses={recentExpenses} 
      monthlyTrend={monthlyTrend} 
    />
  );
}
