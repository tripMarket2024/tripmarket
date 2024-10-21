export interface CreateTourDto {
  country: string;
  city?: string | null;
  start_date: Date;
  end_date: Date;
  price: number;
  media: CreateTourMedia[];
  tour_agent_id?: string | null;
  name: string;
  discount?: number | null;
  description_ka?: string | null;
  description_eng?: string | null;
  tour_features?: string[];
}

export interface CreateTourMedia {
  url: string;
  type: string;
  image_name: string;
}
