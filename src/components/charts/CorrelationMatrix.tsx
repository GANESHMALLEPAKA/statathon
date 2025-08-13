import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const correlationData = [
  { original: 0.82, processed: 0.78, pair: 'Age-Income' },
  { original: 0.65, processed: 0.61, pair: 'Education-Income' },
  { original: 0.43, processed: 0.39, pair: 'Age-Education' },
  { original: 0.71, processed: 0.69, pair: 'Income-Region' },
  { original: 0.38, processed: 0.35, pair: 'Gender-Occupation' },
  { original: 0.56, processed: 0.52, pair: 'Education-Occupation' },
  { original: 0.29, processed: 0.26, pair: 'Age-Region' },
  { original: 0.47, processed: 0.44, pair: 'Income-Employment' },
];

export const CorrelationMatrix: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Correlation Preservation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            type="number"
            dataKey="original"
            domain={[0, 1]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Original Correlation', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            type="number"
            dataKey="processed"
            domain={[0, 1]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Processed Correlation', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => [
              `${value.toFixed(3)}`,
              name === 'processed' ? 'Processed' : 'Original'
            ]}
            labelFormatter={(label: any, payload: any) => 
              payload?.[0]?.payload?.pair || ''
            }
            contentStyle={{ 
              backgroundColor: '#f9fafb', 
              border: '1px solid #d1d5db',
              borderRadius: '6px'
            }}
          />
          <Scatter data={correlationData} fill="#3B82F6" />
          
          {/* Perfect correlation line */}
          <Scatter 
            data={[{ original: 0, processed: 0 }, { original: 1, processed: 1 }]} 
            fill="transparent" 
            line={{ stroke: '#DC2626', strokeDasharray: '5 5' }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};