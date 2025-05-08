'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DoctorLabResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(patientId || '');

  // Mock lab results data
  useEffect(() => {
    // Mock patient list
    const mockPatients = [
      { id: 'PAT001', name: 'John Smith' },
      { id: 'PAT002', name: 'Sarah Johnson' },
      { id: 'PAT003', name: 'Michael Williams' },
      { id: 'PAT004', name: 'Emily Brown' }
    ];
    
    // Mock lab results
    const mockResults = [
      {
        id: 'lab001',
        patientId: 'PAT001',
        patientName: 'John Smith',
        testType: 'Complete Blood Count',
        orderDate: '2025-04-25',
        resultDate: '2025-04-26',
        status: 'completed',
        orderedBy: 'Dr. Robert Miller',
        performedBy: 'City General Hospital Laboratory',
        details: {
          results: [
            { name: 'White Blood Cell (WBC)', value: '7.5', unit: '10^3/µL', referenceRange: '4.5-11.0', flag: 'normal' },
            { name: 'Red Blood Cell (RBC)', value: '4.8', unit: '10^6/µL', referenceRange: '4.5-5.9', flag: 'normal' },
            { name: 'Hemoglobin (Hgb)', value: '14.2', unit: 'g/dL', referenceRange: '13.5-17.5', flag: 'normal' },
            { name: 'Hematocrit (Hct)', value: '42', unit: '%', referenceRange: '41-50', flag: 'normal' },
            { name: 'Platelet Count', value: '180', unit: '10^3/µL', referenceRange: '150-450', flag: 'normal' }
          ],
          interpretation: 'Normal complete blood count. No significant abnormalities detected.'
        }
      },
      {
        id: 'lab002',
        patientId: 'PAT001',
        patientName: 'John Smith',
        testType: 'Lipid Panel',
        orderDate: '2025-04-25',
        resultDate: '2025-04-26',
        status: 'completed',
        orderedBy: 'Dr. Robert Miller',
        performedBy: 'City General Hospital Laboratory',
        details: {
          results: [
            { name: 'Total Cholesterol', value: '210', unit: 'mg/dL', referenceRange: '<200', flag: 'high' },
            { name: 'LDL Cholesterol', value: '130', unit: 'mg/dL', referenceRange: '<100', flag: 'high' },
            { name: 'HDL Cholesterol', value: '45', unit: 'mg/dL', referenceRange: '>40', flag: 'normal' },
            { name: 'Triglycerides', value: '150', unit: 'mg/dL', referenceRange: '<150', flag: 'normal' }
          ],
          interpretation: 'Elevated total cholesterol and LDL levels. Consider lifestyle modifications and possible medication if levels remain high at follow-up.'
        }
      },
      {
        id: 'lab003',
        patientId: 'PAT002',
        patientName: 'Sarah Johnson',
        testType: 'Thyroid Function Panel',
        orderDate: '2025-04-10',
        resultDate: '2025-04-11',
        status: 'completed',
        orderedBy: 'Dr. Jennifer Lee',
        performedBy: 'City General Hospital Laboratory',
        details: {
          results: [
            { name: 'TSH', value: '2.5', unit: 'mIU/L', referenceRange: '0.4-4.0', flag: 'normal' },
            { name: 'Free T4', value: '1.2', unit: 'ng/dL', referenceRange: '0.8-1.8', flag: 'normal' },
            { name: 'Free T3', value: '3.1', unit: 'pg/mL', referenceRange: '2.3-4.2', flag: 'normal' }
          ],
          interpretation: 'Normal thyroid function. No evidence of hyper- or hypothyroidism.'
        }
      },
      {
        id: 'lab004',
        patientId: 'PAT003',
        patientName: 'Michael Williams',
        testType: 'Comprehensive Metabolic Panel',
        orderDate: '2025-04-15',
        resultDate: '2025-04-16',
        status: 'completed',
        orderedBy: 'Dr. Michael Brown',
        performedBy: 'City General Hospital Laboratory',
        details: {
          results: [
            { name: 'Glucose', value: '110', unit: 'mg/dL', referenceRange: '70-99', flag: 'high' },
            { name: 'BUN', value: '15', unit: 'mg/dL', referenceRange: '7-20', flag: 'normal' },
            { name: 'Creatinine', value: '0.9', unit: 'mg/dL', referenceRange: '0.6-1.2', flag: 'normal' },
            { name: 'Sodium', value: '140', unit: 'mmol/L', referenceRange: '136-145', flag: 'normal' },
            { name: 'Potassium', value: '4.0', unit: 'mmol/L', referenceRange: '3.5-5.1', flag: 'normal' },
            { name: 'Calcium', value: '9.5', unit: 'mg/dL', referenceRange: '8.5-10.2', flag: 'normal' },
            { name: 'Albumin', value: '4.0', unit: 'g/dL', referenceRange: '3.4-5.4', flag: 'normal' },
            { name: 'Total Bilirubin', value: '0.8', unit: 'mg/dL', referenceRange: '0.1-1.2', flag: 'normal' },
            { name: 'ALT', value: '30', unit: 'U/L', referenceRange: '7-55', flag: 'normal' },
            { name: 'AST', value: '25', unit: 'U/L', referenceRange: '8-48', flag: 'normal' },
            { name: 'ALP', value: '70', unit: 'U/L', referenceRange: '40-129', flag: 'normal' }
          ],
          interpretation: 'Slightly elevated fasting glucose. Consider follow-up testing for prediabetes. Other metabolic parameters within normal limits.'
        }
      },
      {
        id: 'lab005',
        patientId: 'PAT004',
        patientName: 'Emily Brown',
        testType: 'Urinalysis',
        orderDate: '2025-04-20',
        resultDate: '2025-04-21',
        status: 'completed',
        orderedBy: 'Dr. Robert Miller',
        performedBy: 'City General Hospital Laboratory',
        details: {
          results: [
            { name: 'Color', value: 'Yellow', unit: '', referenceRange: 'Yellow', flag: 'normal' },
            { name: 'Clarity', value: 'Clear', unit: '', referenceRange: 'Clear', flag: 'normal' },
            { name: 'pH', value: '6.0', unit: '', referenceRange: '5.0-8.0', flag: 'normal' },
            { name: 'Specific Gravity', value: '1.020', unit: '', referenceRange: '1.005-1.030', flag: 'normal' },
            { name: 'Glucose', value: 'Negative', unit: '', referenceRange: 'Negative', flag: 'normal' },
            { name: 'Protein', value: 'Trace', unit: '', referenceRange: 'Negative', flag: 'abnormal' },
            { name: 'Leukocytes', value: 'Negative', unit: '', referenceRange: 'Negative', flag: 'normal' },
            { name: 'Nitrites', value: 'Negative', unit: '', referenceRange: 'Negative', flag: 'normal' },
            { name: 'Blood', value: 'Negative', unit: '', referenceRange: 'Negative', flag: 'normal' }
          ],
          interpretation: 'Trace protein detected. Consider repeat testing in 2-4 weeks. If persistent, further evaluation may be warranted.'
        }
      }
    ];

    setPatients(mockPatients);
    
    // Filter results by patient ID if provided
    const filteredResults = patientId 
      ? mockResults.filter(result => result.patientId === patientId)
      : mockResults;
    
    setTimeout(() => {
      setResults(filteredResults);
      setLoading(false);
    }, 800);
  }, [patientId]);

  const handlePatientChange = (e) => {
    const newPatientId = e.target.value;
    setSelectedPatient(newPatientId);
    
    // Update URL with new patient ID
    if (newPatientId) {
      router.push(`/doctor-dashboard/lab-results?patientId=${newPatientId}`);
    } else {
      router.push(`/doctor-dashboard/lab-results`);
    }
  };

  const viewResult = (result) => {
    setSelectedResult(result);
    setShowDetailView(true);
  };

  const closeDetailView = () => {
    setShowDetailView(false);
    setSelectedResult(null);
  };

  const getFlagColor = (flag) => {
    switch (flag.toLowerCase()) {
      case 'high':
      case 'abnormal':
        return 'bg-red-100 text-red-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'normal':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lab Results</h1>
              <p className="mt-1 text-sm text-gray-600">
                View and analyze patient laboratory results
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-x-3">
              <button
                onClick={() => router.push('/doctor-dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => router.push('/doctor-dashboard/consultation')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                New Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700">
                Filter by Patient
              </label>
              <select
                id="patient-select"
                name="patient-select"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedPatient}
                onChange={handlePatientChange}
              >
                <option value="">All Patients</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label htmlFor="test-type" className="block text-sm font-medium text-gray-700">
                Test Type
              </label>
              <select
                id="test-type"
                name="test-type"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue="all"
              >
                <option value="all">All Tests</option>
                <option value="cbc">Complete Blood Count</option>
                <option value="lipid">Lipid Panel</option>
                <option value="thyroid">Thyroid Function</option>
                <option value="metabolic">Metabolic Panel</option>
                <option value="urinalysis">Urinalysis</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label htmlFor="date-range" className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <select
                id="date-range"
                name="date-range"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue="all"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <button
                type="button"
                className="inline-flex mt-6 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Results List */}
          <div className={`lg:col-span-${showDetailView ? '1' : '3'}`}>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Lab Results</h3>
                <p className="mt-1 text-sm text-gray-500">{results.length} results found</p>
              </div>

              {loading ? (
                <div className="px-4 py-5 sm:p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {results.length > 0 ? (
                    results.map((result) => (
                      <li 
                        key={result.id}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedResult?.id === result.id ? 'bg-blue-50' : ''}`}
                        onClick={() => viewResult(result)}
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">{result.testType}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {new Date(result.resultDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                {result.patientName}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                {result.orderedBy}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <p>
                                Ordered: {new Date(result.orderDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-6 text-center text-gray-500">
                      No lab results found for the selected filters.
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Result Detail View */}
          {showDetailView && selectedResult && (
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{selectedResult.testType}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Result Date: {new Date(selectedResult.resultDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={closeDetailView}
                    className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</h4>
                      <p className="mt-1 text-sm text-gray-900">{selectedResult.patientName}</p>
                      <p className="text-sm text-gray-500">ID: {selectedResult.patientId}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ordered By</h4>
                      <p className="mt-1 text-sm text-gray-900">{selectedResult.orderedBy}</p>
                      <p className="text-sm text-gray-500">Date: {new Date(selectedResult.orderDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Test Results</h4>
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Test
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Result
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Unit
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reference Range
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedResult.details.results.map((item, index) => (
                            <tr key={index} className={item.flag !== 'normal' ? 'bg-red-50' : ''}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.value}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.unit}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.referenceRange}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getFlagColor(item.flag)}`}>
                                  {item.flag.charAt(0).toUpperCase() + item.flag.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Interpretation</h4>
                    <p className="text-sm text-gray-900">{selectedResult.details.interpretation}</p>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => alert('Printing functionality would go here')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                      </svg>
                      Print Results
                    </button>
                    <button
                      onClick={() => router.push(`/doctor-dashboard/consultation?patientId=${selectedResult.patientId}&name=${selectedResult.patientName}`)}
                      className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      Create Consultation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}