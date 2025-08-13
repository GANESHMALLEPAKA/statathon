import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DataRow {
  [key: string]: string | number;
}

export interface Dataset {
  data: DataRow[];
  headers: string[];
  fileName: string;
  uploadDate: Date;
}

export interface RiskMetrics {
  overallRisk: number;
  highRiskRecords: number;
  uniqueRecords: number;
  kAnonymity: number;
  vulnerableFields: string[];
}

export interface PrivacyConfig {
  technique: 'sdc' | 'dp' | 'sdg';
  parameters: {
    epsilon?: number;
    suppressionThreshold?: number;
    generalizationLevel?: number;
    noiseScale?: number;
  };
}

interface DataContextType {
  originalData: Dataset | null;
  processedData: Dataset | null;
  riskMetrics: RiskMetrics | null;
  privacyConfig: PrivacyConfig | null;
  setOriginalData: (data: Dataset) => void;
  setProcessedData: (data: Dataset) => void;
  setRiskMetrics: (metrics: RiskMetrics) => void;
  setPrivacyConfig: (config: PrivacyConfig) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [originalData, setOriginalData] = useState<Dataset | null>(null);
  const [processedData, setProcessedData] = useState<Dataset | null>(null);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [privacyConfig, setPrivacyConfig] = useState<PrivacyConfig | null>(null);

  return (
    <DataContext.Provider
      value={{
        originalData,
        processedData,
        riskMetrics,
        privacyConfig,
        setOriginalData,
        setProcessedData,
        setRiskMetrics,
        setPrivacyConfig,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};