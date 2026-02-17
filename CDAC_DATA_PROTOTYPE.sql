CREATE DATABASE KIOSK;  -- CDAC Assignment Prototype Database
USE KIOSK;

-- CLIENT TABLE WHERE WE STORE THE ALL THE DETAILS That is Required for these platform

CREATE TABLE USERS(
User_Id char(36) Primary Key,
Mobile varchar(15) NOT NULL unique,
Name varchar(100) Not Null,
Email varchar(100) not null,
Address Text Not Null,
role ENUM('user', 'admin') DEFAULT 'user', -- Role-based access control
Is_Active boolean Default True, -- These tells weather user is active or deactive , these is other approach instead of deleting the account
Created_At timestamp default current_timestamp -- These tells to analyse when the account is created
);

-- Dummy Data -- To Test Weather it is working or not
INSERT INTO USERS(User_Id, Mobile, Name, Email, Address, role, Is_Active)
VALUES
("550e8400-e29b-41d4-a716-446655440000",
 "9876543210",
 "Bhanu",
 "sairam.murki@gmail.com",
 "Hyderabad",
 1);
 
 
 -- analyze the data by writing the query
 
 SELECT * FROM USERS;
 
 
 -- Now we will create state table where we insert the all the states of india so that based on the state they can choose the respective provider in their state for paying electricty or gas bill service
 
CREATE TABLE STATE_INDIA(
State_Code varchar(5) primary key,
State_NAME varchar(100) not null unique,
Create_at timestamp Default current_timestamp
);

-- Inserting the all the states so that user can select the state dynamically
INSERT INTO STATE_INDIA (state_code, state_name) VALUES
('AP', 'Andhra Pradesh'),
('AR', 'Arunachal Pradesh'),
('AS', 'Assam'),
('BR', 'Bihar'),
('CT', 'Chhattisgarh'),
('GA', 'Goa'),
('GJ', 'Gujarat'),
('HR', 'Haryana'),
('HP', 'Himachal Pradesh'),
('JH', 'Jharkhand'),
('KA', 'Karnataka'),
('KL', 'Kerala'),
('MP', 'Madhya Pradesh'),
('MH', 'Maharashtra'),
('MN', 'Manipur'),
('ML', 'Meghalaya'),
('MZ', 'Mizoram'),
('NL', 'Nagaland'),
('OR', 'Odisha'),
('PB', 'Punjab'),
('RJ', 'Rajasthan'),
('SK', 'Sikkim'),
('TN', 'Tamil Nadu'),
('TG', 'Telangana'),
('TR', 'Tripura'),
('UP', 'Uttar Pradesh'),
('UT', 'Uttarakhand'),
('WB', 'West Bengal');

-- Testing 
SELECT STATE_CODE
FROM STATE_INDIA
ORDER BY STATE_CODE ASC;



-- Provider table is the table where it list all the providers who are providing the different services like electricty or gas in the respective states

CREATE TABLE providers (
    provider_code VARCHAR(30) PRIMARY KEY,
    provider_name VARCHAR(255) NOT NULL,
    state_code VARCHAR(5) NOT NULL,
    utility_type ENUM('electricity','gas') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_code) REFERENCES state_india(state_code)
);


-- Inserting the data for Electricity board providers

INSERT INTO providers (provider_code, provider_name, state_code, utility_type) VALUES

-- Andhra Pradesh
('APSPDCL', 'Southern Power Distribution Company of A.P. Limited', 'AP', 'electricity'),
('APEPDCL', 'Andhra Pradesh Eastern Power Distribution Company Ltd', 'AP', 'electricity'),

-- Telangana
('TSSPDCL', 'Telangana State Southern Power Distribution Company Ltd', 'TG', 'electricity'),
('TSNPDCL', 'Telangana State Northern Power Distribution Company Ltd', 'TG', 'electricity'),

