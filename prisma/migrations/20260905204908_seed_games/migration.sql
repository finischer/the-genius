INSERT INTO "games" ("id", "name", "slug", "mode", "forPremiumUsers", "isNew", "rules", "active", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'Flaggen',       'flaggen',       'DUELL', false, false, '', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Geheimwörter',  'geheimwoerter', 'DUELL', false, false, '', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Merken',        'merken',        'DUELL', false, false, '', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Set',           'set',           'TEAM', false, false, '', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Du Sagst',      'duSagst',       'DUELL', false, false, '', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Zehn Setzen',   'zehnSetzen',    'DUELL', false, false, '', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Fragenhagel',   'fragenhagel',   'DUELL', false, false, '', true, NOW(), NOW());
