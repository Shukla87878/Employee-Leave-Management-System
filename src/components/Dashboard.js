import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { currentUser } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);

  // Load leave requests from localStorage
  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    if (currentUser.role === 'employee') {
      // Filter leave requests to show only those for the logged-in employee
      const userRequests = storedRequests.filter(
        (request) => request.employeeId === currentUser.id
      );
      setLeaveRequests(userRequests);
    } else if (currentUser.role === 'manager') {
      setLeaveRequests(storedRequests);
    }
  }, [currentUser]);

  // Handle approving/rejecting leave requests
  const updateRequestStatus = (id, status, comment) => {
    const updatedRequests = leaveRequests.map((request) =>
      request.id === id
        ? { ...request, status, managerComment: comment || '' }
        : request
    );
    setLeaveRequests(updatedRequests);
    localStorage.setItem('leaveRequests', JSON.stringify(updatedRequests));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome, {currentUser.name}!
        </h1>

        {/* Employee View */}
        {currentUser.role === 'employee' && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Your Leave Balance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Vacation Leave</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {currentUser.leaveBalance.vacation} days
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Sick Leave</p>
                  <p className="text-2xl font-bold text-green-800">
                    {currentUser.leaveBalance.sick} days
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Personal Leave</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {currentUser.leaveBalance.personal} days
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Your Leave Requests
              </h2>
              {leaveRequests.length === 0 ? (
                <p className="text-gray-500">You have no leave requests.</p>
              ) : (
                <table className="min-w-full bg-white border rounded-lg shadow">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">Type</th>
                      <th className="px-4 py-2 border">Dates</th>
                      <th className="px-4 py-2 border">Reason</th>
                      <th className="px-4 py-2 border">Status</th>
                      <th className="px-4 py-2 border">Manager Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-4 py-2 border">{request.leaveType}</td>
                        <td className="px-4 py-2 border">
                          {new Date(request.startDate).toLocaleDateString()} -{' '}
                          {new Date(request.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 border">{request.reason}</td>
                        <td className="px-4 py-2 border capitalize">
                          {request.status}
                        </td>
                        <td className="px-4 py-2 border">
                          {request.managerComment || 'No comment'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mt-6">
              <Link
                to="/request-leave"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Request Leave
              </Link>
            </div>
          </>
        )}

        {/* Manager View */}
        {currentUser.role === 'manager' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Pending Leave Requests
            </h2>
            {leaveRequests.length === 0 ? (
              <p className="text-gray-500">No leave requests available.</p>
            ) : (
              <table className="min-w-full bg-white border rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Employee</th>
                    <th className="px-4 py-2 border">Type</th>
                    <th className="px-4 py-2 border">Dates</th>
                    <th className="px-4 py-2 border">Reason</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Manager Comment</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-4 py-2 border">{request.name}</td>
                      <td className="px-4 py-2 border">{request.leaveType}</td>
                      <td className="px-4 py-2 border">
                        {new Date(request.startDate).toLocaleDateString()} -{' '}
                        {new Date(request.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">{request.reason}</td>
                      <td className="px-4 py-2 border capitalize">
                        {request.status}
                      </td>
                      <td className="px-4 py-2 border">
                        {request.managerComment || 'No comment'}
                      </td>
                      <td className="px-4 py-2 border">
                        {request.status === 'pending' && (
                          <div className="flex flex-col">
                            <textarea
                              placeholder="Add comment (optional)"
                              rows={2}
                              className="mb-2 p-2 border border-gray-300 rounded-md w-full"
                              onChange={(e) =>
                                (request.managerComment = e.target.value)
                              }
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateRequestStatus(
                                    request.id,
                                    'approved',
                                    request.managerComment
                                  )
                                }
                                className="bg-green-500 text-white px-2 py-1 rounded"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  updateRequestStatus(
                                    request.id,
                                    'rejected',
                                    request.managerComment
                                  )
                                }
                                className="bg-red-500 text-white px-2 py-1 rounded"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
