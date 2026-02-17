from flask import Flask, render_template, request, jsonify, redirect, url_for, make_response, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime
import uuid
from werkzeug.middleware.proxy_fix import ProxyFix

load_dotenv()

from services.otp_service import otp_service
from services.database_service import database_service
from services.auth_service import auth_service
from services.email_service import email_service

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)

app.config['SESSION_COOKIE_SECURE'] = os.getenv('COOKIE_SECURE', 'False').lower() == 'true'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = os.getenv('COOKIE_SAMESITE', 'Strict')
app.config['PREFERRED_URL_SCHEME'] = 'https'

cors_origins = os.getenv(
    'CORS_ORIGINS',
    'https://localhost,https://127.0.0.1,http://localhost:5000,http://127.0.0.1:5000'
)
CORS(
    app,
    resources={r"/api/*": {"origins": [o.strip() for o in cors_origins.split(',') if o.strip()]}},
    supports_credentials=True
)

# In-memory notification store. Admin module can write to this later.
NOTIFICATION_STORE = {}
READ_NOTIFICATIONS = {}

def initialize_database():
    try:
        if database_service.connect():
            database_service.create_users_table()
            print("Database initialized successfully")
        else:
            print("Failed to connect to database")
    except Exception as e:
        print("Database initialization error: " + str(e))

initialize_database()

@app.before_request
def enforce_https():
    if os.getenv('REQUIRE_HTTPS', 'False').lower() != 'true':
        return None
    if request.is_secure:
        return None
    host = request.host.split(':')[0].lower()
    if host in {'localhost', '127.0.0.1'}:
        return None
    return redirect(request.url.replace('http://', 'https://', 1), code=301)

@app.after_request
def apply_security_headers(response):
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    response.headers['Content-Security-Policy'] = (
        "default-src 'self' https: data: blob:; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; "
        "style-src 'self' 'unsafe-inline' https:; "
        "img-src 'self' https: data:; "
        "font-src 'self' https: data:; "
        "connect-src 'self' https:;"
    )
    return response

