import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface CustomField {
    id: string;
    label: string;
    type: 'text' | 'dropdown' | 'checkbox';
    required: boolean;
    options?: string[];
    placeholder?: string;
}

interface ConsumerRSVPModalProps {
    visible: boolean;
    event: {
        id: string;
        title: string;
        rsvp_config?: {
            max_capacity?: number | null;
            custom_fields?: CustomField[];
        };
        enabled_features?: {
            ticketing?: boolean;
        };
        ticketing_config?: {
            price_per_ticket?: number | null;
            currency?: string;
        };
    };
    onClose: () => void;
    onSuccess: () => void;
}

const ConsumerRSVPModal: React.FC<ConsumerRSVPModalProps> = ({
    visible,
    event,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        guest_name: '',
        guest_email: '',
        seats_reserved: 1,
        custom_responses: {} as Record<string, any>
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Reset form when modal opens
        if (visible) {
            setFormData({
                guest_name: '',
                guest_email: '',
                seats_reserved: 1,
                custom_responses: {}
            });
            setError(null);
        }
    }, [visible]);

    const handleCustomResponseChange = (fieldId: string, value: any) => {
        setFormData({
            ...formData,
            custom_responses: {
                ...formData.custom_responses,
                [fieldId]: value
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate required custom fields
        const customFields = event.rsvp_config?.custom_fields || [];
        for (const field of customFields) {
            if (field.required && !formData.custom_responses[field.id]) {
                setError(`Please answer the required question: ${field.label}`);
                setLoading(false);
                return;
            }
        }

        try {
            await apiService.submitRSVP(event.id, formData);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err?.message || 'Failed to submit RSVP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={onClose} />

                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">RSVP for Event</h3>
                                <button type="button" onClick={onClose} className="text-white hover:text-gray-200">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-blue-100 text-sm mt-1">{event.title}</p>
                        </div>

                        <div className="px-6 py-6 space-y-6">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4 text-left">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.guest_name}
                                        onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.guest_email}
                                        onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Seats *</label>
                                    <select
                                        value={formData.seats_reserved}
                                        onChange={(e) => setFormData({ ...formData, seats_reserved: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    >
                                        {[1, 2, 3, 4, 5].map(nu => (
                                            <option key={nu} value={nu}>{nu} {nu === 1 ? 'Seat' : 'Seats'}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dynamic Custom Fields */}
                                {event.rsvp_config?.custom_fields?.map((field) => (
                                    <div key={field.id} className="pt-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            {field.label} {field.required && '*'}
                                        </label>

                                        {field.type === 'text' && (
                                            <input
                                                type="text"
                                                required={field.required}
                                                value={formData.custom_responses[field.id] || ''}
                                                onChange={(e) => handleCustomResponseChange(field.id, e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                placeholder={field.placeholder}
                                            />
                                        )}

                                        {field.type === 'dropdown' && (
                                            <select
                                                required={field.required}
                                                value={formData.custom_responses[field.id] || ''}
                                                onChange={(e) => handleCustomResponseChange(field.id, e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            >
                                                <option value="">Select an option...</option>
                                                {field.options?.map((opt, i) => (
                                                    <option key={i} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        )}

                                        {field.type === 'checkbox' && (
                                            <label className="flex items-center gap-2 cursor-pointer mt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.custom_responses[field.id] || false}
                                                    onChange={(e) => handleCustomResponseChange(field.id, e.target.checked)}
                                                    className="w-4 h-4 text-blue-600 rounded"
                                                />
                                                <span className="text-sm text-gray-600">Yes</span>
                                            </label>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {event.enabled_features?.ticketing && (
                                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                    <div className="flex items-center justify-between text-green-800">
                                        <span className="font-semibold text-sm">Total Amount:</span>
                                        <span className="font-bold text-lg">
                                            {event.ticketing_config?.currency || 'THB'} {(event.ticketing_config?.price_per_ticket || 0) * formData.seats_reserved}
                                        </span>
                                    </div>
                                    <p className="text-xs text-green-600 mt-1">Payment instructions will be sent after RSVP.</p>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-8 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : event.enabled_features?.ticketing ? 'Confirm & Pay' : 'Submit RSVP'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConsumerRSVPModal;
