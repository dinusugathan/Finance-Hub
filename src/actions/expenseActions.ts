'use server';

import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns';
import { revalidatePath } from 'next/cache';

export async function getDashboardStats() {
  const now = new Date();
  
  const [dailyExpenses, monthlyExpenses, yearlyExpenses] = await Promise.all([
    prisma.expense.aggregate({
      _sum: { totalAmount: true },
      where: { date: { gte: startOfDay(now), lte: endOfDay(now) } }
    }),
    prisma.expense.aggregate({
      _sum: { totalAmount: true },
      where: { date: { gte: startOfMonth(now), lte: endOfMonth(now) } }
    }),
    prisma.expense.aggregate({
      _sum: { totalAmount: true },
      where: { date: { gte: startOfYear(now), lte: endOfYear(now) } }
    })
  ]);

  return {
    daily: dailyExpenses._sum.totalAmount || 0,
    monthly: monthlyExpenses._sum.totalAmount || 0,
    yearly: yearlyExpenses._sum.totalAmount || 0,
  };
}

export async function getRecentExpenses() {
  return prisma.expense.findMany({
    orderBy: { date: 'desc' },
    take: 10
  });
}

export async function getMonthlyTrend() {
  // Aggregate expenses for the last 6 months
  const now = new Date();
  const sixMonthsAgo = startOfMonth(subMonths(now, 5));
  
  const expenses = await prisma.expense.findMany({
    where: { date: { gte: sixMonthsAgo } },
    select: { date: true, totalAmount: true }
  });
  
  // Group by month
  const grouped = expenses.reduce((acc, curr) => {
    const month = curr.date.toLocaleString('default', { month: 'short', year: '2-digit' });
    acc[month] = (acc[month] || 0) + curr.totalAmount;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(grouped).map(([name, total]) => ({ name, total }));
}

export async function deleteExpense(id: string) {
  await prisma.expense.delete({ where: { id } });
  revalidatePath('/');
}
