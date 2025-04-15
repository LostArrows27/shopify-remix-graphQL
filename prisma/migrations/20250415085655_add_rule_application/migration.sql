/*
  Warnings:

  - You are about to drop the column `applicationData` on the `PricingRule` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "RuleApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pricingRuleId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RuleApplication_pricingRuleId_fkey" FOREIGN KEY ("pricingRuleId") REFERENCES "PricingRule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PricingRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "applicationType" TEXT NOT NULL,
    "customPriceType" TEXT NOT NULL,
    "customPriceValue" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PricingRule" ("applicationType", "createdAt", "customPriceType", "customPriceValue", "id", "name", "priority", "shop", "status", "updatedAt") SELECT "applicationType", "createdAt", "customPriceType", "customPriceValue", "id", "name", "priority", "shop", "status", "updatedAt" FROM "PricingRule";
DROP TABLE "PricingRule";
ALTER TABLE "new_PricingRule" RENAME TO "PricingRule";
CREATE INDEX "PricingRule_shop_status_priority_idx" ON "PricingRule"("shop", "status", "priority");
CREATE UNIQUE INDEX "PricingRule_shop_name_key" ON "PricingRule"("shop", "name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "RuleApplication_entityType_entityId_idx" ON "RuleApplication"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "RuleApplication_pricingRuleId_idx" ON "RuleApplication"("pricingRuleId");

-- CreateIndex
CREATE UNIQUE INDEX "RuleApplication_pricingRuleId_entityType_entityId_key" ON "RuleApplication"("pricingRuleId", "entityType", "entityId");
