INSERT INTO users (email, password_hash, name, role)
VALUES
  ('admin@wiki.local',  '$2a$12$LQDIWpCmPCmJ8bBtMuPMqOqvOXiEMoGb9AcUJgEQSiHhDpnbCb4K2', 'Admin User',  'admin'),
  ('editor@wiki.local', '$2a$12$LQDIWpCmPCmJ8bBtMuPMqOqvOXiEMoGb9AcUJgEQSiHhDpnbCb4K2', 'Editor User', 'editor'),
  ('viewer@wiki.local', '$2a$12$LQDIWpCmPCmJ8bBtMuPMqOqvOXiEMoGb9AcUJgEQSiHhDpnbCb4K2', 'Viewer User', 'viewer')
ON CONFLICT (email) DO NOTHING;
