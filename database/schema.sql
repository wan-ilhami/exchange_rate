-- Create tables
CREATE TABLE IF NOT EXISTS currencies (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rates (
    id SERIAL PRIMARY KEY,
    base_currency_id INT REFERENCES currencies(id) ON DELETE CASCADE,
    target_currency_id INT REFERENCES currencies(id) ON DELETE CASCADE,
    rate DECIMAL(18, 6) NOT NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(base_currency_id, target_currency_id, effective_date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rates_effective_date ON rates(effective_date DESC);
CREATE INDEX IF NOT EXISTS idx_rates_base_currency ON rates(base_currency_id);
CREATE INDEX IF NOT EXISTS idx_rates_target_currency ON rates(target_currency_id);
CREATE INDEX IF NOT EXISTS idx_currencies_code ON currencies(code);

-- Insert base currency (USD) - Method 1: Let SERIAL handle it
INSERT INTO currencies (code, name) VALUES ('USD', 'US Dollar')
ON CONFLICT (code) DO NOTHING;

-- Insert additional currencies
INSERT INTO currencies (code, name) VALUES
('EUR', 'Euro'),
('GBP', 'British Pound'),
('JPY', 'Japanese Yen'),
('AUD', 'Australian Dollar'),
('CAD', 'Canadian Dollar'),
('CHF', 'Swiss Franc'),
('CNY', 'Chinese Yuan'),
('SEK', 'Swedish Krona'),
('NZD', 'New Zealand Dollar'),
('MXN', 'Mexican Peso'),
('SGD', 'Singapore Dollar'),
('HKD', 'Hong Kong Dollar'),
('NOK', 'Norwegian Krone'),
('KRW', 'South Korean Won'),
('TRY', 'Turkish Lira'),
('INR', 'Indian Rupee'),
('BRL', 'Brazilian Real'),
('ZAR', 'South African Rand'),
('RUB', 'Russian Ruble')
ON CONFLICT (code) DO NOTHING;

-- Insert latest rates (current date)
INSERT INTO rates (base_currency_id, target_currency_id, rate, effective_date)
SELECT 
    (SELECT id FROM currencies WHERE code = 'USD'),
    c.id,
    CASE c.code
        WHEN 'EUR' THEN 0.920000
        WHEN 'GBP' THEN 0.790000
        WHEN 'JPY' THEN 149.500000
        WHEN 'AUD' THEN 1.530000
        WHEN 'CAD' THEN 1.390000
        WHEN 'CHF' THEN 0.880000
        WHEN 'CNY' THEN 7.240000
        WHEN 'SEK' THEN 10.890000
        WHEN 'NZD' THEN 1.670000
        WHEN 'MXN' THEN 17.150000
        WHEN 'SGD' THEN 1.340000
        WHEN 'HKD' THEN 7.820000
        WHEN 'NOK' THEN 10.890000
        WHEN 'KRW' THEN 1315.000000
        WHEN 'TRY' THEN 32.450000
        WHEN 'INR' THEN 83.200000
        WHEN 'BRL' THEN 5.020000
        WHEN 'ZAR' THEN 18.750000
        WHEN 'RUB' THEN 92.500000
    END,
    CURRENT_DATE
FROM currencies c
WHERE c.code != 'USD'
ON CONFLICT (base_currency_id, target_currency_id, effective_date) DO NOTHING;

-- Insert historical rates (2023-07-01)
INSERT INTO rates (base_currency_id, target_currency_id, rate, effective_date)
SELECT 
    (SELECT id FROM currencies WHERE code = 'USD'),
    c.id,
    CASE c.code
        WHEN 'EUR' THEN 0.810000
        WHEN 'GBP' THEN 0.680000
        WHEN 'JPY' THEN 109.310000
        WHEN 'AUD' THEN 1.250000
        WHEN 'CAD' THEN 1.180000
        WHEN 'CHF' THEN 0.890000
        WHEN 'CNY' THEN 6.380000
        WHEN 'SEK' THEN 8.520000
        WHEN 'NZD' THEN 1.410000
        WHEN 'MXN' THEN 17.800000
        WHEN 'SGD' THEN 1.320000
        WHEN 'HKD' THEN 7.750000
        WHEN 'NOK' THEN 8.650000
        WHEN 'KRW' THEN 1120.000000
        WHEN 'TRY' THEN 12.800000
        WHEN 'INR' THEN 72.500000
        WHEN 'BRL' THEN 4.980000
        WHEN 'ZAR' THEN 14.900000
        WHEN 'RUB' THEN 73.200000
    END,
    '2023-07-01'
FROM currencies c
WHERE c.code != 'USD'
ON CONFLICT (base_currency_id, target_currency_id, effective_date) DO NOTHING;

-- Insert historical rates (2023-06-01)
INSERT INTO rates (base_currency_id, target_currency_id, rate, effective_date)
SELECT 
    (SELECT id FROM currencies WHERE code = 'USD'),
    c.id,
    CASE c.code
        WHEN 'EUR' THEN 0.795000
        WHEN 'GBP' THEN 0.665000
        WHEN 'JPY' THEN 108.500000
        WHEN 'AUD' THEN 1.220000
        WHEN 'CAD' THEN 1.160000
        WHEN 'CHF' THEN 0.870000
        WHEN 'CNY' THEN 6.320000
        WHEN 'SEK' THEN 8.350000
        WHEN 'NZD' THEN 1.380000
        WHEN 'MXN' THEN 17.200000
        WHEN 'SGD' THEN 1.290000
        WHEN 'HKD' THEN 7.720000
        WHEN 'NOK' THEN 8.450000
        WHEN 'KRW' THEN 1095.000000
        WHEN 'TRY' THEN 12.300000
        WHEN 'INR' THEN 71.200000
        WHEN 'BRL' THEN 4.750000
        WHEN 'ZAR' THEN 14.300000
        WHEN 'RUB' THEN 71.800000
    END,
    '2023-06-01'
FROM currencies c
WHERE c.code != 'USD'
ON CONFLICT (base_currency_id, target_currency_id, effective_date) DO NOTHING;