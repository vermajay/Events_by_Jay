import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useSelector } from 'react-redux'
import { markAttendance } from '../services/operations/formResponseApi'
import { FaQrcode, FaUser, FaEnvelope, FaCalendarCheck, FaStop, FaPlay } from 'react-icons/fa'

const QRCodeScanner = () => {

  const { token } = useSelector((state) => state.auth)

  const [scannerStarted, setScannerStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [attendeeData, setAttendeeData] = useState(null);
  
  // Use useRef to persist html5QrCode instance across renders
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    // Initialize the scanner instance when component mounts
    html5QrCodeRef.current = new Html5Qrcode("reader");

    // Cleanup when component unmounts
    return () => {
      if (html5QrCodeRef.current && scannerStarted) {
        html5QrCodeRef.current.stop().catch(error => console.error("Error stopping scanner:", error));
      }
    };
  }, []);

  const startScanner = () => {
    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode("reader");
    }

    setScannerStarted(true);
    setMessage('');
    setAttendeeData(null);

    const qrCodeSuccessCallback = async (decodedText) => {
      // Stop the scanner first
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        setScannerStarted(false);
        // Then process the result
        await handleScanSuccess(decodedText);
      }
    };

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCodeRef.current.start(
      { facingMode: "environment" },
      config,
      qrCodeSuccessCallback,
      (errorMessage) => {
        // Handle scan errors silently
      }
    ).catch((err) => {
      console.error("Error starting scanner:", err);
      setMessage("Failed to start scanner. Please ensure camera permissions are granted.");
      setMessageType("error");
      setScannerStarted(false);
    });
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current && scannerStarted) {
      html5QrCodeRef.current.stop()
        .then(() => {
          setScannerStarted(false);
          setMessage("Scanner stopped.");
          setMessageType("info");
        })
        .catch(error => {
          console.error("Error stopping scanner:", error);
          setMessage("Failed to stop scanner. Please try again.");
          setMessageType("error");
        });
    }
  };

  const handleScanSuccess = async (qrToken) => {
    setLoading(true);
    try {
      const response = await markAttendance(qrToken, token);
      
      if (response) {
        setMessage('Attendance marked successfully!');
        setMessageType('success');
        setAttendeeData(response);
      } else {
        setMessage('Failed to mark attendance');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setMessage('Failed to mark attendance');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Attendance Scanner</h1>
        <p className="text-gray-600">Scan attendee QR codes to mark attendance</p>
      </div>
      
      {/* Scanner */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-center mb-4">
          <FaQrcode className="text-orange-500 text-3xl mr-3" />
          <h2 className="text-xl font-semibold text-gray-800">QR Scanner</h2>
        </div>
        
        <div id="reader" className="mx-auto max-w-sm border border-gray-200 rounded-lg overflow-hidden"></div>
        
        <div className="flex justify-center mt-6">
          {!scannerStarted ? (
            <button 
              onClick={startScanner} 
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
              <FaPlay /> Start Scanner
            </button>
          ) : (
            <button 
              onClick={stopScanner} 
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <FaStop /> Stop Scanner
            </button>
          )}
        </div>
      </div>
      
      {/* Status and Messages */}
      {message && (
        <div className={`p-4 mb-6 rounded-md ${
          messageType === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 
          messageType === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
          'bg-blue-50 border border-blue-200 text-blue-800'
        }`}>
          <p>{message}</p>
        </div>
      )}
      
      {loading && (
        <div className="flex justify-center items-center p-4 mb-6 bg-gray-50 border border-gray-200 text-gray-800 rounded-md">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-3"></div>
          <p>Processing QR code...</p>
        </div>
      )}
      
      {/* Attendee Information */}
      {attendeeData && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <FaUser className="text-orange-500 text-2xl mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Attendee Details</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <FaEnvelope className="text-gray-500 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">Email</h3>
                <p className="text-gray-900">{attendeeData.email || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FaCalendarCheck className="text-gray-500 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">Checked in at</h3>
                <p className="text-gray-900">{formatDateTime(attendeeData.checkedInAt)}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700">Status</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {attendeeData.status.charAt(0).toUpperCase() + attendeeData.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;