-- Karnataka
('BESCOM', 'Bangalore Electricity Supply Company Limited', 'KA', 'electricity'),
('GESCOM', 'Gulbarga Electricity Supply Company Limited', 'KA', 'electricity'),
('MESCOM', 'Mangalore Electricity Supply Company Limited', 'KA', 'electricity'),
('HESCOM', 'Hubli Electricity Supply Company Limited', 'KA', 'electricity'),
('CESC_KA', 'Chamundeshwari Electricity Supply Corporation Limited', 'KA', 'electricity'),

-- Tamil Nadu
('TANGEDCO', 'Tamil Nadu Generation & Distribution Corporation Limited', 'TN', 'electricity'),

-- Kerala
('KSEB', 'Kerala State Electricity Board Limited', 'KL', 'electricity'),

-- Maharashtra
('MSEDCL', 'Maharashtra State Electricity Distribution Co. Ltd.', 'MH', 'electricity'),
('BEST', 'Brihanmumbai Electric Supply Company', 'MH', 'electricity'),

-- Gujarat
('UGVCL', 'Uttar Gujarat Vij Company Limited', 'GJ', 'electricity'),
('MGVCL', 'Madhya Gujarat Vij Company Limited', 'GJ', 'electricity'),
('PGVCL', 'Paschim Gujarat Vij Company Limited', 'GJ', 'electricity'),
('DGVCL', 'Dakshin Gujarat Vij Company Limited', 'GJ', 'electricity'),

-- Rajasthan
('JVVNL', 'Jaipur Vidyut Vitran Nigam Limited', 'RJ', 'electricity'),
('AVVNL', 'Ajmer Vidyut Vitran Nigam Limited', 'RJ', 'electricity'),
('JDVVNL', 'Jodhpur Vidyut Vitran Nigam Limited', 'RJ', 'electricity'),

-- Uttar Pradesh
('PVVNL', 'Purvanchal Vidyut Vitran Nigam Ltd.', 'UP', 'electricity'),
('MVVNL', 'Madhyanchal Vidyut Vitran Nigam Limited', 'UP', 'electricity'),
('DVVNL', 'Dakshinanchal Vidyut Vitran Nigam Limited', 'UP', 'electricity'),
('PaVVNL', 'Paschimanchal Vidyut Vitran Nigam Limited', 'UP', 'electricity'),

-- Punjab
('PSPCL', 'Punjab State Power Corporation Limited', 'PB', 'electricity'),

-- Haryana
('UHBVN', 'Uttar Haryana Bijli Vitran Nigam', 'HR', 'electricity'),
('DHBVN', 'Dakshin Haryana Bijli Vitran Nigam', 'HR', 'electricity'),

-- West Bengal
('WBSEDCL', 'West Bengal State Electricity Distribution Company Limited', 'WB', 'electricity'),

-- Bihar
('SBPDCL', 'South Bihar Power Distribution Company Limited', 'BR', 'electricity'),
('NBPDCL', 'North Bihar Power Distribution Company Limited', 'BR', 'electricity'),

-- Odisha
('TPCODL', 'TP Central Odisha Distribution Limited', 'OR', 'electricity'),
('TPWODL', 'TP Western Odisha Distribution Limited', 'OR', 'electricity'),
('TPSODL', 'TP Southern Odisha Distribution Limited', 'OR', 'electricity'),
('TPNODL', 'TP Northern Odisha Distribution Limited', 'OR', 'electricity');

INSERT INTO providers (provider_code, provider_name, state_code, utility_type) VALUES

-- Arunachal Pradesh
('AR_EB', 'Arunachal Pradesh Electricity Department', 'AR', 'electricity'),

-- Manipur
('MN_EB', 'Manipur State Power Distribution Company Limited', 'MN', 'electricity'),

-- Meghalaya
('ML_EB', 'Meghalaya Energy Corporation Limited', 'ML', 'electricity'),

-- Mizoram
('MZ_EB', 'Power & Electricity Department Mizoram', 'MZ', 'electricity'),

