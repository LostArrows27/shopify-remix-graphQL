-- CreateTable
CREATE TABLE "PricingRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "applicationType" TEXT NOT NULL,
    "applicationData" TEXT NOT NULL,
    "customPriceType" TEXT NOT NULL,
    "customPriceValue" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ShopifyTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "PricingRule_shop_status_priority_idx" ON "PricingRule"("shop", "status", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "PricingRule_shop_name_key" ON "PricingRule"("shop", "name");

-- CreateIndex
CREATE INDEX "ShopifyTag_shop_idx" ON "ShopifyTag"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "ShopifyTag_shop_name_key" ON "ShopifyTag"("shop", "name");
