import Config from '../../../config.json';

const template = (otp: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${Config.APP_NAME} - OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f2f2f2;
    }
    .container {
      padding: 20px;
      max-width: 600px;
      width: 100%;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #ddd;
    }
    .logo {
      width: 150px;
      height: auto;
      margin: 0 auto;
    }
    .content {
      padding: 20px;
    }
    .otp-code {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin: 10px 0;
    }
    .otp-container {
      display: flex;
      justify-content: center; /* Center horizontally */
      align-items: center; /* Center vertically */
    }
    .otp-box {
      width: 40px;
      height: 40px;
      border: 1px solid #ccc;
      border-radius: 5px;
      text-align: center;
      font-size: 20px;
      margin: 0 5px;
    }
    .p {
      line-height: 1.5;
    }
    .footer {
      text-align: center;
      padding: 10px 0;
      color: #aaa;
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <img src="https://beta.getfusioncms.com/" alt="${Config.APP_NAME} Logo" class="logo">
    </header>
    <div class.content>
      <p class="p">Hi there,</p>
      <p class="p">We've sent you a one-time code (OTP) to verify your identity for your <b>${Config.APP_NAME}</b> application.</p>
      <div class="otp-code">
        <div class="otp-container">
          <span class="otp-box">${otp[0]}</span>
          <span class="otp-box">${otp[1]}</span>
          <span class="otp-box">${otp[2]}</span>
          <span class="otp-box">${otp[3]}</span>
          <span class="otp-box">${otp[4]}</span>
          <span class="otp-box">${otp[5]}</span>
        </div>
      </div>
      <p class="p">This code is valid for 5 minutes. Please enter it in the designated field to complete your action.</p>
      <p class="p">If you didn't request this code, please ignore this email.</p>
    </div>
    <footer class="footer">
      <p>Thank you,</p>
      <p>The ${Config.APP_NAME} Team</p>
    </footer>
  </div>
</body>
</html>`;

export default template;
