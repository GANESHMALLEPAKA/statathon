import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { RiskAssessment } from './components/RiskAssessment';
import { PrivacyEnhancement } from './components/PrivacyEnhancement';
import { UtilityMeasurement } from './components/UtilityMeasurement';
import { Reports } from './components/Reports';
import { DataProvider } from './context/DataContext';

type ActiveTab = 'dashboard' | 'risk' | 'privacy' | 'utility' | 'reports';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'risk':
        return <RiskAssessment />;
      case 'privacy':
        return <PrivacyEnhancement />;
      case 'utility':
        return <UtilityMeasurement />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="container mx-auto px-6 py-8 max-w-7xl">
          {renderActiveComponent()}
        </main>
      </div>
    </DataProvider>
  );
}

export default App;