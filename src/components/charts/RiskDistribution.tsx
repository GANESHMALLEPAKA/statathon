import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RiskDistributionProps {
  analysisResults?: any;
}

export const RiskDistribution: React.FC<RiskDistributionProps> = ({ analysisResults }) => {
  const data = analysisResults?.riskDistribution || [
    { name: 'No Data Available', value: 1, color: '#9CA3AF' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [value.toLocaleString(), 'Records']}
            contentStyle={{ 
              backgroundColor: '#f9fafb', 
              border: '1px solid #d1d5db',
              borderRadius: '6px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};