import React, { useState } from 'react';
import { Info } from 'lucide-react';

export const SDCControls: React.FC = () => {
  const [suppressionThreshold, setSuppressionThreshold] = useState(5);
  const [generalizationLevel, setGeneralizationLevel] = useState(2);
  const [perturbationNoise, setPerturbationNoise] = useState(0.1);
  const [topBottomCoding, setTopBottomCoding] = useState(95);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Suppression Threshold */}
        <div>
          <div className="flex items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Suppression Threshold</label>
            <Info className="h-4 w-4 text-gray-400 ml-1" title="Remove records with frequency below this threshold" />
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={suppressionThreshold}
            onChange={(e) => setSuppressionThreshold(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span className="font-medium text-blue-600">{suppressionThreshold}</span>
            <span>10</span>
          </div>
        </div>

        {/* Generalization Level */}
        <div>
          <div className="flex items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Generalization Level</label>
            <Info className="h-4 w-4 text-gray-400 ml-1" title="Hierarchy depth for categorical generalization" />
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={generalizationLevel}
            onChange={(e) => setGeneralizationLevel(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span className="font-medium text-blue-600">{generalizationLevel}</span>
            <span>5</span>
          </div>
        </div>

        {/* Perturbation Noise */}
        <div>
          <div className="flex items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Perturbation Noise</label>
            <Info className="h-4 w-4 text-gray-400 ml-1" title="Random noise scale for numerical values" />
          </div>
          <input
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={perturbationNoise}
            onChange={(e) => setPerturbationNoise(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.01</span>
            <span className="font-medium text-blue-600">{perturbationNoise}</span>
            <span>1.0</span>
          </div>
        </div>

        {/* Top/Bottom Coding */}
        <div>
          <div className="flex items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Top/Bottom Coding (%)</label>
            <Info className="h-4 w-4 text-gray-400 ml-1" title="Percentile threshold for extreme value capping" />
          </div>
          <input
            type="range"
            min="90"
            max="99"
            value={topBottomCoding}
            onChange={(e) => setTopBottomCoding(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>90%</span>
            <span className="font-medium text-blue-600">{topBottomCoding}%</span>
            <span>99%</span>
          </div>
        </div>
      </div>

      {/* Technique Selection */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Apply SDC Techniques</h4>
        <div className="space-y-2">
          {[
            { id: 'suppression', label: 'Cell Suppression', description: 'Remove high-risk cells' },
            { id: 'generalization', label: 'Generalization', description: 'Create hierarchical categories' },
            { id: 'perturbation', label: 'Data Perturbation', description: 'Add controlled noise' },
            { id: 'microaggregation', label: 'Microaggregation', description: 'Replace with group averages' },
          ].map((technique) => (
            <label key={technique.id} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">{technique.label}</span>
              <span className="ml-2 text-xs text-gray-500">- {technique.description}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};