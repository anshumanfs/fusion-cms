import Config from '../../config.json';
const template = (uniqueAccountActivationLink: string, firstName: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${Config.APP_NAME} Account Activation</title>
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
      <img src="${Config.DEPLOYMENT_URL}${Config.LOGO_URL.light}" alt="${Config.APP_NAME} Logo" class="logo">
    </div>
    <div class="content">
      <p>Hi ${firstName},</p>
      <p>Welcome to ${Config.APP_NAME}! We're thrilled to have you join our adventure. To start exploring, click the button below to activate your account.</p>
      <br/><br/>
      <p><a href="${uniqueAccountActivationLink}" class="link">Activate Your Account</a></p>
      <br/><br/>
      <p>This link will expire in 24 hours for your security. If you didn't create an account with ${Config.APP_NAME}, please disregard this email.</p>
    </div>
    <div class="footer">
      <p>Happy adventuring,<br>The ${Config.APP_NAME} Team</p>
    </div>
  </div>
</body>
</html>`;

export default template;