-- Nagaland
('NL_EB', 'Department of Power Nagaland', 'NL', 'electricity'),

-- Sikkim
('SK_EB', 'Sikkim Power Development Department', 'SK', 'electricity'),

-- Tripura
('TR_EB', 'Tripura State Electricity Corporation Limited', 'TR', 'electricity'),

-- Chhattisgarh
('CT_EB', 'Chhattisgarh State Power Distribution Company Limited', 'CT', 'electricity'),

-- Goa
('GA_EB', 'Electricity Department Goa', 'GA', 'electricity'),

-- Jharkhand
('JH_EB', 'Jharkhand Bijli Vitran Nigam Limited', 'JH', 'electricity'),

-- Himachal Pradesh
('HP_EB', 'Himachal Pradesh State Electricity Board Limited', 'HP', 'electricity'),

-- Madhya Pradesh
('MP_EB', 'Madhya Pradesh Madhya Kshetra Vidyut Vitaran Company Limited', 'MP', 'electricity');

-- UT
INSERT INTO providers (provider_code, provider_name, state_code, utility_type)
VALUES
('UT_EB', 'Uttarakhand Power Corporation Limited', 'UT', 'electricity');

-- Assam
INSERT INTO providers (provider_code, provider_name, state_code, utility_type)
VALUES
('AS_EB', 'Assam Power Distribution Company Limited', 'AS', 'electricity');

-- Testing to make sure weather all the states(28) have the atleast one provider of electricty 
SELECT s.state_code, s.state_name, COUNT(p.provider_code) AS provider_count
FROM state_india s
LEFT JOIN providers p 
    ON s.state_code = p.state_code
GROUP BY s.state_code, s.state_name
ORDER BY s.state_code;

-- Total count of electricty providers are 48 . I have make sure that atleast one provider is there for each state.

SELECT COUNT(*) AS total_electricity_providers
FROM providers
WHERE utility_type = 'electricity';



-- Counting How many states are there in the databse : 28
SELECT COUNT(*) AS total_states
FROM state_india;

-- Inserting GAS PROVIDERS DATA  : Segrigating based on the state wise not distict wise
-- AP
INSERT INTO providers VALUES
('BGL_AP', 'Bhagyanagar Gas Limited', 'AP', 'gas', TRUE, DEFAULT),
('GODAVARI_GAS_AP', 'Godavari Gas Private Limited', 'AP', 'gas', TRUE, DEFAULT),
('MEGHA_AP', 'Megha City Gas Distribution Private Limited', 'AP', 'gas', TRUE, DEFAULT),
('IOCL_AP_GAS', 'Indian Oil Corporation Limited', 'AP', 'gas', TRUE, DEFAULT),
('AGP_AP', 'AGP City Gas Private Limited', 'AP', 'gas', TRUE, DEFAULT);

-- TG
INSERT INTO providers VALUES
('BGL_TG', 'Bhagyanagar Gas Limited', 'TG', 'gas', TRUE, DEFAULT),
('MEGHA_TG', 'Megha City Gas Distribution Private Limited', 'TG', 'gas', TRUE, DEFAULT),
('IOCL_TG_GAS', 'Indian Oil Corporation Limited', 'TG', 'gas', TRUE, DEFAULT),
('TORRENT_TG', 'Torrent Gas Private Limited', 'TG', 'gas', TRUE, DEFAULT),
('MNG_TG', 'Maharashtra Natural Gas Limited', 'TG', 'gas', TRUE, DEFAULT);

-- WB
INSERT INTO providers VALUES
('IOCL_ADANI_WB', 'Indian Oil-Adani Gas Private Limited', 'WB', 'gas', TRUE, DEFAULT),
('HPCL_WB', 'Hindustan Petroleum Corporation Limited', 'WB', 'gas', TRUE, DEFAULT),
('BPCL_WB', 'Bharat Petroleum Corporation Limited', 'WB', 'gas', TRUE, DEFAULT),
('BENGAL_GAS', 'Bengal Gas Company Limited', 'WB', 'gas', TRUE, DEFAULT);


