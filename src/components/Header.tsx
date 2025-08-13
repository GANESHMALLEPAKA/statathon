import React from 'react';
import { Shield, BarChart3, Lock, TrendingUp, FileText } from 'lucide-react';

type ActiveTab = 'dashboard' | 'risk' | 'privacy' | 'utility' | 'reports';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'risk' as const, label: 'Risk Assessment', icon: Shield },
    { id: 'privacy' as const, label: 'Privacy Enhancement', icon: Lock },
    { id: 'utility' as const, label: 'Utility Measurement', icon: TrendingUp },
    { id: 'reports' as const, label: 'Reports', icon: FileText },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SafeData Pipeline</h1>
                <p className="text-sm text-gray-600">National Statistical Office - Privacy Enhancement Tool</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            DPDP Act 2023 Compliant
          </div>
        </div>
        
        <nav className="flex space-x-8 -mb-px">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};