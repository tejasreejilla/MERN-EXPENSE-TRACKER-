import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// Purple theme colors for charts
const PURPLE_COLORS = ['#9333ea', '#a855f7', '#c084fc', '#e9d5ff', '#7e22ce', '#6b21a8', '#d8b4fe', '#f3e8ff'];

const Charts = ({ statistics }) => {
  const categoryData = Object.entries(statistics.categoryBreakdown || {}).map(([name, data]) => ({
    name,
    income: data.income,
    expense: data.expense,
  }));

  const expensePieData = Object.entries(statistics.categoryBreakdown || {})
    .filter(([, data]) => data.expense > 0)
    .map(([name, data]) => ({
      name,
      value: data.expense,
    }));

  const monthlyData = Object.entries(statistics.monthlyData || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      income: data.income,
      expense: data.expense,
    }));

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Hide labels for small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="card">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-6">
          Expense by Category
        </h3>
        {expensePieData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={expensePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={110}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {expensePieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PURPLE_COLORS[index % PURPLE_COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #9333ea',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {expensePieData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: PURPLE_COLORS[index % PURPLE_COLORS.length] }}
                  />
                  <span className="text-sm text-gray-700 font-medium">{entry.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center py-8">No expense data available</p>
        )}
      </div>

      <div className="card">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-6">
          Income vs Expenses by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
            <XAxis dataKey="name" stroke="#6b21a8" />
            <YAxis stroke="#6b21a8" />
            <Tooltip 
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '2px solid #9333ea',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#9333ea" name="Expense" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {monthlyData.length > 0 && (
        <div className="card lg:col-span-2">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-6">
            Monthly Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
              <XAxis dataKey="month" stroke="#6b21a8" />
              <YAxis stroke="#6b21a8" />
              <Tooltip 
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '2px solid #9333ea',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={3} 
                name="Income"
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#9333ea" 
                strokeWidth={3} 
                name="Expense"
                dot={{ fill: '#9333ea', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Charts;
