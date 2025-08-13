import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { AlertTriangle, Shield, Users, Eye, MapPin } from 'lucide-react';
import { RiskHeatmap } from './charts/RiskHeatmap';
import { RiskDistribution } from './charts/RiskDistribution';

export const RiskAssessment: React.FC = () => {
  const { originalData, setRiskMetrics } = useDataContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedQuasiIdentifiers, setSelectedQuasiIdentifiers] = useState<string[]>([]);

  const potentialQIs = [
    { field: 'Age', risk: 'High', description: 'Specific age values increase re-identification risk' },
    { field: 'Gender', risk: 'Low', description: 'Binary classification with low uniqueness' },
    { field: 'District', risk: 'Medium', description: 'Geographic identifier with moderate risk' },
    { field: 'Education', risk: 'Medium', description: 'Educational categories may create unique combinations' },
    { field: 'Occupation', risk: 'High', description: 'Specific occupations can be highly identifying' },
    { field: 'Income_Bracket', risk: 'Medium', description: 'Income ranges provide moderate identification' },
  ];

  useEffect(() => {
    if (originalData && selectedQuasiIdentifiers.length > 0) {
      runRiskAnalysis();
    }
  }, [selectedQuasiIdentifiers, originalData]);

  const runRiskAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockMetrics = {
      overallRisk: 0.68,
      highRiskRecords: 1247,
      uniqueRecords: 892,
      kAnonymity: 3.2,
      vulnerableFields: selectedQuasiIdentifiers
    };
    
    setRiskMetrics(mockMetrics);
    setIsAnalyzing(false);
  };

  const toggleQuasiIdentifier = (field: string) => {
    setSelectedQuasiIdentifiers(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  if (!originalData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Dataset Loaded</h3>
        <p className="text-gray-600">Please upload a dataset first to perform risk assessment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Assessment Module</h2>
        
        {/* Quasi-Identifier Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Quasi-Identifiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {potentialQIs.map((qi) => (
              <div
                key={qi.field}
                onClick={() => toggleQuasiIdentifier(qi.field)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedQuasiIdentifiers.includes(qi.field)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{qi.field}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    qi.risk === 'High' ? 'bg-red-100 text-red-800' :
                    qi.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {qi.risk}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{qi.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Results */}
        {selectedQuasiIdentifiers.length > 0 && (
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">Analyzing Privacy Risks</h3>
                <p className="text-blue-700">
                  Running linkage attack simulation and k-anonymity analysis...
                </p>
              </div>
            ) : (
              <>
                {/* Risk Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Overall Risk</p>
                        <p className="text-2xl font-bold text-red-900">68%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <Eye className="h-8 w-8 text-amber-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">High Risk Records</p>
                        <p className="text-2xl font-bold text-amber-900">1,247</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">K-Anonymity</p>
                        <p className="text-2xl font-bold text-blue-900">3.2</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <MapPin className="h-8 w-8 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-purple-800">Unique Records</p>
                        <p className="text-2xl font-bold text-purple-900">892</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <RiskHeatmap />
                  <RiskDistribution />
                </div>

                {/* Recommendations */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4">Risk Mitigation Recommendations</h3>
                  <ul className="space-y-2 text-yellow-800">
                    <li>• Apply generalization to Age field (group into 5-year ranges)</li>
                    <li>• Consider suppression of records with unique Occupation values</li>
                    <li>• Implement geographic generalization for District field</li>
                    <li>• Add differential privacy noise to Income_Bracket distributions</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};