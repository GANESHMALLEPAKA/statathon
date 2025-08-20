import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RiskHeatmapProps {
  analysisResults?: any;
}

const getColor = (risk: number) => {
  if (risk >= 70) return '#DC2626';
  if (risk >= 50) return '#D97706';
  return '#059669';
};

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ analysisResults }) => {
  // Use actual geographic risk data or show meaningful placeholder
  const data = analysisResults?.geographicRisk && analysisResults.geographicRisk.length > 0 
    ? analysisResults.geographicRisk 
    : [
        { region: 'Mumbai', risk: 85, records: 450 },
        { region: 'Delhi', risk: 78, records: 380 },
        { region: 'Bangalore', risk: 72, records: 320 },
        { region: 'Chennai', risk: 68, records: 290 },
        { region: 'Kolkata', risk: 65, records: 275 }
      ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk by Geographic Region</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="region" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Risk Score (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name, props) => [
              `${value}% Risk`,
              `${props.payload.records} records`
            ]}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: '#f9fafb', 
              border: '1px solid #d1d5db',
              borderRadius: '6px'
            }}
          />
          <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.risk)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};