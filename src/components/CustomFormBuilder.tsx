import React from 'react';

export interface CustomField {
    id: string;
    label: string;
    type: 'text' | 'dropdown' | 'checkbox';
    required: boolean;
    options?: string[];
    placeholder?: string;
}

interface CustomFormBuilderProps {
    fields: CustomField[];
    onChange: (fields: CustomField[]) => void;
    maxFields?: number;
}

const CustomFormBuilder: React.FC<CustomFormBuilderProps> = ({
    fields = [],
    onChange,
    maxFields = 10
}) => {
    const addField = () => {
        if (fields.length >= maxFields) return;
        const newField: CustomField = {
            id: `field_${Date.now()}`,
            label: '',
            type: 'text',
            required: false,
            placeholder: ''
        };
        onChange([...fields, newField]);
    };

    const removeField = (index: number) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        onChange(newFields);
    };

    const updateField = (index: number, updates: Partial<CustomField>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        onChange(newFields);
    };

    const addOption = (fieldIndex: number) => {
        const field = fields[fieldIndex];
        const options = [...(field.options || []), ''];
        updateField(fieldIndex, { options });
    };

    const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
        const options = [...(fields[fieldIndex].options || [])];
        options[optionIndex] = value;
        updateField(fieldIndex, { options });
    };

    const removeOption = (fieldIndex: number, optionIndex: number) => {
        const options = [...(fields[fieldIndex].options || [])];
        options.splice(optionIndex, 1);
        updateField(fieldIndex, { options });
    };

    return (
        <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
                <h5 className="text-sm font-semibold text-gray-900">Custom RSVP Questions</h5>
                <span className="text-xs text-gray-500">{fields.length} / {maxFields} fields</span>
            </div>

            <div className="space-y-3">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm relative group">
                        <button
                            onClick={() => removeField(index)}
                            className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-red-200"
                            type="button"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Question Label</label>
                                <input
                                    type="text"
                                    value={field.label}
                                    onChange={(e) => updateField(index, { label: e.target.value })}
                                    placeholder="e.g. Dietary Restrictions"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Field Type</label>
                                <select
                                    value={field.type}
                                    onChange={(e) => updateField(index, { type: e.target.value as any, options: e.target.value === 'dropdown' ? [''] : [] })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="text">Short Text</option>
                                    <option value="dropdown">Dropdown Selection</option>
                                    <option value="checkbox">Checkbox (Yes/No)</option>
                                </select>
                            </div>
                        </div>

                        {field.type === 'dropdown' && (
                            <div className="mt-3 space-y-2">
                                <label className="block text-xs font-medium text-gray-500">Options</label>
                                {field.options?.map((option, optIndex) => (
                                    <div key={optIndex} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOption(index, optIndex, e.target.value)}
                                            placeholder={`Option ${optIndex + 1}`}
                                            className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeOption(index, optIndex)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addOption(index)}
                                    className="text-xs text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Option
                                </button>
                            </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={field.required}
                                    onChange={(e) => updateField(index, { required: e.target.checked })}
                                    className="w-3 h-3 text-blue-600 rounded"
                                />
                                <span className="text-xs text-gray-600 font-medium">Required field</span>
                            </label>

                            {field.type === 'text' && (
                                <div className="w-1/2">
                                    <input
                                        type="text"
                                        value={field.placeholder || ''}
                                        onChange={(e) => updateField(index, { placeholder: e.target.value })}
                                        placeholder="Input placeholder..."
                                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs italic"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {fields.length < maxFields && (
                    <button
                        type="button"
                        onClick={addField}
                        className="w-full py-3 border-2 border-dashed border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H4" />
                        </svg>
                        Add Custom Field
                    </button>
                )}
            </div>
        </div>
    );
};

export default CustomFormBuilder;
