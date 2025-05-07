export const newAdminCreationTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
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
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #02BFDB;
                color: #ffffff;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
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

			<div class="message">OTP Verification Email</div>
			<div class="body">
				<p>Dear Admin,</p>
				<p>We are creating an account for you to log in to Clicktalks Events Dashboard. To complete the process, please use the following OTP (One-Time Password) to verify this email:</p>
				<h2 class="highlight">${otp}</h2>
				<p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
				Once your account is verified, you will have access to the platform and its features.</p>
			</div>
			<div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:contact@bloomtideconsulting.com">contact@bloomtideconsulting.com</a>. We are here to help!</div>
		</div>
	</body>
	
	</html>`;
};