import React from 'react';
import { useDataContext } from '../context/DataContext';
import { FileUpload } from './FileUpload';
import { MetricsOverview } from './MetricsOverview';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';

export const Dashboard: React.FC = () => {
  const { originalData, riskMetrics } = useDataContext();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">SafeData Pipeline Dashboard</h2>
        <p className="text-gray-600 mb-6">
          Comprehensive privacy enhancement for NSO microdata release with DPDP Act 2023 compliance
        </p>
        
        {!originalData ? (
          <FileUpload />
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">✓</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Dataset Loaded Successfully</h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>File: {originalData.fileName}</p>
                  <p>Records: {originalData.data.length.toLocaleString()}</p>
                  <p>Columns: {originalData.headers.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {originalData && (
        <>
          <MetricsOverview />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentActivity />
            <QuickActions />
          </div>
        </>
      )}
    </div>
  );
};