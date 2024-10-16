export interface TravelCompanyInterface {
    id: string;
    created_date: string;
    name: string;
    description_ka: string | null;
    description_eng: string | null;
    address: string | null;
    phone: string | null;
    password: string;
    email: string;
    website: string | null;
    facebook: string | null;
    telegram: string | null;
    instagram: string | null;
    youtube: string | null;
    twitter: string | null;
    linkedin: string | null;
  }
  
  export interface AuthResponse {
    user: TravelCompanyInterface;
    token: string;
  }
  