import { Dataset, DataRow } from '../context/DataContext';

export interface QuasiIdentifierAnalysis {
  field: string;
  risk: 'Low' | 'Medium' | 'High';
  description: string;
  uniqueness: number;
  distinctValues: number;
  riskScore: number;
}

export interface RiskMetrics {
  overallRisk: number;
  highRiskRecords: number;
  uniqueRecords: number;
  kAnonymity: number;
  vulnerableFields: string[];
  recommendations: string[];
  geographicRisk: Array<{ region: string; risk: number; records: number }>;
  riskDistribution: Array<{ name: string; value: number; color: string }>;
}

export const analyzeQuasiIdentifiers = (dataset: Dataset): QuasiIdentifierAnalysis[] => {
  const { data, headers } = dataset;
  const analysis: QuasiIdentifierAnalysis[] = [];

  headers.forEach(field => {
    // Skip ID fields
    if (field.toLowerCase().includes('id')) return;

    const values = data.map(row => row[field]).filter(val => val !== null && val !== undefined && val !== '');
    const distinctValues = new Set(values).size;
    const uniqueness = distinctValues / values.length;
    
    let risk: 'Low' | 'Medium' | 'High' = 'Low';
    let description = '';
    let riskScore = 0;

    // Analyze field characteristics
    if (field.toLowerCase().includes('age')) {
      riskScore = uniqueness * 0.8 + (distinctValues > 30 ? 0.2 : 0);
      risk = riskScore > 0.6 ? 'High' : riskScore > 0.3 ? 'Medium' : 'Low';
      description = `Age values with ${distinctValues} distinct ages (${(uniqueness * 100).toFixed(1)}% uniqueness)`;
    } else if (field.toLowerCase().includes('district') || field.toLowerCase().includes('location')) {
      riskScore = uniqueness * 0.7 + (distinctValues > 20 ? 0.3 : 0);
      risk = riskScore > 0.5 ? 'High' : riskScore > 0.25 ? 'Medium' : 'Low';
      description = `Geographic identifier with ${distinctValues} locations (${(uniqueness * 100).toFixed(1)}% uniqueness)`;
    } else if (field.toLowerCase().includes('occupation') || field.toLowerCase().includes('job')) {
      riskScore = uniqueness * 0.9;
      risk = riskScore > 0.4 ? 'High' : riskScore > 0.2 ? 'Medium' : 'Low';
      description = `Occupation categories with ${distinctValues} types (${(uniqueness * 100).toFixed(1)}% uniqueness)`;
    } else if (field.toLowerCase().includes('education')) {
      riskScore = uniqueness * 0.6;
      risk = riskScore > 0.3 ? 'Medium' : 'Low';
      description = `Education levels with ${distinctValues} categories (${(uniqueness * 100).toFixed(1)}% uniqueness)`;
    } else if (field.toLowerCase().includes('income')) {
      riskScore = uniqueness * 0.5;
      risk = riskScore > 0.3 ? 'Medium' : 'Low';
      description = `Income brackets with ${distinctValues} ranges (${(uniqueness * 100).toFixed(1)}% uniqueness)`;
    } else if (field.toLowerCase().includes('gender')) {
      riskScore = uniqueness * 0.2;
      risk = 'Low';
      description = `Binary gender classification (${(uniqueness * 100).toFixed(1)}% uniqueness)`;
    } else if (field.toLowerCase().includes('state')) {
      riskScore = uniqueness * 0.4;
      risk = riskScore > 0.2 ? 'Medium' : 'Low';
      description = `State-level geographic data (${(uniqueness * 100).toFixed(1)}% uniqueness)`;
    } else {
      // Generic analysis
      riskScore = uniqueness * 0.5;
      risk = riskScore > 0.4 ? 'High' : riskScore > 0.2 ? 'Medium' : 'Low';
      description = `${distinctValues} distinct values (${(uniqueness * 100).toFixed(1)}% uniqueness)`;
    }

    analysis.push({
      field,
      risk,
      description,
      uniqueness,
      distinctValues,
      riskScore
    });
  });

  return analysis.sort((a, b) => b.riskScore - a.riskScore);
};

