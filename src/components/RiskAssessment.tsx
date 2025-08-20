import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { AlertTriangle, Shield, Users, Eye, MapPin } from 'lucide-react';
import { RiskHeatmap } from './charts/RiskHeatmap';
import { RiskDistribution } from './charts/RiskDistribution';
import { calculateRiskMetrics, analyzeQuasiIdentifiers } from '../utils/riskAnalysis';

export const RiskAssessment: React.FC = () => {
  const { originalData, setRiskMetrics } = useDataContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedQuasiIdentifiers, setSelectedQuasiIdentifiers] = useState<string[]>([]);
  const [potentialQIs, setPotentialQIs] = useState<any[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  useEffect(() => {
    if (originalData) {
      const qiAnalysis = analyzeQuasiIdentifiers(originalData);
      setPotentialQIs(qiAnalysis);
      // Auto-select high and medium risk QIs
      const autoSelected = qiAnalysis
        .filter(qi => qi.risk === 'High' || qi.risk === 'Medium')
        .map(qi => qi.field);
      setSelectedQuasiIdentifiers(autoSelected);
    }
  }, [originalData]);

  useEffect(() => {
    if (originalData && selectedQuasiIdentifiers.length > 0) {
      const timeoutId = setTimeout(() => {
        runRiskAnalysis();
      }, 500); // Debounce to prevent too many calculations
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedQuasiIdentifiers, originalData]);

  const runRiskAnalysis = async () => {
    if (!originalData || selectedQuasiIdentifiers.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate analysis time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate actual risk metrics based on the dataset
      const riskMetrics = calculateRiskMetrics(originalData, selectedQuasiIdentifiers);
      setAnalysisResults(riskMetrics);
      setRiskMetrics(riskMetrics);
    } catch (error) {
      console.error('Risk analysis error:', error);
      // Set default values on error
      const defaultMetrics = {
        overallRisk: 0,
        highRiskRecords: 0,
        uniqueRecords: 0,
        kAnonymity: 0,
        vulnerableFields: selectedQuasiIdentifiers,
        recommendations: ['Error in analysis. Please try again.'],
        geographicRisk: [],
        riskDistribution: []
      };
      setAnalysisResults(defaultMetrics);
      setRiskMetrics(defaultMetrics);
    } finally {
      setIsAnalyzing(false);
    }
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
                        <p className="text-2xl font-bold text-red-900">
                          {analysisResults ? (analysisResults.overallRisk * 100).toFixed(1) : '0.0'}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <Eye className="h-8 w-8 text-amber-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">High Risk Records</p>
                        <p className="text-2xl font-bold text-amber-900">
                          {analysisResults?.highRiskRecords?.toLocaleString() || '0'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">K-Anonymity</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {analysisResults?.kAnonymity?.toFixed(1) || '0.0'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <MapPin className="h-8 w-8 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-purple-800">Unique Records</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {analysisResults?.uniqueRecords?.toLocaleString() || '0'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <RiskHeatmap analysisResults={analysisResults} />
                  <RiskDistribution analysisResults={analysisResults} />
                </div>

                {/* Dynamic Recommendations */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4">Risk Mitigation Recommendations</h3>
                  {analysisResults && (
                    <ul className="space-y-2 text-yellow-800">
                      {analysisResults.recommendations.map((rec: string, index: number) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};