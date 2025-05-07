export const resetPasswordLinkEmail = (email, name, url) => {
	return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Reset your password</title>
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
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">

            <!-- <a href="https://software.clicktalks.co"><img class="logo" src="https://software.clicktalks.co/assets/clicktalks_logo-BLNn_xkh.png" alt="Clicktalks Logo"></a> -->

            <div class="message">Password Reset Confirmation</div>
            <div class="body">
                <p>Hey ${name},</p>
                <p>Your have requested to reset the password for the email <span class="highlight">${email}</span>.</p>
                <p>Here is the password reset link: <a href=${url}>Reset Password</a></p>
                <p>This link is valid for <span class="highlight">5 minutes</span>.</p>
                <p>If you did not request this password change, please contact us immediately to secure your account.</p>
            </div>
            <div class="support">If you have any questions or need further assistance, please feel free to reach out to us
                at
                <a href="mailto:contact@bloomtideconsulting.com">contact@bloomtideconsulting.com</a>. We are here to help!
            </div>
        </div>
    </body>
    
    </html>`;
};