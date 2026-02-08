// [2026-01-21] - Event Attendance Management Dashboard
// Displays all RSVPs for an event with filtering, search, and check-in
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import QRScannerStub from './QRScannerStub';

interface AttendanceRecord {
    id: string;
    event_id: string;
    user_id: string | null;
    guest_name: string;
    guest_email: string;
    seats_reserved: number;
    status: string;
    payment_status: string;
    payment_proof_url: string | null;
    qr_code: string | null;
    checked_in_at: string | null;
    waitlist_position: number | null;
    custom_responses: any;
    created_at: string;
    updated_at: string;
}

interface AttendanceDashboardProps {
    eventId: string;
    eventTitle: string;
    maxCapacity?: number;
    requiresPayment?: boolean;
    onClose: () => void;
}

const AttendanceDashboard: React.FC<AttendanceDashboardProps> = ({
    eventId,
    eventTitle,
    maxCapacity,
    requiresPayment,
    onClose
}) => {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');
    const [showQRScanner, setShowQRScanner] = useState(false);

    useEffect(() => {
        loadAttendance();
    }, [eventId]);

    const loadAttendance = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getEventAttendance(eventId);
            setAttendance(response.data || []);
        } catch (err: any) {
            console.error('Error loading attendance:', err);
            setError(err.message || 'Failed to load attendance');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async (attendanceId: string) => {
        try {
            await apiService.updateAttendanceStatus(eventId, attendanceId, {
                status: 'CONFIRMED'
            });
            loadAttendance();
        } catch (err: any) {
            alert('Failed to check in: ' + err.message);
        }
    };

    const handleMarkPaid = async (attendanceId: string) => {
        try {
            await apiService.updateAttendanceStatus(eventId, attendanceId, {
                payment_status: 'RECEIVED'
            });
            loadAttendance();
        } catch (err: any) {
            alert('Failed to mark as paid: ' + err.message);
        }
    };

    const handleCancel = async (attendanceId: string) => {
        if (!confirm('Are you sure you want to cancel this RSVP?')) return;

        try {
            await apiService.cancelAttendance(eventId, attendanceId);
            loadAttendance();
        } catch (err: any) {
            alert('Failed to cancel: ' + err.message);
        }
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Seats', 'Status', 'Payment Status', 'RSVP Date'];
        const rows = filteredAttendance.map(a => [
            a.guest_name,
            a.guest_email,
            a.seats_reserved,
            a.status,
            a.payment_status,
            new Date(a.created_at).toLocaleDateString()
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${eventTitle.replace(/\s+/g, '_')}_attendance.csv`;
        a.click();
    };

    // Filter and search
    const filteredAttendance = attendance.filter(a => {
        const matchesSearch =
            a.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.guest_email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || a.payment_status === paymentFilter;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    // Statistics
    const stats = {
        total: attendance.length,
        confirmed: attendance.filter(a => a.status === 'CONFIRMED').length,
        pending: attendance.filter(a => a.status === 'AWAITING_CONFIRMATION').length,
        cancelled: attendance.filter(a => a.status === 'CANCELLED').length,
        totalSeats: attendance.reduce((sum, a) => sum + a.seats_reserved, 0),
        confirmedSeats: attendance.filter(a => a.status === 'CONFIRMED').reduce((sum, a) => sum + a.seats_reserved, 0),
        paidCount: attendance.filter(a => a.payment_status === 'RECEIVED').length,
        pendingPayment: attendance.filter(a => a.payment_status === 'PENDING').length
    };

    const capacityPercentage = maxCapacity ? (stats.confirmedSeats / maxCapacity) * 100 : 0;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50">
            <div className="flex items-start justify-center min-h-screen px-4 pt-4 pb-20">
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl my-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">{eventTitle}</h2>
                                <p className="text-blue-100 text-sm mt-1">Attendance Management</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="text-2xl font-bold text-gray-900">{stats.confirmed}</div>
                                <div className="text-sm text-gray-600">Confirmed</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                                <div className="text-sm text-gray-600">Pending</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="text-2xl font-bold text-gray-900">{stats.confirmedSeats}</div>
                                <div className="text-sm text-gray-600">
                                    Seats {maxCapacity ? `/ ${maxCapacity}` : ''}
                                </div>
                            </div>
                            {requiresPayment && (
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="text-2xl font-bold text-green-600">{stats.paidCount}</div>
                                    <div className="text-sm text-gray-600">Paid</div>
                                </div>
                            )}
                        </div>

                        {maxCapacity && (
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Capacity</span>
                                    <span>{Math.round(capacityPercentage)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${capacityPercentage >= 100 ? 'bg-red-500' :
                                            capacityPercentage >= 80 ? 'bg-yellow-500' :
                                                'bg-green-500'
                                            }`}
                                        style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Filters and Search */}
                    <div className="px-6 py-4 bg-white border-b border-gray-200">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="AWAITING_CONFIRMATION">Pending</option>
                                <option value="RSVP_SUBMITTED">RSVP Submitted</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                            {requiresPayment && (
                                <select
                                    value={paymentFilter}
                                    onChange={(e) => setPaymentFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Payments</option>
                                    <option value="RECEIVED">Paid</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            )}
                            <button
                                onClick={exportToCSV}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap flex items-center gap-2"
                            >
                                📥 Export CSV
                            </button>
                            <button
                                onClick={() => setShowQRScanner(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center gap-2"
                            >
                                📷 QR Scan
                            </button>
                        </div>
                    </div>

                    {/* Attendance List */}
                    <div className="px-6 py-4 max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading attendance...</div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-600">{error}</div>
                        ) : filteredAttendance.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {searchQuery || statusFilter !== 'all' || paymentFilter !== 'all'
                                    ? 'No matching attendees found'
                                    : 'No RSVPs yet'}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredAttendance.map((record) => (
                                    <div
                                        key={record.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{record.guest_name}</div>
                                                    <div className="text-sm text-gray-600">{record.guest_email}</div>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {record.seats_reserved} {record.seats_reserved === 1 ? 'seat' : 'seats'}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${record.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                    record.status === 'AWAITING_CONFIRMATION' ? 'bg-yellow-100 text-yellow-800' :
                                                        record.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {record.status.replace(/_/g, ' ')}
                                                </span>
                                                {requiresPayment && (
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${record.payment_status === 'RECEIVED' ? 'bg-green-100 text-green-800' :
                                                        record.payment_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            record.payment_status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        💰 {record.payment_status}
                                                    </span>
                                                )}
                                                {record.checked_in_at && (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                        ✓ Checked In
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            {record.status !== 'CONFIRMED' && (
                                                <button
                                                    onClick={() => handleCheckIn(record.id)}
                                                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                                    title="Confirm attendance"
                                                >
                                                    ✓ Confirm
                                                </button>
                                            )}
                                            {requiresPayment && record.payment_status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleMarkPaid(record.id)}
                                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                                    title="Mark as paid"
                                                >
                                                    💰 Mark Paid
                                                </button>
                                            )}
                                            {record.payment_proof_url && (
                                                <a
                                                    href={record.payment_proof_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                                    title="View payment proof"
                                                >
                                                    📄 Proof
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleCancel(record.id)}
                                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                                title="Cancel RSVP"
                                            >
                                                ✕ Cancel
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Showing {filteredAttendance.length} of {attendance.length} attendees
                            </div>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showQRScanner && (
                <QRScannerStub
                    onClose={() => setShowQRScanner(false)}
                    onScan={(code) => {
                        console.log('Scanned QR:', code);
                        // In a real app, this would call the API to mark as checked in
                        // find record by code and update
                        const record = attendance.find(a => a.qr_code === code);
                        if (record) {
                            handleCheckIn(record.id);
                        } else {
                            // alert('Invalid ticket or attendee not found');
                        }
                    }}
                />
            )}
        </div>
    );
};

export default AttendanceDashboard;
