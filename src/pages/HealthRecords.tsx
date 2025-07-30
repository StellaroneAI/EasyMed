import React, { useState } from 'react';
import { FileText, Download, Search, Plus } from 'lucide-react';
import type { HealthRecord } from '../types';

const HealthRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const mockRecords: HealthRecord[] = [
    {
      id: '1',
      userId: 'user1',
      type: 'checkup',
      title: 'Annual Health Checkup',
      description: 'Complete physical examination with blood tests',
      date: '2024-07-15',
      doctorName: 'Dr. Priya Sharma',
      hospitalName: 'Apollo Hospital',
      createdAt: '2024-07-15T10:00:00Z'
    },
    {
      id: '2',
      userId: 'user1',
      type: 'prescription',
      title: 'Medication for Hypertension',
      description: 'Prescribed medication for blood pressure management',
      date: '2024-07-10',
      doctorName: 'Dr. Rajesh Kumar',
      hospitalName: 'Fortis Healthcare',
      createdAt: '2024-07-10T14:30:00Z'
    }
  ];

  const [records] = useState<HealthRecord[]>(mockRecords);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
          <p className="text-gray-600 mt-2">Manage your medical history and documents</p>
        </div>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="checkup">Checkups</option>
            <option value="test">Tests</option>
            <option value="prescription">Prescriptions</option>
            <option value="emergency">Emergency</option>
            <option value="consultation">Consultations</option>
          </select>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                  <span className="ml-2 bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {record.type}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{record.description}</p>
                <div className="text-sm text-gray-500">
                  <p>Date: {new Date(record.date).toLocaleDateString()}</p>
                  {record.doctorName && <p>Doctor: {record.doctorName}</p>}
                  {record.hospitalName && <p>Hospital: {record.hospitalName}</p>}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 flex items-center space-x-1">
                  <Download className="h-3 w-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthRecords;