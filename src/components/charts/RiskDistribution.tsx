import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RiskDistributionProps {
  analysisResults?: any;
}

export const RiskDistribution: React.FC<RiskDistributionProps> = ({ analysisResults }) => {
  // Use actual risk distribution or show meaningful placeholder
  const data = analysisResults?.riskDistribution && analysisResults.riskDistribution.length > 0 
    ? analysisResults.riskDistribution 
    : [
        { name: 'Low Risk (k≥10)', value: 65, color: '#059669' },
        { name: 'Medium Risk (3≤k<10)', value: 25, color: '#D97706' },
        { name: 'High Risk (k<3)', value: 10, color: '#DC2626' }
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