-- ==============================================================================
-- DATABASE ARCHITECTURE: AIRBNB & RAGAB PAY PLATFORM
-- Core Relational Schema (DDL) + Production-grade Sample Data (Seed Rows)
-- Target RDBMS: SQL Server (T-SQL) / PostgreSQL Compatible
-- ==============================================================================

-- 1. USERS TABLE
CREATE TABLE users (
    user_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) UNIQUE NOT NULL,
    phone_number NVARCHAR(25) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    profile_photo_url NVARCHAR(500),
    user_role NVARCHAR(20) DEFAULT 'Guest', -- 'Guest', 'Host', 'SuperAdmin'
    is_verified BIT DEFAULT 0,
    national_id NVARCHAR(100),
    wallet_balance DECIMAL(12,2) DEFAULT 0.00,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 2. CANCELLATION POLICIES TABLE
CREATE TABLE cancellation_policies (
    policy_id INT IDENTITY(1,1) PRIMARY KEY,
    policy_name NVARCHAR(50) NOT NULL, -- 'Flexible', 'Moderate', 'Strict'
    refund_percentage_full INT NOT NULL, -- 100%
    days_before_checkin_full INT NOT NULL, -- e.g. 1 day, 5 days, 14 days
    refund_percentage_partial INT DEFAULT 0, -- 50%
    days_before_checkin_partial INT DEFAULT 0,
    policy_description NVARCHAR(300)
);

-- 3. PROPERTIES TABLE
CREATE TABLE properties (
    property_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    host_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    property_type NVARCHAR(50) NOT NULL, -- 'Chalet', 'Villa', 'CorporateStaff'
    room_type NVARCHAR(50) NOT NULL,
    country NVARCHAR(80) DEFAULT N'مصر',
    city NVARCHAR(80) NOT NULL,
    district NVARCHAR(100) NOT NULL,
    address NVARCHAR(300),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    max_guests INT NOT NULL,
    bedrooms_count INT NOT NULL,
    beds_count INT NOT NULL,
    bathrooms_count DECIMAL(3,1) NOT NULL,
    base_price_per_night DECIMAL(10,2) NOT NULL,
    cleaning_fee DECIMAL(10,2) DEFAULT 0.00,
    service_fee_percent DECIMAL(5,2) DEFAULT 10.00, -- Custom dynamic commission
    min_nights INT DEFAULT 1,
    max_nights INT DEFAULT 90,
    cancellation_policy_id INT FOREIGN KEY REFERENCES cancellation_policies(policy_id),
    listing_status NVARCHAR(30) DEFAULT 'Approved',
    is_active BIT DEFAULT 1,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 4. AMENITIES TABLE
CREATE TABLE amenities (
    amenity_id INT IDENTITY(1,1) PRIMARY KEY,
    amenity_name NVARCHAR(60) NOT NULL,
    icon_class NVARCHAR(50),
    category NVARCHAR(50) -- 'View', 'Comfort', 'Safety', 'Kitchen'
);

-- 5. PROPERTY_AMENITIES (Many-to-Many)
CREATE TABLE property_amenities (
    property_id BIGINT FOREIGN KEY REFERENCES properties(property_id) ON DELETE CASCADE,
    amenity_id INT FOREIGN KEY REFERENCES amenities(amenity_id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, amenity_id)
);

-- 6. PROPERTY_CALENDAR (Day-by-Day Slot Pattern)
CREATE TABLE listing_calendar (
    calendar_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id) ON DELETE CASCADE,
    calendar_date DATE NOT NULL,
    is_available BIT DEFAULT 1,
    status_reason NVARCHAR(30) DEFAULT 'Available', -- 'Available', 'Booked', 'External_iCal_Hold'
    nightly_price DECIMAL(10,2) NOT NULL,
    booking_id BIGINT NULL,
    CONSTRAINT UQ_Property_Date UNIQUE (property_id, calendar_date)
);

-- 7. PRICING_RULES (Tiered discounts)
CREATE TABLE pricing_rules (
    rule_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id) ON DELETE CASCADE,
    rule_type NVARCHAR(30) NOT NULL, -- 'WeeklyDiscount', 'MonthlyDiscount'
    min_nights INT NOT NULL,
    discount_percentage DECIMAL(5,2) NOT NULL,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 8. BOOKINGS TABLE
