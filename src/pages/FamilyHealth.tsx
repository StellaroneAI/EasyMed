import React, { useState } from 'react';
import { Users, Plus, Heart, Calendar, FileText } from 'lucide-react';
import type { FamilyMember } from '../types';

const FamilyHealth: React.FC = () => {
  const mockFamilyMembers: FamilyMember[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      relation: 'Self',
      dateOfBirth: '1985-06-15',
      gender: 'male',
      bloodGroup: 'O+',
      healthRecords: [],
      medications: [],
      addedBy: 'user1',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Priya Kumar',
      relation: 'Spouse',
      dateOfBirth: '1988-03-22',
      gender: 'female',
      bloodGroup: 'A+',
      healthRecords: [],
      medications: [],
      addedBy: 'user1',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ];

  const [familyMembers] = useState<FamilyMember[]>(mockFamilyMembers);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Family Health</h1>
          <p className="text-gray-600 mt-2">Manage health records for your family members</p>
        </div>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-gray-600">{member.relation}</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <p><strong>Age:</strong> {new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()} years</p>
              <p><strong>Gender:</strong> {member.gender}</p>
              <p><strong>Blood Group:</strong> {member.bloodGroup || 'Not specified'}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center p-2 bg-blue-50 rounded">
                <Heart className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-blue-600">Health</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <Calendar className="h-4 w-4 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-green-600">Appointments</p>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <FileText className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-purple-600">Records</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyHealth;