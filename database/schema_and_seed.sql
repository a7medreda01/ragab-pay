-- ==============================================================================
-- ENTERPRISE DATABASE ARCHITECTURE: AIRBNB & RAGAB PAY OPERATING SYSTEM
-- Full Production Architecture: 32 Normalized Tables across 9 Core Subsystems
-- Dialect: SQL Server (T-SQL) / PostgreSQL Compatible
-- ==============================================================================

-- ==============================================================================
-- SUBSYSTEM 1: IDENTITY, ACCESS CONTROL & KYC VERIFICATION (الأمان وتوثيق الهوية)
-- ==============================================================================

-- 1. Master Users
CREATE TABLE users (
    user_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) UNIQUE NOT NULL,
    phone_number NVARCHAR(25) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    profile_photo_url NVARCHAR(500),
    preferred_language NVARCHAR(10) DEFAULT 'ar', -- 'ar', 'en'
    preferred_currency NVARCHAR(10) DEFAULT 'EGP', -- 'EGP', 'USD', 'SAR'
    is_active BIT DEFAULT 1,
    is_superhost BIT DEFAULT 0,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 2. Extended User Profiles
CREATE TABLE user_profiles (
    profile_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE,
    bio NVARCHAR(MAX),
    date_of_birth DATE,
    address NVARCHAR(250),
    city NVARCHAR(80),
    country NVARCHAR(80),
    emergency_contact_name NVARCHAR(100),
    emergency_contact_phone NVARCHAR(25),
    response_rate_percent DECIMAL(5,2) DEFAULT 100.00,
    response_time_minutes INT DEFAULT 15
);

-- 3. KYC Identity Verification (توثيق الهويات الرسمية للملاك والنزلاء)
CREATE TABLE user_verifications (
    verification_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE,
    document_type NVARCHAR(50) NOT NULL, -- 'NationalID', 'Passport', 'CommercialRegister'
    document_number NVARCHAR(100) NOT NULL,
    document_front_url NVARCHAR(500) NOT NULL,
    document_back_url NVARCHAR(500),
    selfie_photo_url NVARCHAR(500),
    verification_status NVARCHAR(30) DEFAULT 'Pending', -- 'Pending', 'Verified', 'Rejected'
    rejection_reason NVARCHAR(300),
    verified_by_admin_id BIGINT NULL,
    verified_at DATETIMEOFFSET NULL,
    submitted_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 4. User Roles & RBAC (الصلاحيات الإدارية)
CREATE TABLE roles (
    role_id INT IDENTITY(1,1) PRIMARY KEY,
    role_name NVARCHAR(50) UNIQUE NOT NULL, -- 'Guest', 'Host', 'SuperAdmin', 'FinanceManager', 'OperationsAgent'
    description NVARCHAR(200)
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INT NOT NULL FOREIGN KEY REFERENCES roles(role_id) ON DELETE CASCADE,
    assigned_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET(),
    PRIMARY KEY (user_id, role_id)
);

-- 5. Mobile & Web Push Device Tokens (FCM)
CREATE TABLE user_devices (
    device_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE,
    fcm_token NVARCHAR(500) NOT NULL,
    device_platform NVARCHAR(20) NOT NULL, -- 'iOS', 'Android', 'Web'
    app_version NVARCHAR(20),
    last_active_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 6. Security Audit Logs (سجل العمليات الإدارية والرقابة)
CREATE TABLE audit_logs (
    log_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NULL FOREIGN KEY REFERENCES users(user_id),
    action NVARCHAR(100) NOT NULL, -- 'Admin_Approve_Property', 'Commission_Changed', 'Payout_Released'
    entity_name NVARCHAR(50) NOT NULL, -- 'Properties', 'Escrow', 'Users'
    entity_id BIGINT NOT NULL,
    ip_address NVARCHAR(50),
    old_values NVARCHAR(MAX),
    new_values NVARCHAR(MAX),
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- ==============================================================================
-- SUBSYSTEM 2: PROPERTIES & LISTING INVENTORY (العقارات والوحدات وسكن الشركات)
-- ==============================================================================

-- 7. Cancellation Policies
CREATE TABLE cancellation_policies (
    policy_id INT IDENTITY(1,1) PRIMARY KEY,
    policy_name NVARCHAR(50) NOT NULL, -- 'Flexible', 'Moderate', 'Strict', 'SuperStrict'
    full_refund_hours INT NOT NULL, -- e.g., 24, 120 (5 days), 336 (14 days)
    partial_refund_hours INT DEFAULT 0,
    partial_refund_percent INT DEFAULT 0,
    platform_fee_refundable BIT DEFAULT 0,
    policy_description NVARCHAR(400)
);

-- 8. Master Properties Table
CREATE TABLE properties (
    property_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    host_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    property_type NVARCHAR(50) NOT NULL, -- 'Chalet', 'Villa', 'Apartment', 'CorporateStaff'
    room_type NVARCHAR(50) NOT NULL, -- 'EntirePlace', 'PrivateRoom', 'SharedRoom'
    max_guests INT NOT NULL,
    bedrooms_count INT NOT NULL,
    beds_count INT NOT NULL,
    bathrooms_count DECIMAL(3,1) NOT NULL,
    
    -- Pricing Base
    base_price_per_night DECIMAL(10,2) NOT NULL,
    weekend_price_per_night DECIMAL(10,2) NULL,
    cleaning_fee DECIMAL(10,2) DEFAULT 0.00,
    security_deposit DECIMAL(10,2) DEFAULT 0.00,
    
    -- Custom Dynamic Commission Rate per Owner (عمولة متغيرة خاصة بالمالك)
    custom_admin_commission_rate DECIMAL(5,2) DEFAULT 10.00, -- e.g. 12.5% for this specific host
    
    -- Operational parameters
    min_nights INT DEFAULT 1,
    max_nights INT DEFAULT 90,
    check_in_time_start NVARCHAR(10) DEFAULT '15:00',
    check_out_time_end NVARCHAR(10) DEFAULT '11:00',
    is_instant_book_enabled BIT DEFAULT 1,
    cancellation_policy_id INT NOT NULL FOREIGN KEY REFERENCES cancellation_policies(policy_id),
    
    -- Admin Approval Pipeline (مراجعة وقبول الإدارة)
    listing_status NVARCHAR(30) DEFAULT 'UnderReview', -- 'Draft', 'UnderReview', 'Approved', 'Rejected', 'Suspended'
    rejection_feedback NVARCHAR(MAX),
    approved_by_admin_id BIGINT NULL,
    approved_at DATETIMEOFFSET NULL,
    is_published BIT DEFAULT 1,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 9. Property Locations & Geospatial Coordinates
CREATE TABLE property_locations (
    location_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    property_id BIGINT UNIQUE NOT NULL FOREIGN KEY REFERENCES properties(property_id) ON DELETE CASCADE,
    country NVARCHAR(80) DEFAULT N'مصر',
    governorate NVARCHAR(80) NOT NULL, -- 'Matrouh', 'Giza', 'Cairo', 'RedSea'
    city NVARCHAR(80) NOT NULL, -- 'NorthCoast', 'October', 'Zayed', 'NewCairo'
    district NVARCHAR(120) NOT NULL, -- 'Sea View Compound', 'Hacienda Bay', 'Industrial Zone'
    street_address NVARCHAR(300),
    postal_code NVARCHAR(20),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    directions_guide NVARCHAR(MAX)
);

CREATE INDEX idx_prop_location ON property_locations(city, governorate);
CREATE INDEX idx_prop_coordinates ON property_locations(latitude, longitude);

-- 10. Property Room Breakdown (تفصيل الغرف وتوزيع الأسِرة)
CREATE TABLE property_rooms (
    room_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id) ON DELETE CASCADE,
    room_name NVARCHAR(80) NOT NULL, -- 'Master Bedroom', 'Bedroom 2', 'Living Area'
    room_type NVARCHAR(50) NOT NULL, -- 'Master', 'Standard', 'Kids', 'Living'
    king_beds INT DEFAULT 0,
    queen_beds INT DEFAULT 0,
    single_beds INT DEFAULT 0,
    sofa_beds INT DEFAULT 0,
    bunk_beds INT DEFAULT 0,
    has_private_bathroom BIT DEFAULT 0
);

-- 11. Property Photo Gallery
CREATE TABLE property_images (
    image_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id) ON DELETE CASCADE,
    image_url NVARCHAR(600) NOT NULL,
    thumbnail_url NVARCHAR(600),
    caption NVARCHAR(150),
    display_order INT DEFAULT 0,
    is_primary_cover BIT DEFAULT 0,
    uploaded_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 12. Master Amenities Lookup
CREATE TABLE amenities (
    amenity_id INT IDENTITY(1,1) PRIMARY KEY,
    amenity_name NVARCHAR(80) NOT NULL,
    category NVARCHAR(50) NOT NULL, -- 'View', 'Water', 'Comfort', 'Kitchen', 'Safety', 'Corporate'
    icon_class NVARCHAR(60), -- e.g. 'bi-wifi', 'bi-water', 'bi-snow'
    is_highlighted BIT DEFAULT 0
);

-- 13. Property Amenities (Many-to-Many Junction)
CREATE TABLE property_amenities (
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id) ON DELETE CASCADE,
    amenity_id INT NOT NULL FOREIGN KEY REFERENCES amenities(amenity_id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, amenity_id)
);

-- 14. House Rules & Restrictions
CREATE TABLE house_rules (
    rule_id INT IDENTITY(1,1) PRIMARY KEY,
    rule_name NVARCHAR(100) NOT NULL, -- 'No Smoking', 'No Pets', 'No Parties', 'Quiet Hours'
    icon_class NVARCHAR(50)
);

CREATE TABLE property_rules (
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id) ON DELETE CASCADE,
    rule_id INT NOT NULL FOREIGN KEY REFERENCES house_rules(rule_id) ON DELETE CASCADE,
    custom_note NVARCHAR(200),
    PRIMARY KEY (property_id, rule_id)
);

-- ==============================================================================
-- SUBSYSTEM 3: CALENDAR, AVAILABILITY & ANTI-OVERBOOKING (محرك الإتاحة والتقويم)
-- ==============================================================================

-- 15. Listing Daily Calendar Slots (The Day-by-Day Granular Pattern)
CREATE TABLE listing_calendar (
    calendar_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id) ON DELETE CASCADE,
    calendar_date DATE NOT NULL,
    is_available BIT DEFAULT 1, -- 1 = Available, 0 = Blocked/Booked
    status_reason NVARCHAR(40) DEFAULT 'Available', -- 'Available', 'Booked_Platform', 'Host_Personal_Use', 'External_OTA_Hold', 'Under_Maintenance'
    nightly_price DECIMAL(10,2) NOT NULL, -- Overridden daily price
    min_stay_nights INT DEFAULT 1,
    booking_id BIGINT NULL,
    CONSTRAINT UQ_Property_CalendarDate UNIQUE (property_id, calendar_date)
);

CREATE INDEX idx_calendar_lookup ON listing_calendar(property_id, calendar_date, is_available);

-- 16. External Channel Sync (iCal Two-Way Synchronization)
CREATE TABLE channel_connections (
    connection_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id) ON DELETE CASCADE,
    channel_name NVARCHAR(60) NOT NULL, -- 'External_iCal', 'BookingCom', 'AirbnbDirect'
    inbound_ical_url NVARCHAR(600) NOT NULL, -- Link provided by Host to pull external bookings
    outbound_sync_token NVARCHAR(120) UNIQUE NOT NULL, -- Secret URL generated by Ragab Pay for external channels to poll
    sync_frequency_minutes INT DEFAULT 15,
    last_synced_at DATETIMEOFFSET NULL,
    sync_status NVARCHAR(30) DEFAULT 'Active', -- 'Active', 'Syncing', 'Conflict_Warning', 'Error'
    last_error_message NVARCHAR(MAX)
);

-- 17. External Sync Logs & Overbooking Alarm Audit
CREATE TABLE channel_sync_logs (
    sync_log_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    connection_id BIGINT NOT NULL FOREIGN KEY REFERENCES channel_connections(connection_id) ON DELETE CASCADE,
    events_found INT DEFAULT 0,
    events_imported INT DEFAULT 0,
    conflicts_detected INT DEFAULT 0,
    conflict_details NVARCHAR(MAX),
    synced_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 18. Temporary Checkout Holds (Soft-Locks to prevent double checkout races)
CREATE TABLE temporary_reservation_holds (
    hold_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id),
    guest_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    expires_at DATETIMEOFFSET NOT NULL, -- 15 minutes TTL
    is_released BIT DEFAULT 0,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- ==============================================================================
-- SUBSYSTEM 4: DYNAMIC PRICING & SEASONS (التسعير المتدرج والمواسم)
-- ==============================================================================

-- 19. Tiered Stay Length Discounts (خصومات المدد الطويلة)
CREATE TABLE pricing_rules (
    rule_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id) ON DELETE CASCADE,
    rule_type NVARCHAR(40) NOT NULL, -- 'WeeklyDiscount', 'MonthlyDiscount', 'CorporateTier'
    min_nights INT NOT NULL, -- 7 for weekly, 28 for monthly, 30 for corporate
    discount_percentage DECIMAL(5,2) NOT NULL,
    is_active BIT DEFAULT 1,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 20. Seasonal Price Adjustments & Surges
CREATE TABLE seasonal_pricing (
    season_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id) ON DELETE CASCADE,
    season_name NVARCHAR(100) NOT NULL, -- 'Eid Al-Fitr Rush', 'July Beach Peak', 'New Year'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price_multiplier DECIMAL(4,2) DEFAULT 1.25, -- 25% price increase
    fixed_nightly_price DECIMAL(10,2) NULL,
    min_stay_nights INT DEFAULT 3
);

-- ==============================================================================
-- SUBSYSTEM 5: RESERVATIONS & FINANCIAL SNAPSHOTS (الحجوزات والتعامل المالي)
-- ==============================================================================

-- 21. Master Bookings Table
CREATE TABLE bookings (
    booking_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_code NVARCHAR(35) UNIQUE NOT NULL, -- e.g. 'RP-2026-9842'
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id),
    guest_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    host_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights_count INT NOT NULL,
    adults_count INT NOT NULL,
    children_count INT DEFAULT 0,
    
    -- Financial Snapshot (تجميد الأسعار والخصومات لحظة الحجز)
    nightly_base_subtotal DECIMAL(12,2) NOT NULL,
    stay_discount_amount DECIMAL(10,2) DEFAULT 0.00,
    seasonal_adjustment_amount DECIMAL(10,2) DEFAULT 0.00,
    cleaning_fee DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) DEFAULT 0.00,
    guest_service_fee DECIMAL(10,2) NOT NULL,
    host_commission_fee DECIMAL(10,2) NOT NULL, -- Calculated from host's custom rate
    taxes_amount DECIMAL(10,2) DEFAULT 0.00,
    
    total_guest_paid DECIMAL(12,2) NOT NULL,
    net_host_earnings DECIMAL(12,2) NOT NULL,
    
    -- Booking State Machine
    booking_status NVARCHAR(35) NOT NULL, -- 'PendingPayment', 'Confirmed', 'CheckedIn', 'Completed', 'CancelledByGuest', 'CancelledByHost'
    applied_cancellation_policy_id INT NOT NULL FOREIGN KEY REFERENCES cancellation_policies(policy_id),
    special_requests NVARCHAR(MAX),
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

CREATE INDEX idx_bookings_lookup ON bookings(property_id, check_in_date, check_out_date, booking_status);

-- 22. Registered Guests & Security Manifest (بيانات النزلاء لتصاريح البوابات)
CREATE TABLE booking_guests_manifest (
    guest_record_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NOT NULL FOREIGN KEY REFERENCES bookings(booking_id) ON DELETE CASCADE,
    full_name NVARCHAR(100) NOT NULL,
    national_id_or_passport NVARCHAR(80) NOT NULL,
    relation_type NVARCHAR(40) -- 'Primary', 'FamilyMember', 'Employee'
);

-- 23. Booking Status Transition Audit
CREATE TABLE booking_status_history (
    transition_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NOT NULL FOREIGN KEY REFERENCES bookings(booking_id) ON DELETE CASCADE,
    previous_status NVARCHAR(35),
    new_status NVARCHAR(35) NOT NULL,
    changed_by_user_id BIGINT NULL,
    note NVARCHAR(300),
    changed_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- ==============================================================================
-- SUBSYSTEM 6: PAYMENTS, ESCROW & FINANCIAL SETTLEMENT (المدفوعات والـ Escrow والمحافظ)
-- ==============================================================================

-- 24. Electronic Gateway Transactions
CREATE TABLE payment_transactions (
    transaction_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NOT NULL FOREIGN KEY REFERENCES bookings(booking_id),
    payment_gateway NVARCHAR(50) NOT NULL, -- 'Paymob', 'Stripe', 'Fawry', 'ApplePay'
    gateway_reference_id NVARCHAR(150) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency NVARCHAR(10) DEFAULT 'EGP',
    payment_method NVARCHAR(50) NOT NULL, -- 'CreditCard', 'MobileWallet', 'BankTransfer'
    card_last_four NVARCHAR(10),
    payment_status NVARCHAR(30) NOT NULL, -- 'Success', 'Failed', 'Refunded'
    gateway_response_payload NVARCHAR(MAX),
    executed_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 25. Escrow Vault Ledger (الأستاذ المالي وحجز أموال النزلاء حتى 24 ساعة بعد Check-in)
CREATE TABLE escrow_ledger (
    ledger_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT UNIQUE NOT NULL FOREIGN KEY REFERENCES bookings(booking_id),
    guest_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    host_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    
    total_gross_held DECIMAL(12,2) NOT NULL,
    platform_net_revenue DECIMAL(10,2) NOT NULL,
    host_payable_amount DECIMAL(12,2) NOT NULL,
    
    escrow_status NVARCHAR(35) DEFAULT 'HeldInEscrow', 
    -- 'HeldInEscrow', 'ScheduledForPayout', 'PaidOutToHost', 'PartiallyRefunded', 'FullyRefunded', 'Disputed'
    
    payout_release_due_at DATETIMEOFFSET NOT NULL, -- Check-in date + 24 hours
    released_at DATETIMEOFFSET NULL,
    released_by_admin_id BIGINT NULL,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

CREATE INDEX idx_escrow_payout ON escrow_ledger(escrow_status, payout_release_due_at);

-- 26. Host Bank Accounts & Payment Methods
CREATE TABLE host_payout_methods (
    payout_method_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    host_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id) ON DELETE CASCADE,
    method_type NVARCHAR(40) NOT NULL, -- 'BankTransfer', 'InstaPay', 'VodafoneCash'
    bank_name NVARCHAR(100),
    account_holder_name NVARCHAR(120) NOT NULL,
    iban_or_account_number NVARCHAR(60) NOT NULL,
    swift_code NVARCHAR(30),
    wallet_phone_number NVARCHAR(25),
    is_default BIT DEFAULT 1,
    is_verified BIT DEFAULT 1
);

-- 27. Host Payout Transfers (تحويل مستحقات الملاك لحساباتهم البنكية)
CREATE TABLE payout_transfers (
    payout_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    host_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    payout_method_id BIGINT NOT NULL FOREIGN KEY REFERENCES host_payout_methods(payout_method_id),
    amount DECIMAL(12,2) NOT NULL,
    transfer_status NVARCHAR(30) DEFAULT 'Processing', -- 'Processing', 'Completed', 'Failed'
    bank_transaction_reference NVARCHAR(120),
    approved_by_admin_id BIGINT NULL,
    processed_at DATETIMEOFFSET NULL,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 28. Cancellation Refunds & Claims (إدارة الاسترجاع والتعويضات)
CREATE TABLE booking_refunds (
    refund_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NOT NULL FOREIGN KEY REFERENCES bookings(booking_id),
    guest_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    refund_amount DECIMAL(12,2) NOT NULL,
    host_penalty_amount DECIMAL(10,2) DEFAULT 0.00,
    platform_retained_fee DECIMAL(10,2) DEFAULT 0.00,
    refund_status NVARCHAR(30) DEFAULT 'Pending', -- 'Pending', 'Processed', 'Rejected'
    reason NVARCHAR(400),
    processed_at DATETIMEOFFSET NULL,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- ==============================================================================
-- SUBSYSTEM 7: RESORT PASSES & VIP CONCIERGE (تصاريح الدخول والخدمات الإضافية)
-- ==============================================================================

-- 29. Digital Resort Gate Passes (تصاريح بوابات القرى والشواطئ)
CREATE TABLE resort_gate_passes (
    pass_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NOT NULL FOREIGN KEY REFERENCES bookings(booking_id) ON DELETE CASCADE,
    pass_code NVARCHAR(60) UNIQUE NOT NULL, -- e.g. 'PASS-SEA-2026-X9'
    compound_name NVARCHAR(100) NOT NULL,
    qr_hash NVARCHAR(255) NOT NULL,
    valid_from DATETIMEOFFSET NOT NULL,
    valid_to DATETIMEOFFSET NOT NULL,
    authorized_persons_count INT NOT NULL,
    vehicle_plate_number NVARCHAR(30),
    pass_status NVARCHAR(30) DEFAULT 'Active', -- 'Active', 'Used', 'Expired', 'Revoked'
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- 30. VIP Services & Add-on Marketplace
CREATE TABLE vip_services (
    service_id INT IDENTITY(1,1) PRIMARY KEY,
    service_title NVARCHAR(100) NOT NULL, -- 'Private Chef', 'Airport Limousine', 'Yacht Charter', 'Daily Housekeeping'
    service_category NVARCHAR(50) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    price_unit NVARCHAR(30) DEFAULT 'PerRequest' -- 'PerHour', 'PerDay', 'PerRequest'
);

CREATE TABLE booking_vip_orders (
    order_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NOT NULL FOREIGN KEY REFERENCES bookings(booking_id) ON DELETE CASCADE,
    service_id INT NOT NULL FOREIGN KEY REFERENCES vip_services(service_id),
    requested_date DATE NOT NULL,
    quantity INT DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    order_status NVARCHAR(30) DEFAULT 'Confirmed',
    notes NVARCHAR(300)
);

-- ==============================================================================
-- SUBSYSTEM 8: REVIEWS, RATINGS & DISPUTES (التقييمات المتعددة والمنازعات)
-- ==============================================================================

-- 31. Multi-Criteria Reviews & Ratings (تقييمات معايير Airbnb الستة)
CREATE TABLE reviews (
    review_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT UNIQUE NOT NULL FOREIGN KEY REFERENCES bookings(booking_id),
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id),
    guest_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    host_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    
    -- Airbnb 6 Core Criteria (1 to 5)
    cleanliness_rating TINYINT CHECK (cleanliness_rating BETWEEN 1 AND 5),
    accuracy_rating TINYINT CHECK (accuracy_rating BETWEEN 1 AND 5),
    communication_rating TINYINT CHECK (communication_rating BETWEEN 1 AND 5),
    location_rating TINYINT CHECK (location_rating BETWEEN 1 AND 5),
    checkin_rating TINYINT CHECK (checkin_rating BETWEEN 1 AND 5),
    value_rating TINYINT CHECK (value_rating BETWEEN 1 AND 5),
    overall_rating DECIMAL(3,2) NOT NULL,
    
    review_text NVARCHAR(MAX) NOT NULL,
    host_public_response NVARCHAR(MAX),
    is_moderated BIT DEFAULT 1,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- ==============================================================================
-- SUBSYSTEM 9: MESSAGING & REALTIME CHAT (المراسلات الداخلية)
-- ==============================================================================

-- 32. In-App Conversations & Messages
CREATE TABLE conversations (
    conversation_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NULL FOREIGN KEY REFERENCES bookings(booking_id),
    property_id BIGINT NOT NULL FOREIGN KEY REFERENCES properties(property_id),
    guest_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    host_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    last_message_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

CREATE TABLE messages (
    message_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    conversation_id BIGINT NOT NULL FOREIGN KEY REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    message_text NVARCHAR(MAX) NOT NULL,
    attachment_url NVARCHAR(600),
    is_read BIT DEFAULT 0,
    sent_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);


-- ==============================================================================
-- PRODUCTION-GRADE SEED DATA (REALISTIC SAMPLE ROWS FOR ALL KEY TABLES)
-- ==============================================================================

-- 1. Users
SET IDENTITY_INSERT users ON;
INSERT INTO users (user_id, full_name, email, phone_number, password_hash, user_role, is_verified, is_superhost)
VALUES 
(1, N'أحمد محمد الشناوي', 'ahmed.host@ragabpay.com', '+201012345678', '$2a$12$D2y8.hostHash', 'Host', 1, 1),
(2, N'كريم عبد العزيز', 'karim.guest@gmail.com', '+201198765432', '$2a$12$L7p9.guestHash', 'Guest', 1, 0),
(3, N'سارة المهدي', 'sara.host@ragabpay.com', '+201234567890', '$2a$12$P4x2.hostHash', 'Host', 1, 1),
(4, N'المهندس شريف راشد (إدارة)', 'admin@ragabpay.com', '+201000000001', '$2a$12$Z9q1.adminHash', 'SuperAdmin', 1, 0);
SET IDENTITY_INSERT users OFF;

-- 2. Cancellation Policies
SET IDENTITY_INSERT cancellation_policies ON;
INSERT INTO cancellation_policies (policy_id, policy_name, full_refund_hours, partial_refund_hours, partial_refund_percent, policy_description)
VALUES
(1, N'Flexible (مرنة)', 24, 0, 0, N'استرجاع 100% حتى 24 ساعة قبل ميعاد تسجيل الدخول'),
(2, N'Moderate (معتدلة)', 120, 48, 50, N'استرجاع كامل قبل 5 أيام، و50% حتى 48 ساعة قبل الدخول'),
(3, N'Strict (صارمة)', 336, 168, 50, N'استرجاع كامل قبل 14 يوماً، و50% حتى 7 أيام قبل الدخول');
SET IDENTITY_INSERT cancellation_policies OFF;

-- 3. Properties
SET IDENTITY_INSERT properties ON;
INSERT INTO properties (property_id, host_id, title, description, property_type, room_type, max_guests, bedrooms_count, beds_count, bathrooms_count, base_price_per_night, cleaning_fee, custom_admin_commission_rate, cancellation_policy_id, listing_status)
VALUES
(101, 1, N'شاليه ملكي بفيو بانورامي على البحر مباشرة', N'شاليه فاخر صف أول بالساحل الشمالي يضم حمام سباحة خاص وتراس بانورامي', 'Chalet', 'EntirePlace', 6, 3, 4, 2.0, 4000.00, 350.00, 12.50, 1, 'Approved'),
(102, 1, N'فيلا عائلية مستقلة بإنفينيتي بول وحديقة خاصة', N'فيلا مستقلة راقية في هاسيندا باي مع خصوصية كاملة ومكيفات مركزية', 'Villa', 'EntirePlace', 10, 5, 6, 4.0, 9500.00, 600.00, 10.00, 2, 'Approved'),
(103, 3, N'مجمع سكن كوادر وعمالة فنية مجهز بالكامل', N'مجمع فندقي للشركات والمصانع يضم غرف مكيفة مجهزة وخدمات إشرافية', 'CorporateStaff', 'EntirePlace', 24, 6, 24, 5.0, 2800.00, 400.00, 15.00, 3, 'Approved');
SET IDENTITY_INSERT properties OFF;

-- 4. Property Locations
INSERT INTO property_locations (property_id, country, governorate, city, district, street_address, latitude, longitude)
VALUES
(101, N'مصر', N'مطروح', N'الساحل الشمالي', N'قرية Sea View (الكيلو 187)', N'شاليه رقم 12 - منطقة الفلل الشاطئية', 30.91230000, 29.14560000),
(102, N'مصر', N'مطروح', N'الساحل الشمالي', N'هاسيندا باي (الكيلو 124)', N'فيلا 44 - ممر النخيل', 30.89500000, 28.98100000),
(103, N'مصر', N'الجيزة', N'مدينة 6 أكتوبر', N'قرب المنطقة الصناعية ومحور 26 يوليو', N'مبنى رجب للضيافة 2', 29.98210000, 30.93200000);

-- 5. Amenities
SET IDENTITY_INSERT amenities ON;
INSERT INTO amenities (amenity_id, amenity_name, category, icon_class, is_highlighted)
VALUES
(1, N'واي فاي عالي السرعة', 'Comfort', 'bi-wifi', 1),
(2, N'إطلالة بحرية مباشرة', 'View', 'bi-water', 1),
(3, N'حمام سباحة خاص', 'Water', 'bi-water', 1),
(4, N'تكييف مركزي', 'Comfort', 'bi-snow', 1),
(5, N'موقف سيارات مجاني', 'Safety', 'bi-car-front', 1),
(6, N'مطبخ متكامل الأجهزة', 'Kitchen', 'bi-egg-fried', 0);
SET IDENTITY_INSERT amenities OFF;

-- 6. Property Amenities
INSERT INTO property_amenities (property_id, amenity_id)
VALUES (101, 1), (101, 2), (101, 3), (101, 4), (101, 6), (102, 1), (102, 2), (102, 3), (102, 4), (102, 5), (103, 1), (103, 4), (103, 5);

-- 7. Pricing Rules
SET IDENTITY_INSERT pricing_rules ON;
INSERT INTO pricing_rules (rule_id, property_id, rule_type, min_nights, discount_percentage)
VALUES
(1, 101, 'WeeklyDiscount', 7, 10.00),
(2, 101, 'MonthlyDiscount', 28, 22.00),
(3, 103, 'CorporateContract', 30, 30.00);
SET IDENTITY_INSERT pricing_rules OFF;

-- 8. Calendar Slots (Day-by-Day)
SET IDENTITY_INSERT listing_calendar ON;
INSERT INTO listing_calendar (calendar_id, property_id, calendar_date, is_available, status_reason, nightly_price, booking_id)
VALUES
(5001, 101, '2026-12-10', 0, 'Booked_Platform', 4000.00, 8821),
(5002, 101, '2026-12-11', 0, 'Booked_Platform', 4500.00, 8821),
(5003, 101, '2026-12-12', 1, 'Available', 4000.00, NULL),
(5004, 101, '2026-12-13', 0, 'External_OTA_Hold', 4000.00, NULL);
SET IDENTITY_INSERT listing_calendar OFF;

-- 9. Bookings
SET IDENTITY_INSERT bookings ON;
INSERT INTO bookings (booking_id, booking_code, property_id, guest_id, host_id, check_in_date, check_out_date, nights_count, adults_count, nightly_base_subtotal, cleaning_fee, guest_service_fee, host_commission_fee, total_guest_paid, net_host_earnings, booking_status, applied_cancellation_policy_id)
VALUES
(8821, 'RP-2026-8821', 101, 2, 1, '2026-12-10', '2026-12-12', 2, 4, 8500.00, 350.00, 500.00, 1062.50, 9350.00, 7787.50, 'Confirmed', 1);
SET IDENTITY_INSERT bookings OFF;

-- 10. Payment Transactions
INSERT INTO payment_transactions (booking_id, payment_gateway, gateway_reference_id, amount, payment_method, card_last_four, payment_status)
VALUES (8821, 'Paymob', 'PM-TXN-998124', 9350.00, 'CreditCard', '4242', 'Success');

-- 11. Escrow Ledger
SET IDENTITY_INSERT escrow_ledger ON;
INSERT INTO escrow_ledger (ledger_id, booking_id, guest_id, host_id, total_gross_held, platform_net_revenue, host_payable_amount, escrow_status, payout_release_due_at)
VALUES
(901, 8821, 2, 1, 9350.00, 1562.50, 7787.50, 'HeldInEscrow', '2026-12-11 15:00:00 +02:00');
SET IDENTITY_INSERT escrow_ledger OFF;

-- 12. Digital Resort Gate Pass
INSERT INTO resort_gate_passes (booking_id, pass_code, compound_name, qr_hash, valid_from, valid_to, authorized_persons_count)
VALUES (8821, 'PASS-SEA-8821', N'قرية Sea View الساحل', 'hash_sha256_8821_ragabpay_qr', '2026-12-10 14:00:00 +02:00', '2026-12-12 12:00:00 +02:00', 4);

-- 13. Reviews
SET IDENTITY_INSERT reviews ON;
INSERT INTO reviews (review_id, booking_id, property_id, guest_id, host_id, cleanliness_rating, accuracy_rating, communication_rating, location_rating, checkin_rating, value_rating, overall_rating, review_text)
VALUES
(301, 8821, 101, 2, 1, 5, 5, 5, 5, 5, 5, 4.96, N'إقامة استثنائية وإطلالة ساحرة مطابقة تماماً للصور. خدمة ممتازة وسهولة في الدخول.');
SET IDENTITY_INSERT reviews OFF;
