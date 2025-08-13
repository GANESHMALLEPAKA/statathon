import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { Lock, Sliders, Play, Download } from 'lucide-react';
import { SDCControls } from './privacy/SDCControls';
import { DifferentialPrivacyControls } from './privacy/DifferentialPrivacyControls';
import { SyntheticDataControls } from './privacy/SyntheticDataControls';

type PrivacyTechnique = 'sdc' | 'dp' | 'sdg';

export const PrivacyEnhancement: React.FC = () => {
  const { originalData, setProcessedData, setPrivacyConfig } = useDataContext();
  const [selectedTechnique, setSelectedTechnique] = useState<PrivacyTechnique>('sdc');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const techniques = [
    {
      id: 'sdc' as const,
      name: 'Statistical Disclosure Control',
      description: 'Traditional privacy techniques: suppression, generalization, perturbation',
      icon: '🛡️',
      recommended: true,
    },
    {
      id: 'dp' as const,
      name: 'Differential Privacy',
      description: 'Mathematical privacy guarantees through calibrated noise addition',
      icon: '🔢',
      recommended: false,
    },
    {
      id: 'sdg' as const,
      name: 'Synthetic Data Generation',
      description: 'Generate synthetic datasets preserving statistical properties',
      icon: '🧬',
      recommended: false,
    },
  ];

  const processData = async () => {
    if (!originalData) return;

    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create mock processed data
    const processedRows = originalData.data.map((row, index) => {
      const newRow = { ...row };
      
      // Apply mock transformations based on technique
      if (selectedTechnique === 'sdc') {
        if (newRow.Age && typeof newRow.Age === 'number') {
          newRow.Age = Math.floor(newRow.Age / 5) * 5; // Group ages
        }
      } else if (selectedTechnique === 'dp') {
        if (newRow.Income_Bracket && typeof newRow.Income_Bracket === 'number') {
          newRow.Income_Bracket += Math.random() * 1000 - 500; // Add noise
        }
      }
      
      return newRow;
    });

    const processedDataset = {
      data: processedRows,
      headers: originalData.headers,
      fileName: `${originalData.fileName.replace('.csv', '')}_protected.csv`,
      uploadDate: new Date(),
    };

    setProcessedData(processedDataset);
    setPreviewData(processedRows.slice(0, 5));
    setIsProcessing(false);
  };

  const generatePreview = () => {
    if (!originalData) return;
    
    const preview = originalData.data.slice(0, 5).map(row => {
      const newRow = { ...row };
      // Apply light transformations for preview
      if (selectedTechnique === 'sdc' && newRow.Age) {
        newRow.Age = `${Math.floor(Number(newRow.Age) / 5) * 5}-${Math.floor(Number(newRow.Age) / 5) * 5 + 4}`;
      }
      return newRow;
    });
    
    setPreviewData(preview);
  };

  if (!originalData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Dataset Loaded</h3>
        <p className="text-gray-600">Please upload a dataset first to apply privacy enhancement techniques.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Enhancement Module</h2>
        
        {/* Technique Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Privacy Technique</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {techniques.map((technique) => (
              <div
                key={technique.id}
                onClick={() => setSelectedTechnique(technique.id)}
                className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedTechnique === technique.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {technique.recommended && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Recommended
                  </div>
                )}
                <div className="text-3xl mb-3">{technique.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{technique.name}</h4>
                <p className="text-sm text-gray-600">{technique.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Sliders className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Configuration Parameters</h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            {selectedTechnique === 'sdc' && <SDCControls />}
            {selectedTechnique === 'dp' && <DifferentialPrivacyControls />}
            {selectedTechnique === 'sdg' && <SyntheticDataControls />}
          </div>
        </div>

        {/* Preview and Processing */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={generatePreview}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
            >
              Generate Preview
            </button>
            
            <button
              onClick={processData}
              disabled={isProcessing}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${
                isProcessing
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Process Full Dataset</span>
                </>
              )}
            </button>
          </div>

          {/* Preview Data */}
          {previewData.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Data Preview</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      {originalData.headers.slice(0, 6).map((header) => (
                        <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {previewData.map((row, index) => (
                      <tr key={index}>
                        {originalData.headers.slice(0, 6).map((header) => (
                          <td key={header} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {String(row[header] || '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};