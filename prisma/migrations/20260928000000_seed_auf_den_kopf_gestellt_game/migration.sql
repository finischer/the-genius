INSERT INTO "games" ("id", "name", "slug", "mode", "forPremiumUsers", "isNew", "rules", "active", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'Auf den Kopf gestellt', 'aufDenKopfGestellt', 'TEAM', false, true, '', true, NOW(), NOW());
