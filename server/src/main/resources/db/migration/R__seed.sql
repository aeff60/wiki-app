INSERT INTO users (email, password_hash, name, role)
VALUES
  ('admin@wiki.local',  '$2b$12$QFpdmL54d2mmOuWCzeeM8O3iJ2QEXJp.ka9uqlyOKKCtIOz0dbawy', 'Admin User',  'admin'),
  ('editor@wiki.local', '$2b$12$o0OtRgtdktGYwrLeXulKy./2BzYvUIZh3W4AP2GTvucnGiZ5akVaC', 'Editor User', 'editor'),
  ('viewer@wiki.local', '$2b$12$TSKqgSR6gH3RalcQBtt1NOHFGXZ68L3RJ5QZTlnqdO0x1sfiZPS4.', 'Viewer User', 'viewer')
ON CONFLICT (email) DO NOTHING;
