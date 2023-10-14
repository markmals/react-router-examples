-- CreateTable
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "first" TEXT NOT NULL,
    "last" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "twitter" TEXT NOT NULL,
    "notes" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false
);
