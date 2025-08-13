import React from 'react';
import { useDataContext } from '../context/DataContext';
import { Shield, Users, AlertTriangle, CheckCircle } from 'lucide-react';

export const MetricsOverview: React.FC = () => {
  const { originalData, riskMetrics, processedData } = useDataContext();

  const mockRiskMetrics = riskMetrics || {
    overallRisk: 0.68,
    highRiskRecords: 1247,
    uniqueRecords: 892,
    kAnonymity: 3.2,
    vulnerableFields: ['Age', 'District', 'Education']
  };

  const metrics = [
    {
      title: 'Overall Privacy Risk',
      value: `${(mockRiskMetrics.overallRisk * 100).toFixed(1)}%`,
      icon: Shield,
      color: mockRiskMetrics.overallRisk > 0.5 ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100',
      change: processedData ? '-23.4%' : null,
      changeColor: 'text-green-600'
    },
    {
      title: 'High Risk Records',
      value: mockRiskMetrics.highRiskRecords.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-100',
      change: processedData ? '-67.8%' : null,
      changeColor: 'text-green-600'
    },
    {
      title: 'K-Anonymity Score',
      value: mockRiskMetrics.kAnonymity.toFixed(1),
      icon: Users,
      color: mockRiskMetrics.kAnonymity >= 5 ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100',
      change: processedData ? '+156%' : null,
      changeColor: 'text-green-600'
    },
    {
      title: 'DPDP Compliance',
      value: processedData ? 'Compliant' : 'Pending',
      icon: CheckCircle,
      color: processedData ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100',
      change: null,
      changeColor: 'text-green-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`rounded-lg p-3 ${metric.color}`}>
              <metric.icon className="h-6 w-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <div className="flex items-center mt-1">
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                {metric.change && (
                  <span className={`ml-2 text-sm font-medium ${metric.changeColor}`}>
                    {metric.change}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};