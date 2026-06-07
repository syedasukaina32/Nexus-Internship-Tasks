import React from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ConfirmedMeetingsWidget: React.FC = () => {
  // Mock data for confirmed meetings
  const meetings = [
    { id: '1', title: 'Initial Pitch Meeting', with: 'Alice Johnson', date: 'Tomorrow at 14:00' },
    { id: '2', title: 'Due Diligence Follow-up', with: 'Bob Smith', date: 'Oct 15 at 10:00' }
  ];

  return (
    <Card>
      <CardHeader className="flex justify-between items-center border-b border-gray-100 pb-4">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Calendar className="mr-2 text-primary-600" size={20} />
          Confirmed Meetings
        </h2>
        <Link to="/calendar" className="text-sm font-medium text-primary-600 hover:text-primary-500">
          View Calendar
        </Link>
      </CardHeader>
      
      <CardBody className="pt-4 space-y-4">
        {meetings.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No upcoming meetings.</p>
        ) : (
          meetings.map(meeting => (
            <div key={meeting.id} className="flex flex-col p-3 border-l-4 border-primary-500 bg-primary-50 rounded-r-md">
              <span className="font-medium text-gray-900 text-sm">{meeting.title}</span>
              <span className="text-xs text-gray-600 mt-1">with {meeting.with}</span>
              <span className="text-xs font-semibold text-primary-700 mt-2">{meeting.date}</span>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
};