-- BR 
INSERT INTO providers VALUES
('IOCL_BR', 'Indian Oil Corporation Limited', 'BR', 'gas', TRUE, DEFAULT),
('THINK_GAS_BR', 'Think Gas Begusarai Private Limited', 'BR', 'gas', TRUE, DEFAULT),
('BPCL_BR', 'Bharat Petroleum Corporation Limited', 'BR', 'gas', TRUE, DEFAULT),
('GAIL_BR', 'GAIL (India) Limited', 'BR', 'gas', TRUE, DEFAULT);

-- KL
INSERT INTO providers VALUES
('IOCL_ADANI_KL', 'Indian Oil-Adani Gas Private Limited', 'KL', 'gas', TRUE, DEFAULT),
('AGP_KL', 'AGP City Gas Private Limited', 'KL', 'gas', TRUE, DEFAULT),
('SHOLAGASCO', 'Sholagasco Private Limited', 'KL', 'gas', TRUE, DEFAULT);

-- PB
INSERT INTO providers VALUES
('ADANI_PB', 'Adani Total Gas Limited', 'PB', 'gas', TRUE, DEFAULT),
('GUJARAT_GAS_PB', 'Gujarat Gas Limited', 'PB', 'gas', TRUE, DEFAULT),
('BPCL_PB', 'Bharat Petroleum Corporation Limited', 'PB', 'gas', TRUE, DEFAULT),
('IOCL_PB_GAS', 'Indian Oil Corporation Limited', 'PB', 'gas', TRUE, DEFAULT),
('MEGHA_PB', 'Megha City Gas Distribution Private Limited', 'PB', 'gas', TRUE, DEFAULT);

-- UP
INSERT INTO providers VALUES
('GAIL_UP', 'GAIL Gas Limited', 'UP', 'gas', TRUE, DEFAULT),
('IOCL_ADANI_UP', 'Indian Oil-Adani Gas Private Limited', 'UP', 'gas', TRUE, DEFAULT),
('TORRENT_UP', 'Torrent Gas Private Limited', 'UP', 'gas', TRUE, DEFAULT),
('BPCL_UP', 'Bharat Petroleum Corporation Limited', 'UP', 'gas', TRUE, DEFAULT),
('GREEN_GAS_UP', 'Green Gas Limited', 'UP', 'gas', TRUE, DEFAULT),
('IGL_UP', 'Indraprastha Gas Limited', 'UP', 'gas', TRUE, DEFAULT);

-- GJ
INSERT INTO providers VALUES
('GUJARAT_GAS_GJ', 'Gujarat Gas Limited', 'GJ', 'gas', TRUE, DEFAULT),
('ADANI_GAS_GJ', 'Adani Total Gas Limited', 'GJ', 'gas', TRUE, DEFAULT);

-- HR
INSERT INTO providers VALUES
('ADANI_GAS_HR', 'Adani Total Gas Limited', 'HR', 'gas', TRUE, DEFAULT),
('IOCL_ADANI_HR', 'Indian Oil-Adani Gas Private Limited', 'HR', 'gas', TRUE, DEFAULT);

-- HP
INSERT INTO providers VALUES
('HPCL_HP', 'Hindustan Petroleum Corporation Limited', 'HP', 'gas', TRUE, DEFAULT);

-- JH
INSERT INTO providers VALUES
('GAIL_JH', 'GAIL Gas Limited', 'JH', 'gas', TRUE, DEFAULT);

-- KA
INSERT INTO providers VALUES
('GAIL_KA', 'GAIL Gas Limited', 'KA', 'gas', TRUE, DEFAULT),
('IOCL_ADANI_KA', 'Indian Oil-Adani Gas Private Limited', 'KA', 'gas', TRUE, DEFAULT);

