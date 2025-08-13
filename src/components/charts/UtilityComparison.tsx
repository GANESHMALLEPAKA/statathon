import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { metric: 'Mean', original: 100, processed: 98.5 },
  { metric: 'Std Dev', original: 100, processed: 94.2 },
  { metric: 'Median', original: 100, processed: 99.1 },
  { metric: 'IQR', original: 100, processed: 96.7 },
  { metric: 'Skewness', original: 100, processed: 89.3 },
  { metric: 'Kurtosis', original: 100, processed: 87.6 },
];

export const UtilityComparison: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistical Properties Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
          <YAxis 
            domain={[80, 100]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Preservation (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, '']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: '#f9fafb', 
              border: '1px solid #d1d5db',
              borderRadius: '6px'
            }}
          />
          <Legend />
          <Bar dataKey="original" fill="#3B82F6" name="Original" radius={[2, 2, 0, 0]} />
          <Bar dataKey="processed" fill="#10B981" name="Processed" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};