@app.route('/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.get_json()
        mobile = data.get('mobile')
        
        if not mobile or len(mobile) != 10 or not mobile.isdigit():
            return jsonify({'message': 'Invalid mobile number'}), 400
        
        otp = otp_service.generate_otp()
        
        if otp_service.store_otp(mobile, otp):
            user = database_service.get_user_by_mobile(mobile)
            if user and user.get('email'):
                email_service.send_otp_notification(mobile, otp, user['email'])
            
            return jsonify({
                'message': 'OTP sent successfully',
                'success': True
            })
        else:
            return jsonify({'message': 'Failed to generate OTP'}), 500
        
    except Exception as e:
        print("Send OTP Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        mobile = data.get('mobile')
        otp = data.get('otp')
        role = data.get('role', 'user')
        
        if not mobile or not otp:
            return jsonify({'message': 'Mobile and OTP are required'}), 400
        
        is_valid, message = otp_service.validate_otp(mobile, otp)
        
        if not is_valid:
            return jsonify({'message': message}), 400
        
        user = database_service.get_user_by_mobile(mobile)
        
        if user:
            user_data = {
                'user_id': user.get('user_id') or user.get('User_Id'),
                'mobile': user.get('mobile') or user.get('Mobile'),
                'name': user.get('name') or user.get('Name'),
                'email': user.get('email') or user.get('Email'),
                'role': user.get('role') or user.get('role', 'user')
            }
            
            access_token, refresh_token = auth_service.generate_tokens(user_data)
            
            response = make_response(jsonify({
                'message': 'Login successful',
                'redirect': '/dashboard',
                'user': user_data
            }))
            
            auth_service.set_auth_cookies(response, access_token, refresh_token)
            
            return response
        else:
            return jsonify({
                'message': 'User not found. Please complete registration',
                'redirect': f'/signup?mobile={mobile}&role={role}'
            })
        
    except Exception as e:
        print("Verify OTP Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        mobile = data.get('mobile')
        name = data.get('name')
        email = data.get('email')
        address = data.get('address')
        role = data.get('role', 'user')
        
        if not all([mobile, name, email, address]):
            return jsonify({'message': 'All fields are required'}), 400
        
        if database_service.check_mobile_exists(mobile):
            return jsonify({'message': 'Mobile number already registered'}), 400
        
        if database_service.check_email_exists(email):
            return jsonify({'message': 'Email address already registered'}), 400
        
        user_id = database_service.create_user(mobile, name, email, address, role)
        
        if not user_id:
            return jsonify({'message': 'Failed to create user'}), 500
        
        user = database_service.get_user_by_id(user_id)
        
        if user:
            user_data = {
                'user_id': user.get('user_id') or user.get('User_Id'),
                'mobile': user.get('mobile') or user.get('Mobile'),
                'name': user.get('name') or user.get('Name'),
                'email': user.get('email') or user.get('Email'),
                'role': user.get('role') or user.get('role', 'user')
            }
            
            access_token, refresh_token = auth_service.generate_tokens(user_data)
            
            try:
                email_sent = email_service.send_registration_confirmation(user_data)
                if not email_sent:
                    print("Registration email not sent for user " + str(user_data.get('user_id')))
            except Exception as e:
                print("Email sending failed: " + str(e))
            
            response = make_response(jsonify({
                'message': 'Registration successful',
                'redirect': '/dashboard',
                'user': user_data
            }))
            
            auth_service.set_auth_cookies(response, access_token, refresh_token)
            
            return response
        else:
            return jsonify({'message': 'Registration failed'}), 500
        
    except Exception as e:
        print("Registration Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route("/")
@app.route("/home")
def home():
    return render_template("index.html")

@app.route("/login")
def login():
    role = request.args.get('role', 'user')
    return render_template("login.html", role=role)

@app.route("/signup")
def signup():
    role = request.args.get('role', 'user')
    return render_template("signup.html", role=role)

@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('images', filename)


@app.route("/dashboard")
@auth_service.token_required
def dashboard(current_user):
    return render_template("dashboard.html", user=current_user)

@app.route("/electricity")
@app.route("/electricity-bill")
@auth_service.token_required
def electricity_page(current_user):
    return render_template("electricity.html", user=current_user)

@app.route("/payments/electricity")
@auth_service.token_required
def electricity_payments_page(current_user):
    return render_template("electricity_payments.html", user=current_user)

@app.route("/payments")
@auth_service.token_required
def payments_page(current_user):
    return render_template("payments.html", user=current_user)

@app.route("/logout")
def logout():
    response = make_response(redirect(url_for('home')))
    auth_service.clear_auth_cookies(response)
    return response

@app.route("/notifications")
@auth_service.token_required
def notifications_page(current_user):
    return render_template("notifications.html", user=current_user)

@app.route("/api/notifications")
@auth_service.token_required
def get_notifications(current_user):
    try:
        user_id = str(current_user.get('user_id'))
        items = NOTIFICATION_STORE.get(user_id, [])
        read_ids = READ_NOTIFICATIONS.get(user_id, set())

        def parse_created_at(value):
            try:
                dt = datetime.fromisoformat((value or '').replace('Z', '+00:00'))
                return dt.timestamp()
            except Exception:
                return 0

        sorted_items = sorted(items, key=lambda x: parse_created_at(x.get('created_at')), reverse=True)
        response_items = []
        for item in sorted_items:
            item_id = item.get('id')
            response_items.append({
                'id': item_id,
                'title': item.get('title', 'Admin Update'),
                'message': item.get('message', ''),
                'created_at': item.get('created_at'),
                'is_read': item_id in read_ids,
                'source': item.get('source', 'admin'),
                'target_url': '/notifications'
            })

        unread_count = len([item for item in response_items if not item.get('is_read')])
        return jsonify({
            "items": response_items,
            "unread_count": unread_count,
            "source": "admin_feed"
        })
    except Exception as e:
        print("Get Notifications Error: " + str(e))
        return jsonify({"message": "Server error"}), 500

@app.route("/api/notifications/read", methods=["POST"])
@auth_service.token_required
def mark_notifications_read(current_user):
    try:
        data = request.get_json() or {}
        ids = data.get('ids', [])
        if not isinstance(ids, list):
            return jsonify({'message': 'ids must be a list'}), 400

        user_id = str(current_user.get('user_id'))
        read_set = READ_NOTIFICATIONS.setdefault(user_id, set())
        for notif_id in ids:
            if notif_id:
                read_set.add(str(notif_id))

        return jsonify({'success': True})
    except Exception as e:
        print("Mark Notifications Read Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/user/profile')
@auth_service.token_required
def get_user_profile(current_user):
    try:
        user = database_service.get_user_by_id(current_user['user_id'])
        if user:
            user_data = {
                'user_id': user.get('user_id') or user.get('User_Id'),
                'name': user.get('name') or user.get('Name'),
                'email': user.get('email') or user.get('Email'),
                'mobile': user.get('mobile') or user.get('Mobile'),
                'role': user.get('role') or user.get('role', 'user'),
                'created_at': user.get('created_at') or user.get('Created_At')
            }
            return jsonify(user_data)
        else:
            return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        print("Get Profile Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/user/statistics')
@auth_service.admin_required
def get_user_statistics(current_user):
    try:
        stats = database_service.get_user_statistics()
        return jsonify(stats)
    except Exception as e:
        print("Get Statistics Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/electricity/states')
@auth_service.token_required
def get_electricity_states(current_user):
    try:
        states = database_service.get_states()
        return jsonify({'items': states})
    except Exception as e:
        print("Get Electricity States Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/electricity/providers')
@auth_service.token_required
def get_electricity_providers(current_user):
    try:
        state_code = request.args.get('state_code')
        providers = database_service.get_providers_by_utility('electricity', state_code)
        return jsonify({'items': providers})
    except Exception as e:
        print("Get Electricity Providers Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/electricity/connections')
@auth_service.token_required
def get_electricity_connections(current_user):
    try:
        user_id = current_user.get('user_id')
        items = database_service.get_user_connections(user_id, 'electricity')
        return jsonify({'items': items})
    except Exception as e:
        print("Get Electricity Connections Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/electricity/connection-requests', methods=['GET', 'POST'])
@auth_service.token_required
def electricity_connection_requests(current_user):
    try:
        user_id = current_user.get('user_id')

        if request.method == 'GET':
            items = database_service.get_connection_requests(user_id, 'electricity')
            return jsonify({'items': items})

        data = request.get_json() or {}
        provider_code = (data.get('provider_code') or '').strip()
        address = (data.get('address') or '').strip()

        if not provider_code or not address:
            return jsonify({'message': 'Provider and address are required'}), 400

        if len(address) < 10:
            return jsonify({'message': 'Please enter a valid address'}), 400

        if not database_service.provider_exists(provider_code, 'electricity'):
            return jsonify({'message': 'Selected provider is invalid'}), 400

        request_id = database_service.create_connection_request(
            user_id=user_id,
            provider_code=provider_code,
            utility_type='electricity',
            address=address
        )

        if not request_id:
            return jsonify({'message': 'Failed to submit connection request'}), 500

        return jsonify({
            'success': True,
            'message': 'Connection request submitted successfully',
            'request_id': request_id
        })

    except Exception as e:
        print("Electricity Connection Request Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/payments/electricity/due')
@auth_service.token_required
def get_electricity_due_bills(current_user):
    try:
        user_id = current_user.get('user_id')
        items = database_service.get_user_electricity_due_bills(user_id)
        return jsonify({'items': items})
    except Exception as e:
        print("Get Electricity Due Bills Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/payments/electricity/history')
@auth_service.token_required
def get_electricity_payment_history(current_user):
    try:
        user_id = current_user.get('user_id')
        items = database_service.get_user_electricity_payment_history(user_id)
        return jsonify({'items': items})
    except Exception as e:
        print("Get Electricity Payment History Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/payments/electricity/pay', methods=['POST'])
@auth_service.token_required
def pay_electricity_bill(current_user):
    try:
        user_id = current_user.get('user_id')
        data = request.get_json() or {}
        bill_id = (data.get('bill_id') or '').strip()
        payment_method = (data.get('payment_method') or '').strip().lower()

        if not bill_id:
            return jsonify({'message': 'bill_id is required'}), 400

        allowed_methods = {'upi', 'card', 'netbanking'}
        if payment_method not in allowed_methods:
            return jsonify({'message': 'Invalid payment method'}), 400

        bill = database_service.get_user_electricity_bill_by_id(user_id, bill_id)
        if not bill:
            return jsonify({'message': 'Bill not found'}), 404

        bill_status = (bill.get('bill_status') or '').lower()
        if bill_status not in {'unpaid', 'overdue'}:
            return jsonify({'message': 'This bill is already paid or unavailable'}), 400

        amount = float(bill.get('total_amount') or 0)
        if amount <= 0:
            return jsonify({'message': 'Invalid bill amount'}), 400

        payment_id = str(uuid.uuid4())
        order_id = "ORD_" + payment_id[:8].upper()

        created = database_service.create_payment_record(
            payment_id=payment_id,
            bill_id=bill_id,
            order_id=order_id,
            amount=amount,
            status='pending',
            payment_method=payment_method
        )
        if not created:
            return jsonify({'message': 'Failed to initiate payment'}), 500

        # Mock gateway rules for predictable behavior in prototype.
        failure_reason = None
        if payment_method == 'upi' and amount > 5000:
            failure_reason = 'UPI transaction limit exceeded. Try card or netbanking.'
        elif payment_method == 'card' and amount > 25000:
            failure_reason = 'Card declined due to bank daily limit.'
        elif payment_method == 'netbanking' and amount > 50000:
            failure_reason = 'Netbanking transaction blocked by bank risk checks.'

        if failure_reason:
            database_service.mark_payment_failed(payment_id, failure_reason)
            return jsonify({
                'success': False,
                'message': 'Payment failed',
                'failure_reason': failure_reason,
                'payment_id': payment_id
            }), 400

        gateway_payment_id = "PAY_" + payment_id[:10].upper()
        database_service.mark_payment_success(payment_id, gateway_payment_id)
        database_service.mark_bill_paid(bill_id)

        return jsonify({
            'success': True,
            'message': 'Payment successful',
            'payment_id': payment_id,
            'receipt_url': '/api/payments/electricity/receipt/' + payment_id
        })
    except Exception as e:
        print("Pay Electricity Bill Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/payments/electricity/receipt/<payment_id>')
@auth_service.token_required
def download_electricity_receipt(current_user, payment_id):
    try:
        user_id = current_user.get('user_id')
        item = database_service.get_electricity_payment_receipt(user_id, payment_id)

        if not item:
            return jsonify({'message': 'Receipt not found'}), 404

        if (item.get('payment_status') or '').lower() != 'success':
            return jsonify({'message': 'Receipt available only for successful payments'}), 400

        receipt_body = (
            "Unified Civic Portal - Electricity Payment Receipt\n"
            "-----------------------------------------------\n"
            "Receipt ID: " + str(item.get('payment_id')) + "\n"
            "Order ID: " + str(item.get('razorpay_order_id')) + "\n"
            "Transaction ID: " + str(item.get('razorpay_payment_id')) + "\n"
            "Paid On: " + str(item.get('paid_at') or item.get('created_at')) + "\n\n"
            "User: " + str(item.get('user_name')) + "\n"
            "Mobile: " + str(item.get('user_mobile')) + "\n"
            "Email: " + str(item.get('user_email')) + "\n\n"
            "Provider: " + str(item.get('provider_name')) + "\n"
            "Consumer Number: " + str(item.get('consumer_number')) + "\n"
            "Billing Month: " + str(item.get('billing_month')) + "\n"
            "Due Date: " + str(item.get('due_date')) + "\n"
            "Amount Paid: INR " + str(item.get('amount')) + "\n"
            "Payment Method: " + str(item.get('payment_method')) + "\n"
            "Status: SUCCESS\n"
        )

        response = make_response(receipt_body)
        response.headers['Content-Type'] = 'text/plain; charset=utf-8'
        response.headers['Content-Disposition'] = (
            'attachment; filename=electricity_receipt_' + str(payment_id) + '.txt'
        )
        return response
    except Exception as e:
        print("Download Electricity Receipt Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/payments/history')
@auth_service.token_required
def get_all_payment_history(current_user):
    try:
        user_id = current_user.get('user_id')
        items = database_service.get_user_all_payment_history(user_id)
        return jsonify({'items': items})
    except Exception as e:
        print("Get All Payment History Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/payments/receipt/<payment_id>')
@auth_service.token_required
def download_payment_receipt(current_user, payment_id):
    try:
        user_id = current_user.get('user_id')
        item = database_service.get_payment_receipt(user_id, payment_id)

        if not item:
            return jsonify({'message': 'Receipt not found'}), 404

        if (item.get('payment_status') or '').lower() != 'success':
            return jsonify({'message': 'Receipt available only for successful payments'}), 400

        utility_type = str(item.get('utility_type') or '').upper()
        receipt_body = (
            "Unified Civic Portal - Payment Receipt\n"
            "-------------------------------------\n"
            "Receipt ID: " + str(item.get('payment_id')) + "\n"
            "Order ID: " + str(item.get('razorpay_order_id')) + "\n"
            "Transaction ID: " + str(item.get('razorpay_payment_id')) + "\n"
            "Paid On: " + str(item.get('paid_at') or item.get('created_at')) + "\n\n"
            "User: " + str(item.get('user_name')) + "\n"
            "Mobile: " + str(item.get('user_mobile')) + "\n"
            "Email: " + str(item.get('user_email')) + "\n\n"
            "Service: " + utility_type + "\n"
            "Provider: " + str(item.get('provider_name')) + "\n"
            "Consumer Number: " + str(item.get('consumer_number')) + "\n"
            "Billing Month: " + str(item.get('billing_month')) + "\n"
            "Due Date: " + str(item.get('due_date')) + "\n"
            "Amount Paid: INR " + str(item.get('amount')) + "\n"
            "Payment Method: " + str(item.get('payment_method')) + "\n"
            "Status: SUCCESS\n"
        )

        response = make_response(receipt_body)
        response.headers['Content-Type'] = 'text/plain; charset=utf-8'
        response.headers['Content-Disposition'] = (
            'attachment; filename=payment_receipt_' + str(payment_id) + '.txt'
        )
        return response
    except Exception as e:
        print("Download Payment Receipt Error: " + str(e))
        return jsonify({'message': 'Server error'}), 500

if __name__ == "__main__":
    print("Starting Unified Civic Portal...")
    print("Email Service: " + ('Configured' if os.getenv('EMAIL_USER') else 'Not configured'))
    print("Database: " + ('Configured' if os.getenv('DB_PASSWORD') else 'Not configured'))
    
    app.run(debug=True, host='127.0.0.1', port=5000)

