/**
 * Migration: Add Fragenhagel game to the games collection.
 *
 * up   — inserts the game document if it doesn't exist yet (idempotent via
 *        updateOne + upsert so re-running is always safe)
 * down — removes the document (rollback)
 */

/** @param {import('mongodb').Db} db */
async function up(db) {
  await db.collection("games").updateOne(
    { slug: "fragenhagel" },
    {
      $setOnInsert: {
        name: "Fragenhagel",
        slug: "fragenhagel",
        mode: "DUELL",
        forPremiumUsers: false,
        isNew: true,
        rules: "",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );
}

/** @param {import('mongodb').Db} db */
async function down(db) {
  await db.collection("games").deleteOne({ slug: "fragenhagel" });
}

module.exports = { up, down };
