-- ===================================================
-- SEBELAS DECOR DASHBOARD — SUPABASE SCHEMA MIGRATION
-- Jalankan query ini di SQL Editor Dashboard Supabase Anda
-- ===================================================

-- 1. Buat ENUM untuk event_type dan status
CREATE TYPE event_type_enum AS ENUM ('Wedding', 'Engagement', 'Birthday', 'Other');
CREATE TYPE lead_status_enum AS ENUM ('Inquiry', 'Follow-up', 'Booked', 'DP Paid', 'Completed', 'Cancelled');

-- 2. Buat tabel leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  phone TEXT,
  event_date DATE,
  location TEXT,
  event_type event_type_enum,
  package TEXT,
  theme TEXT,
  status lead_status_enum DEFAULT 'Inquiry',
  notes TEXT,
  source TEXT DEFAULT 'chatbot',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Buat tabel activity_logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details TEXT,
  performed_by TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 5. Buat Policy agar admin authenticated bisa baca/tulis
CREATE POLICY "Allow authenticated admin full access to leads"
  ON leads FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated admin full access to activity_logs"
  ON activity_logs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Policy khusus Service Role / Anon (untuk Chatbot API kirim lead)
CREATE POLICY "Allow anon insert leads from chatbot"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- 7. Trigger untuk otomatis update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- ===================================================
-- SEED DATA (Dummy data untuk pengujian awal)
-- ===================================================

INSERT INTO leads (customer_name, phone, event_date, location, event_type, package, theme, status, notes) VALUES
('Rina & Budi', '628123456789', '2026-10-15', 'Gedung Kartika, Jakarta', 'Wedding', 'Paket Indoor VIP', 'Modern Elegant', 'DP Paid', 'DP 50% sudah diterima, request bunga mawar putih'),
('Siti & Agus', '628987654321', '2026-09-20', 'Halaman Rumah, Bandung', 'Engagement', 'Paket Akad Nikah', 'Rustic Minimalist', 'Booked', 'Menunggu pelunasan H-3'),
('Maya & Dimas', '628112233445', '2026-11-05', 'Taman Bunga, Bogor', 'Wedding', 'Paket Outdoor Garden', 'Boho Chic', 'Follow-up', 'Klien masih minta revisi warna backdrop'),
('Dewi & Fajar', '628556677889', '2026-08-28', 'Masjid Al-Azhar, Bekasi', 'Engagement', 'Paket Indoor Basic', 'Traditional Jawa', 'Inquiry', 'Inquiry masuk via chatbot'),
('Nina & Rizky', '628778899001', '2026-07-12', 'Hotel Santika, Depok', 'Wedding', 'Paket Outdoor Beach', 'Glamour Gold', 'Completed', 'Acara selesai dengan sukses, klien sangat puas');
