import { Media, Tours, TourFeatures, TravelCompany, TourFeaturesTours } from '@prisma/client';

export type TourFeaturesType = TourFeaturesTours & { tour_feature: TourFeatures };

export type ToursType = Tours & {
  media: Media[];
  travel_company: TravelCompany;
  tour_features: TourFeaturesType[];
};
