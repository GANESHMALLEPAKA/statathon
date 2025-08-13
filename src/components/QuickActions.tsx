import React from 'react';
import { useDataContext } from '../context/DataContext';
import { Shield, Lock, BarChart3, FileText, Zap, Settings } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const { originalData, processedData } = useDataContext();

  const actions = [
    {
      id: 'assess',
      title: 'Run Risk Assessment',
      description: 'Analyze re-identification risks',
      icon: Shield,
      color: 'text-red-600 bg-red-50 border-red-200',
      enabled: !!originalData,
      urgent: !processedData
    },
    {
      id: 'enhance',
      title: 'Apply Privacy Enhancement',
      description: 'SDC, DP, or Synthetic Data',
      icon: Lock,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      enabled: !!originalData,
      urgent: false
    },
    {
      id: 'measure',
      title: 'Measure Utility Impact',
      description: 'Compare statistical accuracy',
      icon: BarChart3,
      color: 'text-green-600 bg-green-50 border-green-200',
      enabled: !!processedData,
      urgent: false
    },
    {
      id: 'report',
      title: 'Generate Report',
      description: 'Comprehensive analysis',
      icon: FileText,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      enabled: !!originalData,
      urgent: false
    },
    {
      id: 'auto',
      title: 'Auto-Optimize',
      description: 'AI-powered recommendations',
      icon: Zap,
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      enabled: !!originalData,
      urgent: false
    },
    {
      id: 'configure',
      title: 'Advanced Settings',
      description: 'Custom parameters',
      icon: Settings,
      color: 'text-gray-600 bg-gray-50 border-gray-200',
      enabled: true,
      urgent: false
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            disabled={!action.enabled}
            className={`relative p-4 rounded-lg border-2 text-left transition-all duration-200 ${
              action.enabled
                ? `${action.color} hover:shadow-md cursor-pointer`
                : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
            } ${action.urgent ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}
          >
            {action.urgent && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
            <div className="flex items-center mb-2">
              <action.icon className="h-5 w-5 mr-2" />
              <span className="font-medium text-sm">{action.title}</span>
            </div>
            <p className="text-xs opacity-75">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};