-- MP
INSERT INTO providers VALUES
('AVANTIKA_MP', 'Avantika Gas Limited', 'MP', 'gas', TRUE, DEFAULT),
('GAIL_MP', 'GAIL Gas Limited', 'MP', 'gas', TRUE, DEFAULT);

-- MH
INSERT INTO providers VALUES
('MGL_MH', 'Mahanagar Gas Limited', 'MH', 'gas', TRUE, DEFAULT),
('MNGL_MH', 'Maharashtra Natural Gas Limited', 'MH', 'gas', TRUE, DEFAULT);

-- OR
INSERT INTO providers VALUES
('GAIL_OR', 'GAIL Gas Limited', 'OR', 'gas', TRUE, DEFAULT);

-- RJ
INSERT INTO providers VALUES
('TTORRENT_TG', ' Torrent Gas Private Limited', 'RJ', 'gas', TRUE, DEFAULT);

-- TR
INSERT INTO providers VALUES
('TR_GAS', 'Tripura Natural Gas Company Limited', 'TR', 'gas', TRUE, DEFAULT);

-- UT
INSERT INTO providers VALUES
('IOCL_ADANI_UT', 'Indian Oil-Adani Gas Private Limited', 'UT', 'gas', TRUE, DEFAULT);

-- AR
INSERT INTO providers VALUES
('AR_GAS', 'GAIL Gas Limited', 'AR', 'gas', TRUE, DEFAULT);

-- ML
INSERT INTO providers VALUES
('ML_GAS', 'GAIL Gas Limited', 'ML', 'gas', TRUE, DEFAULT);

-- MR
INSERT INTO providers VALUES
('MN_GAS', 'GAIL Gas Limited', 'MN', 'gas', TRUE, DEFAULT);

-- NL
INSERT INTO providers VALUES
('NL_GAS', 'GAIL Gas Limited', 'NL', 'gas', TRUE, DEFAULT);

-- SK
INSERT INTO providers VALUES
('SK_GAS', 'GAIL Gas Limited', 'SK', 'gas', TRUE, DEFAULT);

-- MZ
INSERT INTO providers VALUES
('MZ_GAS', 'GAIL Gas Limited', 'MZ', 'gas', TRUE, DEFAULT);

-- GA
INSERT INTO providers VALUES
('GA_GAS', 'GAIL Gas Limited', 'GA', 'gas', TRUE, DEFAULT);

-- CT
INSERT INTO providers VALUES
('ADANI_GAS_CT', 'Adani Total Gas Limited', 'CT', 'gas', TRUE, DEFAULT);

-- AS
INSERT INTO providers 
(provider_code, provider_name, state_code, utility_type)
VALUES
('GAIL_AS', 'GAIL Gas Limited', 'AS', 'gas'),
('IOCL_AS_GAS', 'Indian Oil Corporation Limited', 'AS', 'gas');

-- TN
INSERT INTO providers 
(provider_code, provider_name, state_code, utility_type)
VALUES
('TORRENT_TN', 'Torrent Gas Private Limited', 'TN', 'gas'),
('IOCL_TN_GAS', 'Indian Oil Corporation Limited', 'TN', 'gas');


-- TESTING

SELECT state_code, COUNT(*) 
FROM providers
WHERE utility_type = 'gas'
GROUP BY state_code
ORDER BY state_code;

SELECT s.state_code,
       COUNT(p.provider_code) AS gas_provider_count
FROM state_india s
LEFT JOIN providers p 
    ON s.state_code = p.state_code 
    AND p.utility_type = 'gas'
GROUP BY s.state_code
ORDER BY s.state_code;

