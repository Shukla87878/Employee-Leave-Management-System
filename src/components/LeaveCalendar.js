import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../contexts/AuthContext';

function LeaveCalendar() {
  const { currentUser } = useAuth(); // Get the logged-in user details
  const [date, setDate] = useState(new Date());
  const [approvedLeaves, setApprovedLeaves] = useState([]);

  // Load approved leaves from localStorage for the logged-in employee
  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    const userLeaves = storedRequests.filter(
      (request) =>
        request.status === 'approved' && request.userId === currentUser.id
    );

    setApprovedLeaves(
      userLeaves.map((leave) => ({
        employeeName: leave.name,
        startDate: new Date(leave.startDate),
        endDate: new Date(leave.endDate),
        type: leave.leaveType,
      }))
    );
  }, [currentUser]);

  // Function to render tile content in the calendar
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const leaveOnDate = approvedLeaves.find(
        (leave) => date >= leave.startDate && date <= leave.endDate
      );

      if (leaveOnDate) {
        return (
          <div className="text-xs bg-indigo-100 p-1 rounded">
            {leaveOnDate.type}
          </div>
        );
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Leave Calendar</h2>
      <div className="calendar-container">
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={tileContent}
          className="w-full"
        />
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">My Upcoming Leaves</h3>
        {approvedLeaves.length > 0 ? (
          approvedLeaves.map((leave, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-2">
              <p className="font-medium">{leave.employeeName}</p>
              <p className="text-sm text-gray-600">
                {leave.startDate.toLocaleDateString()} - {leave.endDate.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 capitalize">{leave.type}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No upcoming leaves.</p>
        )}
      </div>
    </div>
  );
}

export default LeaveCalendar;
