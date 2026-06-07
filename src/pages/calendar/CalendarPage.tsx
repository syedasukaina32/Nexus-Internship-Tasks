import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../../context/AuthContext';
import { Calendar as CalendarIcon, Clock, Check, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface MeetingRequest {
  id: string;
  requesterName: string;
  date: Date;
  time: string;
  status: 'pending' | 'accepted' | 'declined';
  title: string;
}

interface AvailabilitySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  
  // Mock data
  const [requests, setRequests] = useState<MeetingRequest[]>([
    {
      id: '1',
      requesterName: 'Alice Johnson',
      date: new Date(new Date().getTime() + 86400000), // Tomorrow
      time: '14:00',
      status: 'pending',
      title: 'Initial Pitch Meeting'
    },
    {
      id: '2',
      requesterName: 'Bob Smith',
      date: new Date(new Date().getTime() + 172800000), // Day after tomorrow
      time: '10:00',
      status: 'accepted',
      title: 'Due Diligence Follow-up'
    }
  ]);

  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    { id: '1', day: 'Monday', startTime: '09:00', endTime: '12:00' },
    { id: '2', day: 'Wednesday', startTime: '13:00', endTime: '16:00' },
  ]);

  const handleAccept = (id: string) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
    toast.success('Meeting accepted');
  };

  const handleDecline = (id: string) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'declined' } : r));
    toast.error('Meeting declined');
  };

  const addSlot = () => {
    // In a real app, this would open a modal to pick day/time
    const newSlot: AvailabilitySlot = {
      id: Date.now().toString(),
      day: 'Friday',
      startTime: '10:00',
      endTime: '12:00'
    };
    setAvailability([...availability, newSlot]);
    toast.success('Availability slot added');
  };

  const removeSlot = (id: string) => {
    setAvailability(availability.filter(a => a.id !== id));
    toast.success('Availability slot removed');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Meeting Scheduling Calendar</h1>
        <button className="btn btn-primary flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
          <Plus size={18} />
          <span>New Meeting</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Calendar & Availability */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CalendarIcon className="mr-2 text-primary-600" size={20} />
              Calendar View
            </h2>
            <div className="calendar-container w-full max-w-full overflow-hidden flex justify-center border rounded-lg p-4 bg-gray-50">
              <Calendar 
                onChange={(val) => setDate(val as Date)} 
                value={date} 
                className="w-full border-none bg-transparent"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Clock className="mr-2 text-primary-600" size={20} />
                My Availability
              </h2>
              <button onClick={addSlot} className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                + Add Slot
              </button>
            </div>
            
            <div className="space-y-3">
              {availability.map(slot => (
                <div key={slot.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div>
                    <span className="font-medium text-gray-800">{slot.day}</span>
                    <span className="text-gray-500 ml-2 text-sm">{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <button onClick={() => removeSlot(slot.id)} className="text-red-500 hover:text-red-700">
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Requests & Upcoming */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Meeting Requests</h2>
            <div className="space-y-4">
              {requests.filter(r => r.status === 'pending').length === 0 ? (
                <p className="text-gray-500 text-sm">No pending requests.</p>
              ) : (
                requests.filter(r => r.status === 'pending').map(req => (
                  <div key={req.id} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">{req.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">with {req.requesterName}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {req.date.toLocaleDateString()} at {req.time}
                    </p>
                    <div className="mt-3 flex space-x-2">
                      <button 
                        onClick={() => handleAccept(req.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-md text-sm font-medium flex justify-center items-center"
                      >
                        <Check size={16} className="mr-1" /> Accept
                      </button>
                      <button 
                        onClick={() => handleDecline(req.id)}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-1.5 rounded-md text-sm font-medium flex justify-center items-center"
                      >
                        <X size={16} className="mr-1" /> Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Confirmed Meetings</h2>
            <div className="space-y-3">
              {requests.filter(r => r.status === 'accepted').map(req => (
                <div key={req.id} className="p-3 border-l-4 border-primary-500 bg-gray-50 rounded-r-lg">
                  <h3 className="font-medium text-gray-900 text-sm">{req.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{req.requesterName} • {req.date.toLocaleDateString()} {req.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
