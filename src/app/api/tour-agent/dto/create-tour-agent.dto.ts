export interface CreateAgentDto {
  name: string;
  last_name: string;
  description_ka?: string | null;
  description_eng?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  facebook?: string | null;
  telegram?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  profile_picture?: string | null;
  profile_picture_url?: string | null;
}