-- Connections table is used for fetching what type of services are 
CREATE TABLE connections (
    connection_id CHAR(36) PRIMARY KEY,
    
    user_id CHAR(36) NOT NULL,
    
    provider_code VARCHAR(30) NOT NULL,
    
    consumer_number VARCHAR(50) NOT NULL UNIQUE,
    
    utility_type ENUM('electricity','gas') NOT NULL,
    
    status ENUM('active','inactive') DEFAULT 'active',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_connection_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_connection_provider
        FOREIGN KEY (provider_code)
        REFERENCES providers(provider_code)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);


-- Bills Table
CREATE TABLE bills (
    bill_id CHAR(36) PRIMARY KEY,

    connection_id CHAR(36) NOT NULL,

    billing_month VARCHAR(20) NOT NULL,  -- Example: '2025-03'
    
    units_consumed DECIMAL(10,2) NOT NULL,
    
    rate_per_unit DECIMAL(10,2) NOT NULL,
    
    fixed_charge DECIMAL(10,2) DEFAULT 0,
    
    total_amount DECIMAL(12,2) NOT NULL,
    
    due_date DATE NOT NULL,
    
    status ENUM('unpaid','paid','overdue') DEFAULT 'unpaid',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bill_connection
        FOREIGN KEY (connection_id)
        REFERENCES connections(connection_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Payments table 
CREATE TABLE payments (
    payment_id CHAR(36) PRIMARY KEY,

    bill_id CHAR(36) NOT NULL,

    razorpay_order_id VARCHAR(100) NOT NULL,
    
    razorpay_payment_id VARCHAR(100),

    amount DECIMAL(12,2) NOT NULL,

    status ENUM('pending','success','failed') DEFAULT 'pending',

    failure_reason VARCHAR(255),

    payment_method VARCHAR(50),

    paid_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_bill
        FOREIGN KEY (bill_id)
        REFERENCES bills(bill_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
	
-- Complaint Category Table
CREATE TABLE complaint_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    utility_type ENUM('electricity','gas') NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Inserting the type of complaints for Electricty
INSERT INTO complaint_categories (utility_type, category_name) VALUES
('electricity', 'Power Failure'),
('electricity', 'Voltage Fluctuation'),
('electricity', 'Meter Not Working'),
('electricity', 'Billing Issue'),
('electricity', 'New Connection Delay');

-- Inserting the type of complaints for GAS
INSERT INTO complaint_categories (utility_type, category_name) VALUES
('gas', 'Gas Leakage'),
('gas', 'Pipeline Damage'),
('gas', 'Billing Issue'),
('gas', 'Low Gas Pressure'),
('gas', 'New Connection Delay');

-- Main Complaint Table where the users can raise the complaints
CREATE TABLE complaints (
    complaint_id CHAR(36) PRIMARY KEY,

    user_id CHAR(36) NOT NULL,

    connection_id CHAR(36) NOT NULL,

    category_id INT NOT NULL,

    description TEXT NOT NULL,

    image_url VARCHAR(255),

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),

    status ENUM('open','in_progress','resolved','rejected') DEFAULT 'open',

    admin_remark TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    FOREIGN KEY (connection_id) REFERENCES connections(connection_id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    FOREIGN KEY (category_id) REFERENCES complaint_categories(category_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- New Connections Request tracking table : When it is approved by the admin then only it goes to connection table
CREATE TABLE connection_requests (
    request_id CHAR(36) PRIMARY KEY,

    user_id CHAR(36) NOT NULL,

    provider_code VARCHAR(30) NOT NULL,

    utility_type ENUM('electricity','gas') NOT NULL,

    address TEXT NOT NULL,

    status ENUM('pending','approved','rejected') DEFAULT 'pending',

    admin_remark TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    FOREIGN KEY (provider_code)
        REFERENCES providers(provider_code)
        ON DELETE RESTRICT ON UPDATE CASCADE
);


-- Admin Table 
-- Admin Table (Final Clean Version)

CREATE TABLE admins (
    admin_id CHAR(36) PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100) NOT NULL UNIQUE,

    mobile VARCHAR(15) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    role ENUM('electricity_admin','gas_admin') NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



SHOW TABLES;