-- Create test_control table for admin to manage competition state
CREATE TABLE IF NOT EXISTS test_control (
  id INTEGER PRIMARY KEY DEFAULT 1,
  aptitude_active BOOLEAN DEFAULT FALSE,
  technical_active BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial row (competition not started)
INSERT INTO test_control (id, aptitude_active, technical_active)
VALUES (1, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Grant permissions
GRANT ALL ON test_control TO authenticated;
GRANT ALL ON test_control TO anon;
