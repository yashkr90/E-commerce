-- E-Bookstore Database Schema
-- Run this to initialize the PostgreSQL database

CREATE DATABASE ebookstore;

\c ebookstore;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    gift_points INTEGER DEFAULT 0,
    role VARCHAR(20) DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500)
);

-- Brands (Publishers)
CREATE TABLE IF NOT EXISTS brands (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(500)
);

-- Products (Books)
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    estimated_delivery_days INTEGER DEFAULT 5,
    category_id BIGINT NOT NULL REFERENCES categories(id),
    brand_id BIGINT NOT NULL REFERENCES brands(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    full_name VARCHAR(200) NOT NULL,
    street VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE
);

-- Carts
CREATE TABLE IF NOT EXISTS carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id)
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    address_id BIGINT NOT NULL REFERENCES addresses(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    gift_points_used INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING',
    estimated_delivery_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE REFERENCES orders(id),
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Seed Data ────────────────────────────────────────────────────────────────

-- Categories
INSERT INTO categories (name, description, image_url) VALUES
('Fiction', 'Novels, short stories and imaginative writing', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'),
('Non-Fiction', 'Biographies, history, science and self-help', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'),
('Science & Technology', 'Programming, AI, engineering and sciences', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'),
('Business', 'Entrepreneurship, finance and management', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400'),
('Children', 'Books for young readers and children', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400'),
('Self-Help', 'Personal growth and development', 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400')
ON CONFLICT (name) DO NOTHING;

-- Brands / Publishers
INSERT INTO brands (name, logo_url) VALUES
('Penguin Books', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Penguin_logo.svg/200px-Penguin_logo.svg.png'),
('HarperCollins', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/HarperCollins.svg/200px-HarperCollins.svg.png'),
('Oxford Press', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Oxford_University_Press_logo.svg/200px-Oxford_University_Press_logo.svg.png'),
('Scholastic', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Scholastic_Corporation_Logo.svg/200px-Scholastic_Corporation_Logo.svg.png'),
('O''Reilly Media', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/OReilly_logo.svg/200px-OReilly_logo.svg.png'),
('Random House', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Random_House_logo.svg/200px-Random_House_logo.svg.png')
ON CONFLICT (name) DO NOTHING;

-- Products (Books)
INSERT INTO products (title, author, description, price, stock_quantity, image_url, estimated_delivery_days, category_id, brand_id) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.', 12.99, 50, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300', 3, 1, 1),
('To Kill a Mockingbird', 'Harper Lee', 'A novel about racial injustice and moral growth in the American South.', 14.99, 45, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300', 4, 1, 2),
('1984', 'George Orwell', 'A dystopian novel about totalitarianism and surveillance.', 11.99, 60, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300', 3, 1, 1),
('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'A survey of the history of humankind from ancient times to present.', 18.99, 40, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300', 5, 2, 2),
('Clean Code', 'Robert C. Martin', 'A handbook of agile software craftsmanship.', 29.99, 35, 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=300', 4, 3, 5),
('The Lean Startup', 'Eric Ries', 'How today''s entrepreneurs use continuous innovation to create successful businesses.', 16.99, 55, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300', 4, 4, 6),
('Harry Potter and the Philosopher''s Stone', 'J.K. Rowling', 'A young boy discovers he is a wizard on his 11th birthday.', 13.99, 80, 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300', 3, 5, 4),
('Atomic Habits', 'James Clear', 'An easy and proven way to build good habits and break bad ones.', 17.99, 65, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300', 5, 6, 6),
('The Pragmatic Programmer', 'David Thomas', 'Your journey to mastery in software development.', 34.99, 30, 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=300', 5, 3, 5),
('Deep Work', 'Cal Newport', 'Rules for focused success in a distracted world.', 15.99, 50, 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=300', 4, 6, 1),
('Educated', 'Tara Westover', 'A memoir about a young girl growing up in a survivalist family.', 14.99, 42, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300', 4, 2, 2),
('JavaScript: The Good Parts', 'Douglas Crockford', 'Unearthing the excellence in JavaScript.', 24.99, 38, 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=300', 3, 3, 5)
ON CONFLICT DO NOTHING;