export const calculateRiskMetrics = (dataset: Dataset, quasiIdentifiers: string[]): RiskMetrics => {
  const { data } = dataset;
  
  // Calculate k-anonymity
  const equivalenceClasses = new Map<string, number>();
  
  data.forEach(row => {
    const qiCombination = quasiIdentifiers
      .map(field => String(row[field] || ''))
      .join('|');
    equivalenceClasses.set(qiCombination, (equivalenceClasses.get(qiCombination) || 0) + 1);
  });

  const classSizes = Array.from(equivalenceClasses.values());
  const kAnonymity = Math.min(...classSizes);
  const uniqueRecords = classSizes.filter(size => size === 1).length;
  
  // Calculate overall risk
  const riskThreshold = 5; // k-anonymity threshold
  const highRiskRecords = classSizes.filter(size => size < riskThreshold).reduce((sum, size) => sum + size, 0);
  const overallRisk = highRiskRecords / data.length;

  // Geographic risk analysis
  const geographicRisk = calculateGeographicRisk(data);
  
  // Risk distribution
  const lowRisk = classSizes.filter(size => size >= 10).reduce((sum, size) => sum + size, 0);
  const mediumRisk = classSizes.filter(size => size >= 3 && size < 10).reduce((sum, size) => sum + size, 0);
  const highRisk = classSizes.filter(size => size < 3).reduce((sum, size) => sum + size, 0);

  const riskDistribution = [
    { name: 'Low Risk (k≥10)', value: lowRisk, color: '#059669' },
    { name: 'Medium Risk (3≤k<10)', value: mediumRisk, color: '#D97706' },
    { name: 'High Risk (k<3)', value: highRisk, color: '#DC2626' }
  ];

  // Generate recommendations
  const recommendations = generateRecommendations(dataset, quasiIdentifiers, {
    kAnonymity,
    overallRisk,
    uniqueRecords,
    highRiskRecords
  });

  return {
    overallRisk,
    highRiskRecords,
    uniqueRecords,
    kAnonymity,
    vulnerableFields: quasiIdentifiers,
    recommendations,
    geographicRisk,
    riskDistribution
  };
};

const calculateGeographicRisk = (data: DataRow[]): Array<{ region: string; risk: number; records: number }> => {
  const regionField = data[0] && ('District' in data[0] ? 'District' : 'State' in data[0] ? 'State' : null);
  
  if (!regionField) {
    return [
      { region: 'Unknown Region', risk: 50, records: data.length }
    ];
  }

  const regionCounts = new Map<string, number>();
  data.forEach(row => {
    const region = String(row[regionField] || 'Unknown');
    regionCounts.set(region, (regionCounts.get(region) || 0) + 1);
  });

  return Array.from(regionCounts.entries())
    .map(([region, count]) => ({
      region,
      records: count,
      risk: Math.max(20, Math.min(90, 100 - (count * 2))) // Inverse relationship: fewer records = higher risk
    }))
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 8); // Top 8 regions
};

const generateRecommendations = (
  dataset: Dataset, 
  quasiIdentifiers: string[], 
  metrics: { kAnonymity: number; overallRisk: number; uniqueRecords: number; highRiskRecords: number }
): string[] => {
  const recommendations: string[] = [];
  const { kAnonymity, overallRisk, uniqueRecords, highRiskRecords } = metrics;

  // K-anonymity recommendations
  if (kAnonymity < 3) {
    recommendations.push(`Critical: K-anonymity is ${kAnonymity.toFixed(1)}. Apply immediate suppression or generalization`);
  } else if (kAnonymity < 5) {
    recommendations.push(`K-anonymity is ${kAnonymity.toFixed(1)}. Consider increasing to ≥5 for better protection`);
  }

  // Overall risk recommendations
  if (overallRisk > 0.5) {
    recommendations.push(`High overall risk (${(overallRisk * 100).toFixed(1)}%). Apply multiple privacy techniques`);
  } else if (overallRisk > 0.3) {
    recommendations.push(`Moderate risk detected. Consider differential privacy for sensitive attributes`);
  }

  // Field-specific recommendations
  quasiIdentifiers.forEach(field => {
    if (field.toLowerCase().includes('age')) {
      recommendations.push(`Apply age generalization: group specific ages into 5-year ranges`);
    }
    if (field.toLowerCase().includes('district')) {
      recommendations.push(`Consider geographic generalization: district → state level for rare locations`);
    }
    if (field.toLowerCase().includes('occupation')) {
      recommendations.push(`Suppress or generalize rare occupation categories with frequency < 5`);
    }
    if (field.toLowerCase().includes('income')) {
      recommendations.push(`Add differential privacy noise to income distributions`);
    }
  });

  // Unique records recommendations
  if (uniqueRecords > 0) {
    recommendations.push(`${uniqueRecords} unique records detected. Apply record suppression or synthetic data generation`);
  }

  // High-risk records recommendations
  if (highRiskRecords > data.length * 0.1) {
    recommendations.push(`${highRiskRecords} high-risk records (${((highRiskRecords/dataset.data.length) * 100).toFixed(1)}%). Consider microaggregation`);
  }

  return recommendations.slice(0, 6); // Limit to 6 most important recommendations
};