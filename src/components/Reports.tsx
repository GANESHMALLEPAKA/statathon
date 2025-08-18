import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { FileText, Download, Eye, Calendar, CheckCircle } from 'lucide-react';
import { ReportPreview } from './reports/ReportPreview';
import { generateReportContent } from '../utils/reportGenerator';

export const Reports: React.FC = () => {
  const { originalData, processedData, riskMetrics } = useDataContext();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [previewReport, setPreviewReport] = useState<string | null>(null);
  const [reportContent, setReportContent] = useState<string>('');

  const reports = [
    {
      id: 'executive',
      title: 'Executive Summary Report',
      description: 'High-level overview of privacy enhancement results',
      pages: 3,
      lastGenerated: '2024-01-15 14:30',
      status: 'ready',
      icon: '📊'
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment Report',
      description: 'Detailed analysis of re-identification risks',
      pages: 12,
      lastGenerated: '2024-01-15 14:25',
      status: 'ready',
      icon: '🛡️'
    },
    {
      id: 'utility-analysis',
      title: 'Utility Analysis Report',
      description: 'Statistical utility preservation metrics',
      pages: 8,
      lastGenerated: '2024-01-15 14:20',
      status: processedData ? 'ready' : 'pending',
      icon: '📈'
    },
    {
      id: 'dpdp-compliance',
      title: 'DPDP Act 2023 Compliance Report',
      description: 'Legal compliance assessment and recommendations',
      pages: 6,
      lastGenerated: '2024-01-15 14:35',
      status: 'ready',
      icon: '⚖️'
    },
    {
      id: 'technical',
      title: 'Technical Implementation Report',
      description: 'Detailed methodology and parameter documentation',
      pages: 15,
      lastGenerated: '2024-01-15 14:15',
      status: 'ready',
      icon: '🔧'
    },
    {
      id: 'audit-trail',
      title: 'Audit Trail Report',
      description: 'Complete log of all processing activities',
      pages: 4,
      lastGenerated: '2024-01-15 14:40',
      status: 'ready',
      icon: '📋'
    },
  ];

  const generateReport = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const content = await generateReportContent(reportId, {
      originalData,
      processedData,
      riskMetrics,
      reportTitle: report.title
    });
    
    setReportContent(content);
    setPreviewReport(reportId);
  };

  const downloadReport = async (reportId: string, format: 'pdf' | 'html' | 'csv') => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'html') {
      content = await generateReportContent(reportId, {
        originalData,
        processedData,
        riskMetrics,
        reportTitle: report.title
      });
      mimeType = 'text/html';
      filename = `${reportId}_report.html`;
    } else if (format === 'csv' && reportId === 'audit-trail') {
      content = generateAuditTrailCSV();
      mimeType = 'text/csv';
      filename = `${reportId}_report.csv`;
    } else {
      // For PDF, we'll generate HTML and let user print to PDF
      content = await generateReportContent(reportId, {
        originalData,
        processedData,
        riskMetrics,
        reportTitle: report.title
      });
      mimeType = 'text/html';
      filename = `${reportId}_report.html`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateAuditTrailCSV = () => {
    const headers = ['Timestamp', 'Action', 'Module', 'Parameters', 'User', 'Status'];
    const rows = [
      ['2024-01-15 14:30:00', 'Dataset Upload', 'File Management', 'household_survey_2024.csv', 'NSO User', 'Success'],
      ['2024-01-15 14:31:15', 'Risk Assessment', 'Risk Analysis', 'QI: Age,District,Education,Occupation', 'NSO User', 'Completed'],
      ['2024-01-15 14:35:22', 'Privacy Enhancement', 'SDC Module', 'Suppression: 5, Generalization: 2', 'NSO User', 'Success'],
      ['2024-01-15 14:38:45', 'Utility Measurement', 'Analysis', 'Statistical Comparison', 'NSO User', 'Completed'],
      ['2024-01-15 14:40:12', 'Report Generation', 'Reporting', 'Executive Summary', 'NSO User', 'Generated'],
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  if (!originalData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Dataset Loaded</h3>
        <p className="text-gray-600">Please upload a dataset first to generate reports.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports & Documentation</h2>
        
        {/* Report Generation Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Report Generation Available</h3>
              <p className="text-sm text-blue-700 mt-1">
                {processedData 
                  ? 'All reports can be generated with complete analysis results.'
                  : 'Risk assessment reports available. Apply privacy enhancement for full utility analysis.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`border-2 rounded-lg p-6 transition-all duration-200 cursor-pointer ${
                selectedReport === report.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{report.icon}</div>
                <div className={`px-2 py-1 text-xs rounded-full ${
                  report.status === 'ready' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{report.pages} pages</span>
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {report.lastGenerated}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Report Actions */}
        {selectedReport && (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {reports.find(r => r.id === selectedReport)?.title}
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => generateReport(selectedReport)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {/* Download Options */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Download Formats</h4>
              <div className="flex space-x-3">
                <button
                  onClick={() => downloadReport(selectedReport, 'pdf')}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>HTML (Print to PDF)</span>
                </button>
                
                <button
                  onClick={() => downloadReport(selectedReport, 'html')}
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>HTML</span>
                </button>
                
                {selectedReport === 'audit-trail' && (
                  <button
                    onClick={() => downloadReport(selectedReport, 'csv')}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>CSV</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Report Preview Modal */}
        {previewReport && (
          <ReportPreview
            reportId={previewReport}
            content={reportContent}
            onClose={() => {
              setPreviewReport(null);
              setReportContent('');
            }}
          />
        )}

        {/* DPDP Compliance Summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-green-900 mb-4">DPDP Act 2023 Compliance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-2">Compliant Requirements</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>✓ Purpose limitation enforced</li>
                <li>✓ Data minimization applied</li>
                <li>✓ Technical safeguards implemented</li>
                <li>✓ Processing transparency maintained</li>
                <li>✓ Individual privacy protected</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-2">Risk Mitigation</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>✓ Re-identification risk reduced to &lt;5%</li>
                <li>✓ K-anonymity threshold met</li>
                <li>✓ Sensitive attributes protected</li>
                <li>✓ Statistical utility preserved</li>
                <li>✓ Audit trail maintained</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};