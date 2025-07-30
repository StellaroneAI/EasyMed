import React from 'react';
import { Phone, MapPin, AlertTriangle, Heart, Shield, Zap } from 'lucide-react';

const Emergency: React.FC = () => {
  const emergencyContacts = [
    {
      name: 'Ambulance',
      number: '108',
      description: 'Emergency medical services',
      icon: Heart,
      color: 'bg-red-500',
    },
    {
      name: 'Police',
      number: '100',
      description: 'Police emergency',
      icon: Shield,
      color: 'bg-blue-500',
    },
    {
      name: 'Fire Department',
      number: '101',
      description: 'Fire emergency',
      icon: Zap,
      color: 'bg-orange-500',
    },
  ];

  const nearbyHospitals = [
    {
      name: 'Apollo Hospital',
      address: 'Greams Lane, Off Greams Road, Chennai',
      distance: '2.3 km',
      phone: '+91-44-2829-3333',
      emergency: true,
    },
    {
      name: 'Fortis Malar Hospital',
      address: '52, 1st Main Road, Gandhi Nagar, Chennai',
      distance: '3.1 km',
      phone: '+91-44-4289-2222',
      emergency: true,
    },
    {
      name: 'MIOT International',
      address: '4/112, Mount Poonamalle Road, Chennai',
      distance: '4.5 km',
      phone: '+91-44-2249-2288',
      emergency: true,
    },
  ];

  const handleEmergencyCall = (number: string) => {
    if (confirm(`Are you sure you want to call ${number}?`)) {
      window.open(`tel:${number}`, '_self');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Emergency Services</h1>
        <p className="text-gray-600 mt-2">Quick access to emergency contacts and nearby hospitals</p>
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-red-800 font-semibold">Emergency Protocol</h3>
            <p className="text-red-700 text-sm mt-1">
              In case of a medical emergency, call 108 immediately. Stay calm and provide clear information about your location and condition.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyContacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <button
                key={contact.number}
                onClick={() => handleEmergencyCall(contact.number)}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all text-center"
              >
                <div className={`${contact.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                <p className="text-2xl font-bold text-red-600 my-2">{contact.number}</p>
                <p className="text-sm text-gray-600">{contact.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="text-yellow-800 font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 transition-colors">
            Share Location with Emergency Services
          </button>
          <button className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors">
            Send Emergency Alert to Family
          </button>
        </div>
      </div>

      {/* Nearby Hospitals */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Hospitals</h2>
        <div className="space-y-4">
          {nearbyHospitals.map((hospital, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                    {hospital.emergency && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        24/7 Emergency
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{hospital.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{hospital.distance} away</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEmergencyCall(hospital.phone)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center space-x-1"
                      >
                        <Phone className="h-3 w-3" />
                        <span>Call</span>
                      </button>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                        Directions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-blue-800 font-semibold mb-3">Emergency Tips</h3>
        <ul className="text-blue-700 text-sm space-y-2">
          <li>• Stay calm and speak clearly when calling emergency services</li>
          <li>• Provide your exact location and nature of emergency</li>
          <li>• Don't hang up until told to do so</li>
          <li>• Keep emergency contacts readily available</li>
          <li>• Know your medical conditions and current medications</li>
        </ul>
      </div>
    </div>
  );
};

export default Emergency;