CREATE TABLE bookings (
    booking_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_code NVARCHAR(30) UNIQUE NOT NULL,
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id),
    guest_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    host_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights_count INT NOT NULL,
    guests_count INT NOT NULL,
    base_subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    cleaning_fee DECIMAL(10,2) NOT NULL,
    service_fee_guest DECIMAL(10,2) NOT NULL,
    commission_host DECIMAL(10,2) NOT NULL,
    total_paid_by_guest DECIMAL(10,2) NOT NULL,
    net_host_earnings DECIMAL(10,2) NOT NULL,
    booking_status NVARCHAR(30) NOT NULL, -- 'Confirmed', 'CheckedIn', 'Completed', 'Cancelled'
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 9. ESCROW_LEDGER (Financial Security & 24h Payout Rule)
CREATE TABLE escrow_ledger (
    ledger_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT UNIQUE NOT NULL FOREIGN KEY REFERENCES bookings(booking_id),
    guest_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    host_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    total_held_amount DECIMAL(10,2) NOT NULL,
    platform_net_revenue DECIMAL(10,2) NOT NULL,
    host_payable_amount DECIMAL(10,2) NOT NULL,
    escrow_status NVARCHAR(30) DEFAULT 'HeldInEscrow', -- 'HeldInEscrow', 'PaidOutToHost', 'Refunded'
    payout_release_due_at DATETIMEOFFSET NOT NULL,
    payout_executed_at DATETIMEOFFSET NULL,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 10. REVIEWS TABLE
CREATE TABLE reviews (
    review_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NOT NULL FOREIGN KEY REFERENCES bookings(booking_id),
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id),
    author_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    rating_accuracy TINYINT CHECK (rating_accuracy BETWEEN 1 AND 5),
    rating_cleanliness TINYINT CHECK (rating_cleanliness BETWEEN 1 AND 5),
    rating_communication TINYINT CHECK (rating_communication BETWEEN 1 AND 5),
    rating_location TINYINT CHECK (rating_location BETWEEN 1 AND 5),
    overall_rating DECIMAL(3,2) NOT NULL,
    review_text NVARCHAR(MAX),
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);


-- ==============================================================================
-- SAMPLE PRODUCTION DATA (SEED ROWS)
-- ==============================================================================

-- 1. Insert Users
SET IDENTITY_INSERT users ON;
INSERT INTO users (user_id, full_name, email, phone_number, password_hash, user_role, is_verified, wallet_balance)
VALUES 
(1, N'أحمد محمد الشناوي', 'ahmed.host@ragabpay.com', '+201012345678', '$2a$12$e8x...hash', 'Host', 1, 14250.00),
(2, N'كريم عبد العزيز', 'karim.guest@gmail.com', '+201198765432', '$2a$12$k4b...hash', 'Guest', 1, 0.00),
(3, N'سارة المهدي', 'sara.host@ragabpay.com', '+201234567890', '$2a$12$s1m...hash', 'Host', 1, 28600.00),
(4, N'إدارة رجب باي المركزية', 'admin@ragabpay.com', '+201000000001', '$2a$12$a99...hash', 'SuperAdmin', 1, 850000.00);
SET IDENTITY_INSERT users OFF;

-- 2. Insert Cancellation Policies
SET IDENTITY_INSERT cancellation_policies ON;
INSERT INTO cancellation_policies (policy_id, policy_name, refund_percentage_full, days_before_checkin_full, refund_percentage_partial, days_before_checkin_partial, policy_description)
VALUES
(1, N'Flexible (مرنة)', 100, 1, 0, 0, N'استرجاع كامل المبلغ حتى 24 ساعة قبل موعد الدخول'),
(2, N'Moderate (معتدلة)', 100, 5, 50, 2, N'استرجاع كامل قبل 5 أيام، و50% حتى 48 ساعة قبل الدخول'),
(3, N'Strict (صارمة)', 100, 14, 50, 7, N'استرجاع كامل قبل 14 يوماً، و50% حتى 7 أيام قبل الدخول');
SET IDENTITY_INSERT cancellation_policies OFF;

-- 3. Insert Properties
SET IDENTITY_INSERT properties ON;
INSERT INTO properties (property_id, host_id, title, description, property_type, room_type, city, district, latitude, longitude, max_guests, bedrooms_count, beds_count, bathrooms_count, base_price_per_night, cleaning_fee, service_fee_percent, cancellation_policy_id)
VALUES
(101, 1, N'شاليه ملكي بفيو بانورامي على البحر مباشرة', N'شاليه فندقي مجهز بالكامل بإطلالة مباشرة على البحر وحمام سباحة خاص', 'Chalet', 'EntirePlace', N'الساحل الشمالي', N'قرية Sea View (الكيلو 187)', 30.91230000, 29.14560000, 6, 3, 4, 2.0, 4000.00, 350.00, 12.50, 1),
(102, 1, N'فيلا عائلية مستقلة بحديقة خاصة وإنفينيتي بول', N'فيلا فاخرة صف أول على البحر مناسبة للعائلات الكبيرة', 'Villa', 'EntirePlace', N'الساحل الشمالي', N'هاسيندا باي', 30.89500000, 28.98100000, 10, 5, 6, 4.0, 9500.00, 600.00, 10.00, 2),
(103, 3, N'مجمع سكن كوادر وعمالة فنية مجهز بالكامل', N'مبنى سكني فندقي متكامل للشركات والمصانع يضم غرف معيشة ومطابخ مركزية', 'CorporateStaff', 'EntirePlace', N'مدينة 6 أكتوبر', N'قرب المنطقة الصناعية والمحور', 29.98210000, 30.93200000, 24, 6, 24, 5.0, 2800.00, 400.00, 15.00, 3);
SET IDENTITY_INSERT properties OFF;

