-- CreateTable
CREATE TABLE "TravelCompany" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description_ka" TEXT,
    "description_eng" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "telegram" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,

    CONSTRAINT "TravelCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "travelCompanyId" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TravelCompany_phone_key" ON "TravelCompany"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "TravelCompany_email_key" ON "TravelCompany"("email");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_travelCompanyId_fkey" FOREIGN KEY ("travelCompanyId") REFERENCES "TravelCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
