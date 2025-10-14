import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useFinanceData } from "../contexts/FinanceContext";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#4CAF50",
  "#F44336",
  "#03A9F4",
  "#9C27B0",
];

const ExpenseChart: React.FC = () => {
  const { expensesByCategory } = useFinanceData();

  const data = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  return (
    <div className="w-full h-80 bg-white rounded-2xl shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Витрати за категоріями</h2>
      {data.length === 0 ? (
        <p className="text-center text-gray-500">Немає даних для відображення</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value} ₴`}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value} ₴`} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ExpenseChart;