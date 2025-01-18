import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function LeaveRequest() {
  const { currentUser } = useAuth();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [leaveType, setLeaveType] = useState('vacation');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Load existing leave requests from localStorage
  const loadLeaveRequests = () => {
    return JSON.parse(localStorage.getItem('leaveRequests')) || [];
  };

  // Save leave requests to localStorage
  const saveLeaveRequests = (requests) => {
    localStorage.setItem('leaveRequests', JSON.stringify(requests));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to submit a leave request.");
      return;
    }

    const newRequest = {
      id: String(new Date().getTime()), // Unique ID based on timestamp
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      leaveType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      reason,
      status: 'pending', // Initial status
    };

    // Load existing leave requests, add the new one, and save
    const existingRequests = loadLeaveRequests();
    saveLeaveRequests([...existingRequests, newRequest]);

    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Leave</h2>

      {submitted ? (
        <div className="text-green-600 text-center py-4">
          Your leave request has been submitted successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="vacation">Vacation Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                minDate={startDate}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
}

export default LeaveRequest;
