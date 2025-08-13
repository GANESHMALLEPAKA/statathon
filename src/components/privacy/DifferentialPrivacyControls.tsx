import React, { useState } from 'react';
import { Info, AlertTriangle } from 'lucide-react';

export const DifferentialPrivacyControls: React.FC = () => {
  const [epsilon, setEpsilon] = useState(1.0);
  const [mechanism, setMechanism] = useState<'laplace' | 'gaussian'>('laplace');
  const [queryBudget, setQueryBudget] = useState(0.5);

  const getPrivacyLevel = (eps: number) => {
    if (eps <= 0.1) return { level: 'Very High', color: 'text-green-600' };
    if (eps <= 1.0) return { level: 'High', color: 'text-blue-600' };
    if (eps <= 5.0) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-red-600' };
  };

  const privacyLevel = getPrivacyLevel(epsilon);

  return (
    <div className="space-y-6">
      {/* Privacy Budget (Epsilon) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-700">Privacy Budget (ε)</label>
            <Info className="h-4 w-4 text-gray-400 ml-1" title="Lower values provide stronger privacy guarantees" />
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${privacyLevel.color}`}>
              {privacyLevel.level} Privacy
            </span>
          </div>
        </div>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={epsilon}
          onChange={(e) => setEpsilon(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.1 (Strong)</span>
          <span className="font-medium text-blue-600">ε = {epsilon}</span>
          <span>10 (Weak)</span>
        </div>
      </div>

      {/* Mechanism Selection */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">Noise Mechanism</label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="mechanism"
              value="laplace"
              checked={mechanism === 'laplace'}
              onChange={(e) => setMechanism(e.target.value as 'laplace')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3">
              <div className="font-medium text-gray-900">Laplace</div>
              <div className="text-xs text-gray-600">Standard DP mechanism</div>
            </div>
          </label>
          
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="mechanism"
              value="gaussian"
              checked={mechanism === 'gaussian'}
              onChange={(e) => setMechanism(e.target.value as 'gaussian')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3">
              <div className="font-medium text-gray-900">Gaussian</div>
              <div className="text-xs text-gray-600">For approximate DP</div>
            </div>
          </label>
        </div>
      </div>

      {/* Query Budget Allocation */}
      <div>
        <div className="flex items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Query Budget Allocation</label>
          <Info className="h-4 w-4 text-gray-400 ml-1" title="Fraction of privacy budget for statistical queries" />
        </div>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.1"
          value={queryBudget}
          onChange={(e) => setQueryBudget(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10%</span>
          <span className="font-medium text-blue-600">{(queryBudget * 100).toFixed(0)}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Privacy Budget Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-amber-800">Privacy Budget Composition</h4>
            <div className="mt-2 text-sm text-amber-700">
              <p>Total budget: ε = {epsilon}</p>
              <p>Query budget: ε = {(epsilon * queryBudget).toFixed(2)}</p>
              <p>Remaining: ε = {(epsilon * (1 - queryBudget)).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Query Types */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Protected Query Types</h4>
        <div className="space-y-2">
          {[
            { id: 'counts', label: 'Count Queries', description: 'Frequency distributions' },
            { id: 'means', label: 'Mean Queries', description: 'Average values' },
            { id: 'histograms', label: 'Histograms', description: 'Value distributions' },
            { id: 'contingency', label: 'Contingency Tables', description: 'Cross-tabulations' },
          ].map((query) => (
            <label key={query.id} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">{query.label}</span>
              <span className="ml-2 text-xs text-gray-500">- {query.description}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};