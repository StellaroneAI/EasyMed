import React from 'react';
import { 
  Heart, 
  Calendar, 
  FileText, 
  Users, 
  AlertTriangle, 
  Activity,
  Thermometer,
  Weight,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const quickActions = [
    {
      name: 'Book Appointment',
      description: 'Schedule with doctors',
      icon: Calendar,
      href: '/appointments',
      color: 'bg-blue-500',
    },
    {
      name: 'Check Symptoms',
      description: 'AI health analysis',
      icon: Activity,
      href: '/ai-assistant',
      color: 'bg-green-500',
    },
    {
      name: 'Emergency Help',
      description: 'Call 108 ambulance',
      icon: AlertTriangle,
      href: '/emergency',
      color: 'bg-red-500',
    },
    {
      name: 'Health Records',
      description: 'View medical history',
      icon: FileText,
      href: '/health-records',
      color: 'bg-purple-500',
    },
  ];

  const healthStats = [
    {
      name: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      icon: Heart,
      status: 'normal',
      change: '+2.1%',
    },
    {
      name: 'Temperature',
      value: '98.6',
      unit: '°F',
      icon: Thermometer,
      status: 'normal',
      change: '0%',
    },
    {
      name: 'Weight',
      value: '68.5',
      unit: 'kg',
      icon: Weight,
      status: 'normal',
      change: '-0.5%',
    },
    {
      name: 'Sleep',
      value: '7.5',
      unit: 'hrs',
      icon: Clock,
      status: 'good',
      change: '+5.2%',
    },
  ];

  const upcomingAppointments = [
    {
      id: '1',
      doctorName: 'Dr. Priya Sharma',
      department: 'Cardiology',
      date: '2024-08-02',
      time: '10:30 AM',
      hospital: 'Apollo Hospital',
    },
    {
      id: '2',
      doctorName: 'Dr. Rajesh Kumar',
      department: 'General Medicine',
      date: '2024-08-05',
      time: '2:00 PM',
      hospital: 'Fortis Healthcare',
    },
  ];

  const recentMedications = [
    {
      name: 'Paracetamol',
      dosage: '500mg',
      nextDose: '2:00 PM',
      remaining: '5 pills',
    },
    {
      name: 'Vitamin D3',
      dosage: '1000 IU',
      nextDose: '8:00 PM',
      remaining: '15 tablets',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your health overview.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.name}
              to={action.href}
              className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`${action.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{action.name}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Health Stats */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Health Vitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className={`h-8 w-8 ${getStatusColor(stat.status)}`} />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value} <span className="text-sm font-normal text-gray-500">{stat.unit}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <Link to="/appointments" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="border-l-4 border-primary-500 pl-4 py-2">
                <h4 className="font-medium text-gray-900">{appointment.doctorName}</h4>
                <p className="text-sm text-gray-600">{appointment.department}</p>
                <p className="text-sm text-gray-500">
                  {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                </p>
                <p className="text-sm text-gray-500">{appointment.hospital}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Medications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Medication Reminders</h3>
            <Link to="/health-records" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentMedications.map((medication, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{medication.name}</h4>
                  <p className="text-sm text-gray-600">{medication.dosage}</p>
                  <p className="text-sm text-gray-500">Next: {medication.nextDose}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{medication.remaining}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Family Health Summary */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Family Health</h3>
          <Link to="/family" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Manage family
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">4</p>
            <p className="text-sm text-gray-600">Family Members</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">2</p>
            <p className="text-sm text-gray-600">Upcoming Checkups</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">100%</p>
            <p className="text-sm text-gray-600">Health Coverage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;