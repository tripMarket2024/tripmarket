-- CreateTable
CREATE TABLE "TravelCompany" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description_ka" TEXT,
    "description_eng" TEXT,
    "google_uid" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "facebook" TEXT,
    "telegram" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "profile_picture" TEXT,
    "profile_picture_url" TEXT,

    CONSTRAINT "TravelCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "image_name" TEXT NOT NULL,
    "tour_id" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tours" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION,
    "description_ka" TEXT,
    "description_eng" TEXT,
    "travel_company_id" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourFeatures" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name_ka" TEXT NOT NULL,
    "name_eng" TEXT NOT NULL,

    CONSTRAINT "TourFeatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourFeaturesTours" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tour_id" TEXT NOT NULL,
    "tour_feature_id" TEXT NOT NULL,

    CONSTRAINT "TourFeaturesTours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToursAgents" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tour_id" TEXT NOT NULL,
    "tour_agent_id" TEXT NOT NULL,

    CONSTRAINT "ToursAgents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourAgent" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "description_ka" TEXT,
    "description_eng" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "telegram" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "profile_picture" TEXT,
    "profile_picture_url" TEXT,
    "travel_company_id" TEXT NOT NULL,

    CONSTRAINT "TourAgent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TravelCompany_phone_key" ON "TravelCompany"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "TravelCompany_email_key" ON "TravelCompany"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TourAgent_phone_key" ON "TourAgent"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "TourAgent_email_key" ON "TourAgent"("email");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "Tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tours" ADD CONSTRAINT "Tours_travel_company_id_fkey" FOREIGN KEY ("travel_company_id") REFERENCES "TravelCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourFeaturesTours" ADD CONSTRAINT "TourFeaturesTours_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "Tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourFeaturesTours" ADD CONSTRAINT "TourFeaturesTours_tour_feature_id_fkey" FOREIGN KEY ("tour_feature_id") REFERENCES "TourFeatures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToursAgents" ADD CONSTRAINT "ToursAgents_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "Tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToursAgents" ADD CONSTRAINT "ToursAgents_tour_agent_id_fkey" FOREIGN KEY ("tour_agent_id") REFERENCES "TourAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourAgent" ADD CONSTRAINT "TourAgent_travel_company_id_fkey" FOREIGN KEY ("travel_company_id") REFERENCES "TravelCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
