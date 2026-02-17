"""
Database Service - Microservice for database operations
Handles MySQL connection, user management, and data operations
"""

import mysql.connector
from mysql.connector import Error
from typing import Optional, Dict, List, Tuple
import uuid
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class DatabaseService:
    """Database Service Class - Microservice approach for database operations"""
    
    def __init__(self):
        self.config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'user': os.getenv('DB_USER', 'root'),
            'password': os.getenv('DB_PASSWORD', 'Bhanu@22061'),
            'database': os.getenv('DB_NAME', 'KIOSK'),
            'autocommit': True
        }

    def _get_connection(self):
        """Create a fresh DB connection for each operation."""
        return mysql.connector.connect(**self.config)

    def connect(self) -> bool:
        """
        Establish database connection

        Returns:
            bool: True if connection successful
        """
        try:
            conn = self._get_connection()
            if conn.is_connected():
                print("Database Service: Connected to MySQL database")
                conn.close()
                return True
        except Error as e:
            print("Database Service Error connecting to MySQL: " + str(e))
            return False
        return False

    def disconnect(self) -> None:
        """Close database connection"""
        # Connections are opened and closed per query.
        return None

    def execute_query(self, query: str, params: Optional[Tuple] = None) -> bool:
        """
        Execute a query (INSERT, UPDATE, DELETE)

        Args:
            query (str): SQL query
            params (Optional[Tuple]): Query parameters

        Returns:
            bool: True if execution successful
        """
        cursor = None
        conn = None
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            cursor.execute(query, params)
            return True
        except Error as e:
            print("Database Service Error executing query: " + str(e))
            return False
        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()

    def fetch_one(self, query: str, params: Optional[Tuple] = None) -> Optional[Dict]:
        """
        Fetch one record from database

        Args:
            query (str): SQL query
            params (Optional[Tuple]): Query parameters

        Returns:
            Optional[Dict]: Record data or None
        """
        cursor = None
        conn = None
        try:
            conn = self._get_connection()
            cursor = conn.cursor(dictionary=True, buffered=True)
            cursor.execute(query, params)
            result = cursor.fetchone()
            return result
        except Error as e:
            print("Database Service Error fetching one record: " + str(e))
            return None
        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()

    def fetch_all(self, query: str, params: Optional[Tuple] = None) -> List[Dict]:
        """
        Fetch all records from database

        Args:
            query (str): SQL query
            params (Optional[Tuple]): Query parameters

        Returns:
            List[Dict]: List of records
        """
        cursor = None
        conn = None
        try:
            conn = self._get_connection()
            cursor = conn.cursor(dictionary=True, buffered=True)
            cursor.execute(query, params)
            result = cursor.fetchall()
            return result or []
        except Error as e:
            print("Database Service Error fetching all records: " + str(e))
            return []
        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()

    def create_users_table(self) -> bool:
        """
        Create users table if not exists (with role support)
        
        Returns:
            bool: True if table created successfully
        """
        query = """
        CREATE TABLE IF NOT EXISTS users (
            user_id CHAR(36) PRIMARY KEY,
            mobile VARCHAR(15) NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            address TEXT NOT NULL,
            role ENUM('user', 'admin') DEFAULT 'user',
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_mobile (mobile),
            INDEX idx_email (email),
            INDEX idx_role (role)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        result = self.execute_query(query)
        
        # Check if role column exists, add it if it doesn't
        if result:
            self.add_role_column_if_not_exists()
        
        return result
    
    def add_role_column_if_not_exists(self) -> bool:
        """
        Add role column to existing users table if it doesn't exist

        Returns:
            bool: True if column added or already exists
        """
        try:
            # Check if role column exists
            check_query = """
            SELECT COUNT(*) as count
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = 'KIOSK'
            AND TABLE_NAME = 'users'
            AND COLUMN_NAME = 'role'
            """

            result = self.fetch_one(check_query)

            if result and result.get('count', 0) == 0:
                alter_query = """
                ALTER TABLE users
                ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user'
                """
                self.execute_query(alter_query)
                print("Database Service: Added role column to users table")
            else:
                print("Database Service: Role column already exists")

            return True

        except Exception as e:
            print("Database Service Error adding role column: " + str(e))
            return False

    def create_user(self, mobile: str, name: str, email: str, address: str, role: str = 'user') -> Optional[str]:
        """
        Create a new user with role support
        
        Args:
            mobile (str): Mobile number
            name (str): User name
            email (str): User email
            address (str): User address
            role (str): User role (default: 'user')
            
        Returns:
            Optional[str]: User ID if created successfully, None otherwise
        """
        try:
            user_id = str(uuid.uuid4())
            query = """
            INSERT INTO users (user_id, mobile, name, email, address, role)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            params = (user_id, mobile, name.strip(), email.strip().lower(), address.strip(), role)
            
            if self.execute_query(query, params):
                print("✅ Database Service: User created with ID " + str(user_id))
                return user_id
            else:
                print("❌ Database Service: Failed to create user")
                return None
                
        except Error as e:
            print("❌ Database Service Error creating user: " + str(e))
            return None
    
    def get_user_by_mobile(self, mobile: str) -> Optional[Dict]:
        """
        Get user by mobile number
        
        Args:
            mobile (str): Mobile number
            
        Returns:
            Optional[Dict]: User data or None
        """
        query = "SELECT * FROM users WHERE mobile = %s AND is_active = TRUE"
        return self.fetch_one(query, (mobile,))
    
    def get_user_by_email(self, email: str) -> Optional[Dict]:
        """
        Get user by email address
        
        Args:
            email (str): Email address
            
        Returns:
            Optional[Dict]: User data or None
        """
        query = "SELECT * FROM users WHERE email = %s AND is_active = TRUE"
        return self.fetch_one(query, (email.strip().lower(),))
    
    def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """
        Get user by user ID
        
        Args:
            user_id (str): User ID
            
        Returns:
            Optional[Dict]: User data or None
        """
        query = "SELECT * FROM users WHERE user_id = %s AND is_active = TRUE"
        return self.fetch_one(query, (user_id,))
    
    def update_user(self, user_id: str, data: Dict) -> bool:
        """
        Update user information
        
        Args:
            user_id (str): User ID
            data (Dict): Data to update
            
        Returns:
            bool: True if update successful
        """
        try:
            set_clause = ", ".join([str(key) + " = %s" for key in data.keys()])
            query = "UPDATE users SET " + set_clause + " WHERE user_id = %s"
            params = tuple(data.values()) + (user_id,)
            
            return self.execute_query(query, params)
        except Error as e:
            print("❌ Database Service Error updating user: " + str(e))
            return False
    
    def deactivate_user(self, user_id: str) -> bool:
        """
        Deactivate user account
        
        Args:
            user_id (str): User ID
            
        Returns:
            bool: True if deactivation successful
        """
        return self.update_user(user_id, {'is_active': False})
    
    def verify_user_email(self, user_id: str) -> bool:
        """
        Mark user email as verified
        
        Args:
            user_id (str): User ID
            
        Returns:
            bool: True if verification successful
        """
        return self.update_user(user_id, {'email_verified': True})
    
    def check_mobile_exists(self, mobile: str) -> bool:
        """
        Check if mobile number already exists
        
        Args:
            mobile (str): Mobile number
            
        Returns:
            bool: True if mobile exists
        """
        query = "SELECT COUNT(*) as count FROM users WHERE mobile = %s"
        result = self.fetch_one(query, (mobile,))
        return result['count'] > 0 if result else False
    
    def check_email_exists(self, email: str) -> bool:
        """
        Check if email address already exists
        
        Args:
            email (str): Email address
            
        Returns:
            bool: True if email exists
        """
        query = "SELECT COUNT(*) as count FROM users WHERE email = %s"
        result = self.fetch_one(query, (email.strip().lower(),))
        return result['count'] > 0 if result else False
    
    def get_user_statistics(self) -> Dict:
        """
        Get user statistics (simplified for your table schema)
        
        Returns:
            Dict: User statistics
        """
        stats = {}
        
        # Total users
        query = "SELECT COUNT(*) as total FROM users WHERE is_active = TRUE"
        result = self.fetch_one(query)
        stats['total_users'] = result['total'] if result else 0
        
        # Active users (same as total since we only have is_active)
        stats['active_users'] = stats['total_users']
        
        return stats

    def get_states(self) -> List[Dict]:
        """
        Get all states from state_india table

        Returns:
            List[Dict]: State list
        """
        query = """
        SELECT state_code, state_name
        FROM state_india
        ORDER BY state_name ASC
        """
        return self.fetch_all(query)

    def get_providers_by_utility(self, utility_type: str, state_code: Optional[str] = None) -> List[Dict]:
        """
        Get providers by utility type with optional state filter

        Args:
            utility_type (str): Utility type (electricity/gas)
            state_code (Optional[str]): State code filter

        Returns:
            List[Dict]: Provider list
        """
        if state_code:
            query = """
            SELECT provider_code, provider_name, state_code, utility_type
            FROM providers
            WHERE utility_type = %s AND state_code = %s AND is_active = TRUE
            ORDER BY provider_name ASC
            """
            return self.fetch_all(query, (utility_type, state_code))

        query = """
        SELECT provider_code, provider_name, state_code, utility_type
        FROM providers
        WHERE utility_type = %s AND is_active = TRUE
        ORDER BY provider_name ASC
        """
        return self.fetch_all(query, (utility_type,))

    def provider_exists(self, provider_code: str, utility_type: Optional[str] = None) -> bool:
        """
        Check if provider exists and is active

        Args:
            provider_code (str): Provider code
            utility_type (Optional[str]): Utility type filter

        Returns:
            bool: True if provider exists
        """
        if utility_type:
            query = """
            SELECT COUNT(*) AS count
            FROM providers
            WHERE provider_code = %s AND utility_type = %s AND is_active = TRUE
            """
            result = self.fetch_one(query, (provider_code, utility_type))
        else:
            query = """
            SELECT COUNT(*) AS count
            FROM providers
            WHERE provider_code = %s AND is_active = TRUE
            """
            result = self.fetch_one(query, (provider_code,))

        return result['count'] > 0 if result else False

    def get_user_connections(self, user_id: str, utility_type: Optional[str] = None) -> List[Dict]:
        """
        Get user connections with provider metadata

        Args:
            user_id (str): User ID
            utility_type (Optional[str]): Utility type filter

        Returns:
            List[Dict]: Connection list
        """
        if utility_type:
            query = """
            SELECT
                c.connection_id,
                c.consumer_number,
                c.utility_type,
                c.status,
                c.created_at,
                p.provider_code,
                p.provider_name,
                p.state_code
            FROM connections c
            JOIN providers p ON p.provider_code = c.provider_code
            WHERE c.user_id = %s AND c.utility_type = %s
            ORDER BY c.created_at DESC
            """
            return self.fetch_all(query, (user_id, utility_type))

        query = """
        SELECT
            c.connection_id,
            c.consumer_number,
            c.utility_type,
            c.status,
            c.created_at,
            p.provider_code,
            p.provider_name,
            p.state_code
        FROM connections c
        JOIN providers p ON p.provider_code = c.provider_code
        WHERE c.user_id = %s
        ORDER BY c.created_at DESC
        """
        return self.fetch_all(query, (user_id,))

    def get_connection_requests(self, user_id: str, utility_type: Optional[str] = None) -> List[Dict]:
        """
        Get connection requests for a user

        Args:
            user_id (str): User ID
            utility_type (Optional[str]): Utility type filter

        Returns:
            List[Dict]: Connection request list
        """
        if utility_type:
            query = """
            SELECT
                cr.request_id,
                cr.provider_code,
                cr.utility_type,
                cr.address,
                cr.status,
                cr.admin_remark,
                cr.created_at,
                cr.updated_at,
                p.provider_name,
                p.state_code
            FROM connection_requests cr
            JOIN providers p ON p.provider_code = cr.provider_code
            WHERE cr.user_id = %s AND cr.utility_type = %s
            ORDER BY cr.created_at DESC
            """
            return self.fetch_all(query, (user_id, utility_type))

        query = """
        SELECT
            cr.request_id,
            cr.provider_code,
            cr.utility_type,
            cr.address,
            cr.status,
            cr.admin_remark,
            cr.created_at,
            cr.updated_at,
            p.provider_name,
            p.state_code
        FROM connection_requests cr
        JOIN providers p ON p.provider_code = cr.provider_code
        WHERE cr.user_id = %s
        ORDER BY cr.created_at DESC
        """
        return self.fetch_all(query, (user_id,))

    def create_connection_request(
        self,
        user_id: str,
        provider_code: str,
        utility_type: str,
        address: str
    ) -> Optional[str]:
        """
        Create new connection request

        Args:
            user_id (str): User ID
            provider_code (str): Provider code
            utility_type (str): Utility type
            address (str): Service address

        Returns:
            Optional[str]: Request ID
        """
        request_id = str(uuid.uuid4())
        query = """
        INSERT INTO connection_requests (
            request_id, user_id, provider_code, utility_type, address, status
        )
        VALUES (%s, %s, %s, %s, %s, 'pending')
        """
        params = (request_id, user_id, provider_code, utility_type, address.strip())

        if self.execute_query(query, params):
            return request_id
        return None

    def get_user_electricity_due_bills(self, user_id: str) -> List[Dict]:
        """
        Get unpaid/overdue electricity bills for a user.
        """
        query = """
        SELECT
            b.bill_id,
            b.connection_id,
            b.billing_month,
            b.total_amount,
            b.due_date,
            b.status AS bill_status,
            p.provider_name,
            c.consumer_number
        FROM bills b
        JOIN connections c ON c.connection_id = b.connection_id
        JOIN providers p ON p.provider_code = c.provider_code
        WHERE c.user_id = %s
          AND c.utility_type = 'electricity'
          AND b.status IN ('unpaid', 'overdue')
        ORDER BY b.due_date ASC, b.created_at DESC
        """
        return self.fetch_all(query, (user_id,))

    def get_user_electricity_payment_history(self, user_id: str) -> List[Dict]:
        """
        Get all electricity payment attempts for a user.
        """
        query = """
        SELECT
            pm.payment_id,
            pm.bill_id,
            pm.razorpay_order_id,
            pm.razorpay_payment_id,
            pm.amount,
            pm.status AS payment_status,
            pm.failure_reason,
            pm.payment_method,
            pm.paid_at,
            pm.created_at,
            b.billing_month,
            b.due_date,
            p.provider_name,
            c.consumer_number
        FROM payments pm
        JOIN bills b ON b.bill_id = pm.bill_id
        JOIN connections c ON c.connection_id = b.connection_id
        JOIN providers p ON p.provider_code = c.provider_code
        WHERE c.user_id = %s
          AND c.utility_type = 'electricity'
        ORDER BY COALESCE(pm.paid_at, pm.created_at) DESC
        """
        return self.fetch_all(query, (user_id,))

    def get_user_electricity_bill_by_id(self, user_id: str, bill_id: str) -> Optional[Dict]:
        """
        Get a specific electricity bill by user ownership.
        """
        query = """
        SELECT
            b.bill_id,
            b.total_amount,
            b.status AS bill_status,
            b.billing_month,
            b.due_date,
            p.provider_name,
            c.consumer_number
        FROM bills b
        JOIN connections c ON c.connection_id = b.connection_id
        JOIN providers p ON p.provider_code = c.provider_code
        WHERE c.user_id = %s
          AND c.utility_type = 'electricity'
          AND b.bill_id = %s
        LIMIT 1
        """
        return self.fetch_one(query, (user_id, bill_id))

    def create_payment_record(
        self,
        payment_id: str,
        bill_id: str,
        order_id: str,
        amount: float,
        status: str = 'pending',
        payment_method: Optional[str] = None,
        failure_reason: Optional[str] = None
    ) -> bool:
        """
        Insert a payment record.
        """
        query = """
        INSERT INTO payments (
            payment_id,
            bill_id,
            razorpay_order_id,
            amount,
            status,
            failure_reason,
            payment_method
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        params = (
            payment_id,
            bill_id,
            order_id,
            amount,
            status,
            failure_reason,
            payment_method
        )
        return self.execute_query(query, params)

    def mark_payment_success(self, payment_id: str, razorpay_payment_id: str) -> bool:
        """
        Mark payment as success and store paid timestamp.
        """
        query = """
        UPDATE payments
        SET status = 'success',
            razorpay_payment_id = %s,
            failure_reason = NULL,
            paid_at = CURRENT_TIMESTAMP
        WHERE payment_id = %s
        """
        return self.execute_query(query, (razorpay_payment_id, payment_id))

    def mark_payment_failed(self, payment_id: str, reason: str) -> bool:
        """
        Mark payment as failed with reason.
        """
        query = """
        UPDATE payments
        SET status = 'failed',
            failure_reason = %s
        WHERE payment_id = %s
        """
        return self.execute_query(query, (reason, payment_id))

    def mark_bill_paid(self, bill_id: str) -> bool:
        """
        Mark bill status as paid.
        """
        query = """
        UPDATE bills
        SET status = 'paid'
        WHERE bill_id = %s
        """
        return self.execute_query(query, (bill_id,))

    def get_electricity_payment_receipt(self, user_id: str, payment_id: str) -> Optional[Dict]:
        """
        Get receipt data for a successful electricity payment.
        """
        query = """
        SELECT
            pm.payment_id,
            pm.razorpay_order_id,
            pm.razorpay_payment_id,
            pm.amount,
            pm.payment_method,
            pm.status AS payment_status,
            pm.failure_reason,
            pm.paid_at,
            pm.created_at,
            b.bill_id,
            b.billing_month,
            b.due_date,
            p.provider_name,
            c.consumer_number,
            u.name AS user_name,
            u.mobile AS user_mobile,
            u.email AS user_email
        FROM payments pm
        JOIN bills b ON b.bill_id = pm.bill_id
        JOIN connections c ON c.connection_id = b.connection_id
        JOIN providers p ON p.provider_code = c.provider_code
        JOIN users u ON u.user_id = c.user_id
        WHERE c.user_id = %s
          AND c.utility_type = 'electricity'
          AND pm.payment_id = %s
        LIMIT 1
        """
        return self.fetch_one(query, (user_id, payment_id))

    def get_user_all_payment_history(self, user_id: str) -> List[Dict]:
        """
        Get all utility payments (electricity + gas) for a user.
        """
        query = """
        SELECT
            pm.payment_id,
            pm.bill_id,
            pm.razorpay_order_id,
            pm.razorpay_payment_id,
            pm.amount,
            pm.status AS payment_status,
            pm.failure_reason,
            pm.payment_method,
            pm.paid_at,
            pm.created_at,
            b.billing_month,
            b.due_date,
            c.utility_type,
            p.provider_name,
            c.consumer_number
        FROM payments pm
        JOIN bills b ON b.bill_id = pm.bill_id
        JOIN connections c ON c.connection_id = b.connection_id
        JOIN providers p ON p.provider_code = c.provider_code
        WHERE c.user_id = %s
        ORDER BY COALESCE(pm.paid_at, pm.created_at) DESC
        """
        return self.fetch_all(query, (user_id,))

    def get_payment_receipt(self, user_id: str, payment_id: str) -> Optional[Dict]:
        """
        Get receipt data for any successful utility payment.
        """
        query = """
        SELECT
            pm.payment_id,
            pm.razorpay_order_id,
            pm.razorpay_payment_id,
            pm.amount,
            pm.payment_method,
            pm.status AS payment_status,
            pm.failure_reason,
            pm.paid_at,
            pm.created_at,
            b.bill_id,
            b.billing_month,
            b.due_date,
            c.utility_type,
            p.provider_name,
            c.consumer_number,
            u.name AS user_name,
            u.mobile AS user_mobile,
            u.email AS user_email
        FROM payments pm
        JOIN bills b ON b.bill_id = pm.bill_id
        JOIN connections c ON c.connection_id = b.connection_id
        JOIN providers p ON p.provider_code = c.provider_code
        JOIN users u ON u.user_id = c.user_id
        WHERE c.user_id = %s
          AND pm.payment_id = %s
        LIMIT 1
        """
        return self.fetch_one(query, (user_id, payment_id))

# Singleton instance for application-wide use
database_service = DatabaseService()
