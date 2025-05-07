export const eventRegistrationEmail = (eventTitle, eventDescription, eventLocation, startDate, endDate, qrCode) => {
	return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Event Registration Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #4a90e2;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
                text-align: left;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
            
            .event-details {
                background-color: #f5f5f5;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                text-align: left;
            }
            
            .qr-code {
                margin: 20px 0;
            }
            
            .qr-code img {
                max-width: 200px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            
            .event-date {
                color: #4a90e2;
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <!-- <a href="https://software.clicktalks.co"><img class="logo" src="https://software.clicktalks.co/assets/clicktalks_logo-BLNn_xkh.png" alt="Clicktalks Logo"></a> -->

            <div class="message">Registration Confirmed!</div>
            <div class="body">
                <p>Thank you for registering for <span class="highlight">${eventTitle}</span>!</p>
                
                <div class="event-details">
                    <p><strong>Event:</strong> ${eventTitle}</p>
                    <p><strong>Description:</strong> ${eventDescription}</p>
                    <p><strong>Location:</strong> ${eventLocation}</p>
                    <p><strong>Starts:</strong> <span class="event-date">${new Date(startDate).toLocaleString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</span></p>
                    <p><strong>Ends:</strong> <span class="event-date">${new Date(endDate).toLocaleString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</span></p>
                </div>
                
                <p>Please use the QR code below to check in at the event:</p>
                
                <div class="qr-code">
                    <img src="${qrCode}" alt="Event Check-in QR Code">
                </div>
                
                <p>We look forward to seeing you at the event!</p>
            </div>
        </div>
    </body>
    
    </html>`;
}; 