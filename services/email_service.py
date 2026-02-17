import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict
import os
import ssl
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv('EMAIL_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('EMAIL_PORT', 587))
        self.email_user = (os.getenv('EMAIL_USER') or '').strip()
        # Gmail app passwords are often copied with spaces; normalize before login.
        self.email_password = (os.getenv('EMAIL_PASSWORD') or '').replace(' ', '').strip()
        self.use_tls = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
        self.use_ssl = os.getenv('EMAIL_USE_SSL', 'False').lower() == 'true'
        self.smtp_timeout = int(os.getenv('EMAIL_TIMEOUT', '20'))
        self.portal_name = "Unified Civic Portal"
        
    def create_connection(self) -> Optional[smtplib.SMTP]:
        try:
            if self.use_ssl:
                server = smtplib.SMTP_SSL(
                    self.smtp_server,
                    self.smtp_port,
                    context=ssl.create_default_context(),
                    timeout=self.smtp_timeout
                )
            else:
                server = smtplib.SMTP(self.smtp_server, self.smtp_port, timeout=self.smtp_timeout)
                if self.use_tls:
                    server.ehlo()
                    server.starttls(context=ssl.create_default_context())
                    server.ehlo()

            server.login(self.email_user, self.email_password)

            print(
                "Email Service: Connected to SMTP server with user: " +
                self.email_user +
                " using " + ("SSL" if self.use_ssl else ("TLS" if self.use_tls else "Plain SMTP"))
            )
            return server
            
        except Exception as e:
            print("Email Service Error connecting to SMTP: " + str(e))
            return None
    
    def send_email(self, to_email: str, subject: str, html_body: str, 
                   text_body: Optional[str] = None) -> bool:
        try:
            if not self.email_user or not self.email_password:
                print("Email Service Error: EMAIL_USER or EMAIL_PASSWORD is missing")
                return False

            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.portal_name + " <" + self.email_user + ">"
            message["To"] = to_email
            
            if text_body:
                text_part = MIMEText(text_body, "plain")
                message.attach(text_part)
            
            html_part = MIMEText(html_body, "html")
            message.attach(html_part)
            
            server = self.create_connection()
            if not server:
                return False
            
            try:
                server.send_message(message)
                print("Email Service: Email sent successfully to " + to_email + " with subject: " + subject)
                return True
            finally:
                server.quit()
                
        except Exception as e:
            print("Email Service Error sending email: " + str(e))
            return False
    
    def create_registration_template(self, user_data: Dict) -> str:
        user_name = user_data.get('name', 'Citizen')
        user_id = user_data.get('user_id', '')
        user_mobile = user_data.get('mobile', '')
        user_email = user_data.get('email', '')
        template = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Registration Confirmation - {portal_name}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background: #f3f7fb;
            margin: 0;
            padding: 20px 0;
            color: #1f2937;
        }}
        .container {{
            max-width: 680px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
        }}
        .header {{
            background: linear-gradient(130deg, #0f766e, #2563eb);
            color: #ffffff;
            padding: 20px 24px;
            text-align: center;
        }}
        .brand {{
            font-size: 26px;
            font-weight: bold;
            margin: 10px 0 4px;
        }}
        .logos {{
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
        }}
        .logos img {{
            width: 52px;
            height: 52px;
            object-fit: contain;
            background: rgba(255,255,255,0.92);
            border-radius: 12px;
            padding: 6px;
        }}
        .content {{
            padding: 24px;
        }}
        .title {{
            margin: 0 0 10px;
            color: #0f172a;
        }}
        .success {{
            background: #ecfdf3;
            border: 1px solid #86efac;
            color: #166534;
            border-radius: 10px;
            padding: 12px;
            font-weight: 600;
            margin: 12px 0 18px;
        }}
        .details {{
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px;
            background: #f8fafc;
        }}
        .details p {{
            margin: 8px 0;
        }}
        .footer {{
            text-align: center;
            padding: 18px 24px 22px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #475569;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logos">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="National Emblem">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRZx6770pMaVJqRX70ZyFUro3loHhmOc3jkw&s" alt="C-DAC Logo">
            </div>
            <div class="brand">{portal_name}</div>
            <div>Registration Confirmation</div>
        </div>
        <div class="content">
            <h2 class="title">Congratulations, {user_name}!</h2>
            <div class="success">
                Your account has been successfully created and updated.
                You can now enjoy all Unified Civic Portal services.
            </div>
            <p>Welcome to {portal_name}. Your registration details are below:</p>
            <div class="details">
                <p><strong>User ID:</strong> {user_id}</p>
                <p><strong>Mobile:</strong> {user_mobile}</p>
                <p><strong>Email:</strong> {user_email}</p>
            </div>
            <p style="margin-top:16px;">
                Login with your mobile number and access electricity, gas, complaints and payment services.
            </p>
        </div>
        <div class="footer">
            <p>Developed by Centre for Development of Advanced Computing (C-DAC)</p>
            <p>Ministry of Electronics & Information Technology</p>
            <p>Government of India</p>
        </div>
    </div>
</body>
</html>
        """
        return template.format(
            portal_name=self.portal_name,
            user_name=user_name,
            user_id=user_id,
            user_mobile=user_mobile,
            user_email=user_email
        )
    
    def send_registration_confirmation(self, user_data: Dict) -> bool:
        subject = "Congratulations! Registration Successful - " + self.portal_name
        html_body = self.create_registration_template(user_data)
        
        text_body = (
            "Congratulations, " + user_data.get('name', 'Citizen') + "!\n\n"
            "Your account has been successfully created on " + self.portal_name + ".\n"
            "You can now enjoy electricity, gas, complaint and payment services.\n\n"
            "User ID: " + user_data.get('user_id', '') + "\n"
            "Mobile: " + user_data.get('mobile', '') + "\n"
            "Email: " + user_data.get('email', '') + "\n\n"
            "Developed by Centre for Development of Advanced Computing (C-DAC)\n"
            "Ministry of Electronics & Information Technology\n"
            "Government of India\n"
        )
        
        return self.send_email(user_data['email'], subject, html_body, text_body)
    
    def send_otp_notification(self, mobile: str, otp: str, email: Optional[str] = None) -> bool:
        if not email:
            return True
        
        subject = "OTP Verification - " + self.portal_name
        
        html_body = f"""<!DOCTYPE html>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>OTP Verification - """ + self.portal_name + """</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }}
        .container {{
            max-width: 500px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .otp-code {{
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h2>OTP Verification</h2>
        <p>Your One-Time Password for mobile number """ + mobile + """ is: <strong>""" + otp + """</strong></p>
        
        <div class="otp-code">
            """ + otp + """
        </div>
        
        <p style="text-align: center; color: #666;">
            This OTP is valid for 3 minutes only.<br>
            Do not share this OTP with anyone.
        </p>
    </div>
</body>
</html>
        """
        
        text_body = """
OTP Verification - """ + self.portal_name + """

Your One-Time Password for mobile number """ + mobile + """ is: """ + otp + """

This OTP is valid for 3 minutes only.
Do not share this OTP with anyone.

Developed by Centre for Development of Advanced Computing (C-DAC)
Ministry of Electronics & Information Technology
Government of India
        """
        
        return self.send_email(email, subject, html_body, text_body)

email_service = EmailService()

