import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { useDataContext } from '../context/DataContext';

export const FileUpload: React.FC = () => {
  const { setOriginalData } = useDataContext();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const data = results.data as any[];
          const headers = results.meta.fields || [];
          
          setOriginalData({
            data: data.filter(row => Object.values(row).some(val => val !== '')),
            headers,
            fileName: file.name,
            uploadDate: new Date(),
          });
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        }
      });
    }
  }, [setOriginalData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Upload De-identified Microdata
        </p>
        <p className="text-sm text-gray-600 mb-4">
          {isDragActive
            ? 'Drop the CSV file here...'
            : 'Drag & drop a CSV file here, or click to select'}
        </p>
        <div className="text-xs text-gray-500">
          Supported format: CSV (up to 100MB)
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Sample Data Available</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p className="mb-2">Download sample datasets to test the SafeData Pipeline:</p>
              <div className="space-y-2">
                <div>
                  <a 
                    href="/sample-data/household_survey_2024.csv" 
                    download
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    📊 household_survey_2024.csv
                  </a>
                  <span className="text-xs text-blue-600 ml-2">(100 records, 14 columns)</span>
                </div>
                <div>
                  <a 
                    href="/sample-data/ground_truth_identifiers.csv" 
                    download
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    🔒 ground_truth_identifiers.csv
                  </a>
                  <span className="text-xs text-blue-600 ml-2">(For risk assessment simulation)</span>
                </div>
                <div>
                  <a 
                    href="/sample-data/README.md" 
                    download
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    📖 README.md
                  </a>
                  <span className="text-xs text-blue-600 ml-2">(Documentation & usage guide)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">Privacy & Security Notice</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                All data processing occurs locally in your browser. No data is uploaded to external servers. 
                This ensures complete privacy and DPDP Act 2023 compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};