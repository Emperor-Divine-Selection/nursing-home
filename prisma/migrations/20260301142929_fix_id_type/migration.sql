-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CareRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'normal',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "elderId" TEXT NOT NULL,
    "caregiverId" TEXT NOT NULL,
    CONSTRAINT "CareRecord_elderId_fkey" FOREIGN KEY ("elderId") REFERENCES "Elder" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CareRecord_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CareRecord" ("caregiverId", "content", "createdAt", "elderId", "id", "type") SELECT "caregiverId", "content", "createdAt", "elderId", "id", "type" FROM "CareRecord";
DROP TABLE "CareRecord";
ALTER TABLE "new_CareRecord" RENAME TO "CareRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
