import React, { useState } from 'react';
import { Info } from 'lucide-react';

export const SyntheticDataControls: React.FC = () => {
  const [method, setMethod] = useState<'marginal' | 'bayesian' | 'gan'>('marginal');
  const [syntheticSize, setSyntheticSize] = useState(100);
  const [correlationPreservation, setCorrelationPreservation] = useState(0.95);
  const [privacyLevel, setPrivacyLevel] = useState(0.8);

  return (
    <div className="space-y-6">
      {/* Generation Method */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">Generation Method</label>
        <div className="grid grid-cols-1 gap-3">
          <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="method"
              value="marginal"
              checked={method === 'marginal'}
              onChange={(e) => setMethod(e.target.value as any)}
              className="mt-1 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3">
              <div className="font-medium text-gray-900">Marginal Distribution</div>
              <div className="text-sm text-gray-600 mt-1">
                Preserves individual variable distributions. Fast and reliable.
              </div>
            </div>
          </label>
          
          <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="method"
              value="bayesian"
              checked={method === 'bayesian'}
              onChange={(e) => setMethod(e.target.value as any)}
              className="mt-1 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3">
              <div className="font-medium text-gray-900">Bayesian Network</div>
              <div className="text-sm text-gray-600 mt-1">
                Models variable dependencies. Better correlation preservation.
              </div>
            </div>
          </label>

          <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="method"
              value="gan"
              checked={method === 'gan'}
              onChange={(e) => setMethod(e.target.value as any)}
              className="mt-1 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3">
              <div className="font-medium text-gray-900">GAN-based (Experimental)</div>
              <div className="text-sm text-gray-600 mt-1">
                Neural network approach. High-quality but requires more computation.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Synthetic Dataset Size */}
      <div>
        <div className="flex items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Synthetic Dataset Size</label>
          <Info className="h-4 w-4 text-gray-400 ml-1" title="Percentage of original dataset size" />
        </div>
        <input
          type="range"
          min="50"
          max="200"
          step="10"
          value={syntheticSize}
          onChange={(e) => setSyntheticSize(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>50%</span>
          <span className="font-medium text-blue-600">{syntheticSize}%</span>
          <span>200%</span>
        </div>
      </div>

      {/* Correlation Preservation */}
      <div>
        <div className="flex items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Correlation Preservation</label>
          <Info className="h-4 w-4 text-gray-400 ml-1" title="Target correlation preservation ratio" />
        </div>
        <input
          type="range"
          min="0.5"
          max="0.99"
          step="0.01"
          value={correlationPreservation}
          onChange={(e) => setCorrelationPreservation(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>50%</span>
          <span className="font-medium text-blue-600">{(correlationPreservation * 100).toFixed(0)}%</span>
          <span>99%</span>
        </div>
      </div>

      {/* Privacy vs Utility Trade-off */}
      <div>
        <div className="flex items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Privacy Level</label>
          <Info className="h-4 w-4 text-gray-400 ml-1" title="Higher values increase privacy but may reduce utility" />
        </div>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.1"
          value={privacyLevel}
          onChange={(e) => setPrivacyLevel(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low Privacy</span>
          <span className="font-medium text-blue-600">{(privacyLevel * 100).toFixed(0)}%</span>
          <span>High Privacy</span>
        </div>
      </div>

      {/* Validation Metrics */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Validation Metrics</h4>
        <div className="space-y-2">
          {[
            { id: 'distributions', label: 'Distribution Similarity', description: 'KS-test for marginal distributions' },
            { id: 'correlations', label: 'Correlation Preservation', description: 'Pearson correlation comparison' },
            { id: 'statistical', label: 'Statistical Tests', description: 'Chi-square and other goodness-of-fit tests' },
            { id: 'ml', label: 'ML Utility', description: 'Model performance comparison' },
          ].map((metric) => (
            <label key={metric.id} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">{metric.label}</span>
              <span className="ml-2 text-xs text-gray-500">- {metric.description}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};