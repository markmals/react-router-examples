/*
  Warnings:

  - A unique constraint covering the columns `[mastodon]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contact_mastodon_key" ON "Contact"("mastodon");
