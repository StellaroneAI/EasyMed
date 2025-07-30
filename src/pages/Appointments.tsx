import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, Plus, Search } from 'lucide-react';
import type { Appointment } from '../types';

const Appointments: React.FC = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const mockAppointments: Appointment[] = [
    {
      id: '1',
      userId: 'user1',
      doctorName: 'Dr. Priya Sharma',
      hospitalName: 'Apollo Hospital',
      department: 'Cardiology',
      date: '2024-08-02',
      time: '10:30 AM',
      duration: 30,
      type: 'consultation',
      status: 'confirmed',
      notes: 'Regular checkup',
      symptoms: 'Chest discomfort',
      createdAt: '2024-07-30T10:00:00Z'
    },
    {
      id: '2',
      userId: 'user1',
      doctorName: 'Dr. Rajesh Kumar',
      hospitalName: 'Fortis Healthcare',
      department: 'General Medicine',
      date: '2024-08-05',
      time: '2:00 PM',
      duration: 45,
      type: 'checkup',
      status: 'scheduled',
      notes: 'Annual health checkup',
      createdAt: '2024-07-30T11:00:00Z'
    },
    {
      id: '3',
      userId: 'user1',
      doctorName: 'Dr. Anita Desai',
      hospitalName: 'Max Healthcare',
      department: 'Dermatology',
      date: '2024-07-28',
      time: '9:00 AM',
      duration: 20,
      type: 'follow-up',
      status: 'completed',
      notes: 'Skin condition follow-up',
      createdAt: '2024-07-25T09:00:00Z'
    }
  ];

  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [newAppointment, setNewAppointment] = useState<{
    doctorName: string;
    hospitalName: string;
    department: string;
    date: string;
    time: string;
    type: 'consultation' | 'checkup' | 'follow-up' | 'emergency';
    symptoms: string;
    notes: string;
  }>({
    doctorName: '',
    hospitalName: '',
    department: '',
    date: '',
    time: '',
    type: 'consultation',
    symptoms: '',
    notes: ''
  });

  const departments = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'ENT',
    'Ophthalmology',
    'Dentistry'
  ];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleBookAppointment = () => {
    const appointment: Appointment = {
      id: Date.now().toString(),
      userId: 'user1',
      ...newAppointment,
      duration: 30,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({
      doctorName: '',
      hospitalName: '',
      department: '',
      date: '',
      time: '',
      type: 'consultation',
      symptoms: '',
      notes: ''
    });
    setShowBookingForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-2">Manage your medical appointments</p>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="mt-4 sm:mt-0 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{appointment.doctorName}</h3>
                    <p className="text-gray-600">{appointment.department}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{appointment.hospitalName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time} ({appointment.duration} min)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}</span>
                  </div>
                </div>

                {appointment.symptoms && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600"><strong>Symptoms:</strong> {appointment.symptoms}</p>
                  </div>
                )}

                {appointment.notes && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600"><strong>Notes:</strong> {appointment.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                {appointment.status === 'scheduled' && (
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                    Confirm
                  </button>
                )}
                <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
                  Reschedule
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600">Book your first appointment to get started.</p>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Book New Appointment</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={newAppointment.doctorName}
                    onChange={(e) => setNewAppointment({...newAppointment, doctorName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter doctor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital/Clinic</label>
                  <input
                    type="text"
                    value={newAppointment.hospitalName}
                    onChange={(e) => setNewAppointment({...newAppointment, hospitalName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter hospital name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={newAppointment.department}
                    onChange={(e) => setNewAppointment({...newAppointment, department: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                  <select
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value as typeof newAppointment.type})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="checkup">Checkup</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (Optional)</label>
                  <textarea
                    value={newAppointment.symptoms}
                    onChange={(e) => setNewAppointment({...newAppointment, symptoms: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="Describe your symptoms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={2}
                    placeholder="Additional notes"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleBookAppointment}
                  className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600"
                  disabled={!newAppointment.doctorName || !newAppointment.hospitalName || !newAppointment.date || !newAppointment.time}
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;