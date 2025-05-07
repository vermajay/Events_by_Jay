import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import { useSelector } from 'react-redux'

const QRCodeScanner = () => {

  const { token } = useSelector((state) => state.auth)

  const [scannerStarted, setScannerStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [attendeeData, setAttendeeData] = useState(null);

  let html5QrCode;

  useEffect(() => {
    // Initialize the scanner instance
    html5QrCode = new Html5Qrcode("reader");

    // Cleanup when component unmounts
    return () => {
      if (html5QrCode && scannerStarted) {
        html5QrCode.stop().catch(error => console.error("Error stopping scanner:", error));
      }
    };
  }, []);

  const startScanner = () => {
    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode("reader");
    }

    setScannerStarted(true);
    setMessage('');
    setAttendeeData(null);

    const qrCodeSuccessCallback = async (decodedText) => {
      await html5QrCode.stop();
      setScannerStarted(false);
      await handleScanSuccess(decodedText);
    };

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start(
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
    if (html5QrCode && scannerStarted) {
      html5QrCode.stop().then(() => {
        setScannerStarted(false);
      }).catch(error => {
        console.error("Error stopping scanner:", error);
      });
    }
  };

  const handleScanSuccess = async (qrToken) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/v1/form-responses/markAttendance', 
        { qrToken },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setMessage('Attendance marked successfully!');
        setMessageType('success');
        setAttendeeData(response.data.data);
      } else {
        setMessage(response.data.message || 'Failed to mark attendance');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setMessage(error.response?.data?.message || 'Failed to mark attendance');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qr-scanner-container">
      <h2>Attendance Scanner</h2>
      
      <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
      
      <div className="scanner-controls" style={{ margin: '20px 0' }}>
        {!scannerStarted ? (
          <button 
            onClick={startScanner} 
            className="scan-button"
            disabled={loading}
          >
            Start Scanner
          </button>
        ) : (
          <button 
            onClick={stopScanner} 
            className="stop-button"
          >
            Stop Scanner
          </button>
        )}
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {loading && (
        <div className="loading">
          Processing QR code...
        </div>
      )}

      {attendeeData && (
        <div className="attendee-info">
          <h3>Attendee Information</h3>
          <p><strong>Email:</strong> {attendeeData.email || 'Not provided'}</p>
          <p><strong>Checked in at:</strong> {new Date(attendeeData.checkedInAt).toLocaleString()}</p>
          <p><strong>Status:</strong> {attendeeData.status}</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;