import React from 'react';
import { Clock, Upload, Shield, BarChart, FileText } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'upload',
      title: 'Dataset uploaded: household_survey_2024.csv',
      description: '50,000 records processed',
      time: '2 minutes ago',
      icon: Upload,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 2,
      type: 'risk',
      title: 'Risk assessment completed',
      description: 'High risk: 1,247 records identified',
      time: '3 minutes ago',
      icon: Shield,
      color: 'text-amber-600 bg-amber-100'
    },
    {
      id: 3,
      type: 'utility',
      title: 'Utility metrics calculated',
      description: 'Statistical accuracy: 94.2%',
      time: '5 minutes ago',
      icon: BarChart,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 4,
      type: 'report',
      title: 'Compliance report generated',
      description: 'DPDP Act 2023 assessment complete',
      time: '8 minutes ago',
      icon: FileText,
      color: 'text-purple-600 bg-purple-100'
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Clock className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`rounded-lg p-2 ${activity.color} flex-shrink-0`}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};