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
    const totalValues = values.length;
    const uniqueness = distinctValues / totalValues;
    
    let risk: 'Low' | 'Medium' | 'High' = 'Low';
    let description = '';
    let riskScore = 0;

    // Analyze field characteristics based on field name and data patterns
    const fieldLower = field.toLowerCase();
    
    if (fieldLower.includes('age')) {
      // Age is high risk due to precision and correlation with other attributes
      riskScore = Math.min(0.9, uniqueness * 1.2 + 0.3);
      risk = riskScore > 0.7 ? 'High' : riskScore > 0.4 ? 'Medium' : 'Low';
      description = `Age field with ${distinctValues} distinct values (${(uniqueness * 100).toFixed(1)}% uniqueness). High re-identification risk.`;
    } else if (fieldLower.includes('district') || fieldLower.includes('location') || fieldLower.includes('city')) {
      // Geographic identifiers are high risk
      riskScore = Math.min(0.85, uniqueness * 1.1 + 0.25);
      risk = riskScore > 0.6 ? 'High' : riskScore > 0.35 ? 'Medium' : 'Low';
      description = `Geographic identifier with ${distinctValues} locations (${(uniqueness * 100).toFixed(1)}% uniqueness). Location-based risk.`;
    } else if (fieldLower.includes('occupation') || fieldLower.includes('job') || fieldLower.includes('work')) {
      // Occupation is very high risk due to specificity
      riskScore = Math.min(0.95, uniqueness * 1.3 + 0.4);
      risk = riskScore > 0.75 ? 'High' : riskScore > 0.45 ? 'Medium' : 'Low';
      description = `Occupation field with ${distinctValues} job types (${(uniqueness * 100).toFixed(1)}% uniqueness). Professional identity risk.`;
    } else if (fieldLower.includes('education') || fieldLower.includes('degree')) {
      // Education level is medium risk
      riskScore = Math.min(0.7, uniqueness * 0.8 + 0.2);
      risk = riskScore > 0.5 ? 'Medium' : riskScore > 0.25 ? 'Low' : 'Low';
      description = `Education level with ${distinctValues} categories (${(uniqueness * 100).toFixed(1)}% uniqueness). Educational background risk.`;
    } else if (fieldLower.includes('income') || fieldLower.includes('salary') || fieldLower.includes('bracket')) {
      // Income is medium-high risk
      riskScore = Math.min(0.75, uniqueness * 0.9 + 0.3);
      risk = riskScore > 0.6 ? 'High' : riskScore > 0.35 ? 'Medium' : 'Low';
      description = `Income data with ${distinctValues} brackets (${(uniqueness * 100).toFixed(1)}% uniqueness). Economic status risk.`;
    } else if (fieldLower.includes('gender') || fieldLower.includes('sex')) {
      // Gender is typically low risk (binary)
      riskScore = Math.min(0.3, uniqueness * 0.5);
      risk = 'Low';
      description = `Gender field with ${distinctValues} categories (${(uniqueness * 100).toFixed(1)}% uniqueness). Low individual risk.`;
    } else if (fieldLower.includes('state') || fieldLower.includes('province')) {
      // State level is lower risk than district
      riskScore = Math.min(0.6, uniqueness * 0.7 + 0.15);
      risk = riskScore > 0.45 ? 'Medium' : 'Low';
      description = `State-level data with ${distinctValues} states (${(uniqueness * 100).toFixed(1)}% uniqueness). Regional identifier.`;
    } else if (fieldLower.includes('religion') || fieldLower.includes('caste')) {
      // Religious/caste data is sensitive and medium risk
      riskScore = Math.min(0.65, uniqueness * 0.8 + 0.25);
      risk = riskScore > 0.5 ? 'Medium' : riskScore > 0.3 ? 'Low' : 'Low';
      description = `Sensitive category with ${distinctValues} groups (${(uniqueness * 100).toFixed(1)}% uniqueness). Cultural identifier risk.`;
    } else if (fieldLower.includes('family') || fieldLower.includes('size') || fieldLower.includes('household')) {
      // Family size is low-medium risk
      riskScore = Math.min(0.5, uniqueness * 0.6 + 0.1);
      risk = riskScore > 0.35 ? 'Medium' : 'Low';
      description = `Household data with ${distinctValues} values (${(uniqueness * 100).toFixed(1)}% uniqueness). Demographic risk.`;
    } else if (fieldLower.includes('housing') || fieldLower.includes('type') || fieldLower.includes('dwelling')) {
      // Housing type is low-medium risk
      riskScore = Math.min(0.45, uniqueness * 0.6 + 0.1);
      risk = riskScore > 0.3 ? 'Medium' : 'Low';
      description = `Housing type with ${distinctValues} categories (${(uniqueness * 100).toFixed(1)}% uniqueness). Lifestyle indicator.`;
    } else {
      // Generic analysis for unknown fields
      riskScore = uniqueness * 0.7;
      risk = riskScore > 0.6 ? 'High' : riskScore > 0.3 ? 'Medium' : 'Low';
      description = `Generic field with ${distinctValues} distinct values (${(uniqueness * 100).toFixed(1)}% uniqueness).`;
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
  
  if (!data || data.length === 0) {
    return {
      overallRisk: 0,
      highRiskRecords: 0,
      uniqueRecords: 0,
      kAnonymity: 0,
      vulnerableFields: [],
      recommendations: ['No data available for analysis'],
      geographicRisk: [],
      riskDistribution: []
    };
  }
  
  // Calculate k-anonymity using equivalence classes
  const equivalenceClasses = new Map<string, number>();
  
  data.forEach(row => {
    const qiCombination = quasiIdentifiers
      .map(field => String(row[field] || 'NULL'))
      .join('|');
    equivalenceClasses.set(qiCombination, (equivalenceClasses.get(qiCombination) || 0) + 1);
  });

  const classSizes = Array.from(equivalenceClasses.values());
  const kAnonymity = classSizes.length > 0 ? Math.min(...classSizes) : 0;
  const uniqueRecords = classSizes.filter(size => size === 1).length;
  
  // Calculate overall risk based on k-anonymity and uniqueness
  const riskThreshold = 5;
  const highRiskRecords = classSizes.filter(size => size < riskThreshold).reduce((sum, size) => sum + size, 0);
  const overallRisk = Math.min(0.95, highRiskRecords / data.length + (uniqueRecords * 0.1 / data.length));

  // Geographic risk analysis
  const geographicRisk = calculateGeographicRisk(data);
  
  // Risk distribution based on k-anonymity groups
  const lowRisk = classSizes.filter(size => size >= 10).reduce((sum, size) => sum + size, 0);
  const mediumRisk = classSizes.filter(size => size >= 3 && size < 10).reduce((sum, size) => sum + size, 0);
  const highRisk = classSizes.filter(size => size < 3).reduce((sum, size) => sum + size, 0);

  const riskDistribution = [
    { name: 'Low Risk (k≥10)', value: lowRisk, color: '#059669' },
    { name: 'Medium Risk (3≤k<10)', value: mediumRisk, color: '#D97706' },
    { name: 'High Risk (k<3)', value: highRisk, color: '#DC2626' }
  ];

  // Generate data-driven recommendations
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
  // Find geographic fields in the data
  const sampleRow = data[0];
  if (!sampleRow) return [];
  
  const geoFields = Object.keys(sampleRow).filter(key => 
    key.toLowerCase().includes('district') || 
    key.toLowerCase().includes('state') || 
    key.toLowerCase().includes('city') ||
    key.toLowerCase().includes('location')
  );
  
  if (geoFields.length === 0) {
    return [{ region: 'No Geographic Data', risk: 0, records: data.length }];
  }
  
  // Use the first geographic field found (prioritize district over state)
  const geoField = geoFields.find(f => f.toLowerCase().includes('district')) || geoFields[0];
  
  const regionCounts = new Map<string, number>();
  data.forEach(row => {
    const region = String(row[geoField] || 'Unknown');
    regionCounts.set(region, (regionCounts.get(region) || 0) + 1);
  });

  return Array.from(regionCounts.entries())
    .map(([region, count]) => ({
      region,
      records: count,
      // Risk calculation: fewer records in a region = higher risk
      // Also consider if it's a major city (lower risk) vs rural area (higher risk)
      risk: Math.max(10, Math.min(95, 100 - (count * 3) + (region.toLowerCase().includes('rural') ? 20 : 0)))
    }))
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 10); // Top 10 regions by risk
};

