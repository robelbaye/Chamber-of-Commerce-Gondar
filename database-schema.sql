-- Complete Database Schema for Member Portal Application
-- Use this schema to recreate the database on any platform

-- Create registrations table
CREATE TABLE registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    business_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    sector TEXT,
    membership_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    username TEXT UNIQUE,
    password_hash TEXT,
    receipt_url TEXT
);

-- Create admin_users table
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- Create news table
CREATE TABLE news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    published BOOLEAN DEFAULT true,
    author TEXT DEFAULT 'Admin'
);

-- Create events table
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    image_url TEXT,
    published BOOLEAN DEFAULT true
);

-- Create gallery table
CREATE TABLE gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'general'
);

-- Create member_messages table
CREATE TABLE member_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    member_id UUID REFERENCES registrations(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied'))
);

-- Create services table
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2),
    category TEXT DEFAULT 'general',
    active BOOLEAN DEFAULT true,
    image_url TEXT
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (adjust as needed for production)
CREATE POLICY "Allow all operations" ON registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON admin_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON member_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON services FOR ALL USING (true) WITH CHECK (true);

-- Insert sample admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, name, email) 
VALUES ('admin', 'admin123', 'System Administrator', 'admin@example.com');

-- Create storage buckets (Supabase specific)
-- For other platforms, create equivalent file storage solutions
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);