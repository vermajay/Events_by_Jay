// FormSubmission.jsx - Main form submission component

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FormSubmission = () => {
  const { eventId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  // Fetch form for the event
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/v1/forms/${eventId}`);
        if (response.data.success) {
          setForm(response.data.form);
          
          // Initialize form data with empty values
          const initialData = {};
          response.data.form.fields.forEach(field => {
            initialData[field.name] = '';
          });
          setFormData(initialData);
        }
      } catch (err) {
        setError('Failed to load registration form. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchForm();
  }, [eventId]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:4000/api/v1/form-responses/${eventId}`, 
        formData
      );
      
      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Render form field based on type
  const renderField = (field) => {
    const baseInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            className={baseInputClasses}
          />
        );
      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            className={`${baseInputClasses} resize-y min-h-[100px]`}
            rows={4}
          />
        );
      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            className={baseInputClasses}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            className={baseInputClasses}
          />
        );
    }
  };
  
  // Show loading state
  if (loading && !form) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registration form...</p>
        </div>
      </div>
    );
  }
  
  // Show error
  if (error && !form) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  // Show success message after submission
  if (submitted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Submitted!</h2>
          <p className="text-gray-600 mb-2">Thank you for registering. Your submission is being reviewed.</p>
          <p className="text-gray-600">You will receive an email notification once your registration is approved.</p>
        </div>
      </div>
    );
  }
  
  // Show form
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Register for Event</h2>
        {form && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <div key={field.name} className="space-y-1">
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label} {field.required && <span className="text-red-600">*</span>}
                  </label>
                  {field.description && (
                    <div className="text-xs text-gray-500 mb-1">{field.description}</div>
                  )}
                  {renderField(field)}
                </div>
              ))}
            
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FormSubmission;