const generateRecommendations = (
  dataset: Dataset, 
  quasiIdentifiers: string[], 
  metrics: { kAnonymity: number; overallRisk: number; uniqueRecords: number; highRiskRecords: number }
): string[] => {
  const recommendations: string[] = [];
  const { kAnonymity, overallRisk, uniqueRecords, highRiskRecords } = metrics;
  const dataSize = dataset.data.length;

  // K-anonymity recommendations
  if (kAnonymity < 2) {
    recommendations.push(`🚨 Critical: K-anonymity is ${kAnonymity}. Immediate data suppression required for ${uniqueRecords} unique records.`);
  } else if (kAnonymity < 3) {
    recommendations.push(`⚠️ High Risk: K-anonymity is ${kAnonymity}. Apply generalization to achieve k≥5 for adequate protection.`);
  } else if (kAnonymity < 5) {
    recommendations.push(`⚡ Medium Risk: K-anonymity is ${kAnonymity}. Consider increasing to ≥5 for better privacy protection.`);
  }

  // Overall risk recommendations
  if (overallRisk > 0.7) {
    recommendations.push(`🔴 Severe Risk: ${(overallRisk * 100).toFixed(1)}% overall risk. Apply multiple privacy techniques immediately.`);
  } else if (overallRisk > 0.5) {
    recommendations.push(`🟡 High Risk: ${(overallRisk * 100).toFixed(1)}% overall risk. Implement differential privacy for sensitive attributes.`);
  } else if (overallRisk > 0.3) {
    recommendations.push(`🟢 Moderate Risk: ${(overallRisk * 100).toFixed(1)}% overall risk. Standard privacy measures recommended.`);
  }

  // Field-specific recommendations based on actual quasi-identifiers
  quasiIdentifiers.forEach(field => {
    const fieldLower = field.toLowerCase();
    if (fieldLower.includes('age')) {
      recommendations.push(`📊 Age Field: Group specific ages into 5-year ranges (e.g., 25-29, 30-34) to reduce precision.`);
    }
    if (fieldLower.includes('district') || fieldLower.includes('location')) {
      recommendations.push(`🗺️ Geographic Data: Generalize rare districts to state level or suppress locations with <5 records.`);
    }
    if (fieldLower.includes('occupation') || fieldLower.includes('job')) {
      recommendations.push(`💼 Occupation Field: Suppress rare occupations or group into broader categories (e.g., 'Professional', 'Service').`);
    }
    if (fieldLower.includes('income') || fieldLower.includes('salary')) {
      recommendations.push(`💰 Income Data: Add differential privacy noise or use broader income brackets to protect economic status.`);
    }
    if (fieldLower.includes('education')) {
      recommendations.push(`🎓 Education Field: Combine similar education levels (e.g., merge 'Graduate' and 'Post Graduate' if needed).`);
    }
  });

  // Unique records recommendations
  if (uniqueRecords > 0) {
    const uniquePercent = (uniqueRecords / dataSize * 100).toFixed(1);
    recommendations.push(`🎯 Unique Records: ${uniqueRecords} records (${uniquePercent}%) are unique. Apply record suppression or synthetic data generation.`);
  }

  // High-risk records recommendations
  if (highRiskRecords > dataSize * 0.2) {
    const riskPercent = (highRiskRecords / dataSize * 100).toFixed(1);
    recommendations.push(`⚠️ High-Risk Records: ${highRiskRecords} records (${riskPercent}%) are high-risk. Consider microaggregation or data swapping.`);
  }

  // Data size specific recommendations
  if (dataSize < 1000) {
    recommendations.push(`📏 Small Dataset: With only ${dataSize} records, consider synthetic data generation to increase dataset size safely.`);
  }

  // Return top 8 most relevant recommendations
  return recommendations.slice(0, 8);
};