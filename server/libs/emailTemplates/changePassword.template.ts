import Config from '../../config.json';
const template = (uniquePasswordResetLink: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${Config.APP_NAME} Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 50px auto;
      background-color: #fff;
      padding: 30px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo {
      width: 150px;
      height: auto;
      margin: 0 auto;
    }
    .content {
      line-height: 1.5;
    }
    .link {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3498db;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="[**path to your logo**]" alt="[Company Name] Logo" class="logo">
    </div>
    <div class="content">
      <p>Dear User,</p>
      <p>We heard you needed a new key to unlock your ${Config.APP_NAME} account. No worries, happens to the best of us! Click the button below to create a strong new password.</p>
      <p><a href="${uniquePasswordResetLink}" class="link">Reset Your Password</a></p>
      <p>This link will expire in 24 hours for your security. If you didn't request a password reset, simply disregard this email.</p>
    </div>
    <div class="footer">
      <p>Happy adventuring,<br>The ${Config.APP_NAME} Team</p>
    </div>
  </div>
</body>
</html>
`;

export default template;