-- 4. Insert Amenities
SET IDENTITY_INSERT amenities ON;
INSERT INTO amenities (amenity_id, amenity_name, icon_class, category)
VALUES
(1, N'واي فاي فائق السرعة', 'bi-wifi', 'Comfort'),
(2, N'إطلالة بحرية مباشرة', 'bi-water', 'View'),
(3, N'حمام سباحة خاص', 'bi-water', 'Comfort'),
(4, N'تكييف مركزي', 'bi-snow', 'Comfort'),
(5, N'موقف سيارات مجاني', 'bi-car-front', 'Safety');
SET IDENTITY_INSERT amenities OFF;

-- 5. Insert Property Amenities
INSERT INTO property_amenities (property_id, amenity_id)
VALUES (101, 1), (101, 2), (101, 3), (101, 4), (102, 1), (102, 2), (102, 3), (102, 5), (103, 1), (103, 4), (103, 5);

-- 6. Insert Pricing Rules (Tiered Discounts)
SET IDENTITY_INSERT pricing_rules ON;
INSERT INTO pricing_rules (rule_id, property_id, rule_type, min_nights, discount_percentage)
VALUES
(1, 101, 'WeeklyDiscount', 7, 10.00),
(2, 101, 'MonthlyDiscount', 28, 22.00),
(3, 103, 'CorporateContract', 30, 30.00);
SET IDENTITY_INSERT pricing_rules OFF;

-- 7. Insert Calendar Availability (Day-by-Day Slots)
SET IDENTITY_INSERT listing_calendar ON;
INSERT INTO listing_calendar (calendar_id, property_id, calendar_date, is_available, nightly_price, status_reason, booking_id)
VALUES
(5001, 101, '2026-12-10', 0, 4000.00, 'Booked_Platform', 8821),
(5002, 101, '2026-12-11', 0, 4500.00, 'Booked_Platform', 8821),
(5003, 101, '2026-12-12', 1, 4000.00, 'Available', NULL),
(5004, 101, '2026-12-13', 0, 4000.00, 'External_iCal_Hold', NULL);
SET IDENTITY_INSERT listing_calendar OFF;

-- 8. Insert Bookings
SET IDENTITY_INSERT bookings ON;
INSERT INTO bookings (booking_id, booking_code, property_id, guest_id, host_id, check_in_date, check_out_date, nights_count, guests_count, base_subtotal, discount_amount, cleaning_fee, service_fee_guest, commission_host, total_paid_by_guest, net_host_earnings, booking_status)
VALUES
(8821, 'RP-2026-8821', 101, 2, 1, '2026-12-10', '2026-12-12', 2, 4, 8500.00, 0.00, 350.00, 500.00, 1062.50, 9350.00, 7787.50, 'Confirmed');
SET IDENTITY_INSERT bookings OFF;

-- 9. Insert Escrow Ledger
SET IDENTITY_INSERT escrow_ledger ON;
INSERT INTO escrow_ledger (ledger_id, booking_id, guest_id, host_id, total_held_amount, platform_net_revenue, host_payable_amount, escrow_status, payout_release_due_at)
VALUES
(901, 8821, 2, 1, 9350.00, 1562.50, 7787.50, 'HeldInEscrow', '2026-12-11 15:00:00 +02:00');
SET IDENTITY_INSERT escrow_ledger OFF;

-- 10. Insert Reviews
SET IDENTITY_INSERT reviews ON;
INSERT INTO reviews (review_id, booking_id, property_id, author_id, rating_accuracy, rating_cleanliness, rating_communication, rating_location, overall_rating, review_text)
VALUES
(301, 8821, 101, 2, 5, 5, 5, 5, 4.96, N'إقامة استثنائية وإطلالة ساحرة مطابقة تماماً للصور. خدمة ممتازة وسهولة في الدخول.');
SET IDENTITY_INSERT reviews OFF;
