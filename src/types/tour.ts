import { IAuthorProps } from './author';
import { ISocialLinks } from './socials';

// ----------------------------------------------------------------------

export type ITourProps = {
  id: string;
  slug: {
    id: number;
    title_ka: string;
    title_eng: string;
  };
  price: number;
  heroUrl: string;
  createdAt: Date;
  coverUrl: string;
  location: {
    code: string;
    label: string;
    phone: string;
    label_ka: string;
    suggested?: boolean;
  };
  duration: string;
  continent: {
    code: string;
    label: string;
    phone: string;
    label_ka: string;
    suggested?: boolean;
  };
  priceSale: number;
  gallery: string[];
  favorited: boolean;
  services: string[];
  description: string;
  languages: string[];
  ratingNumber: number;
  totalReviews: number;
  highlights: string[];
  tourGuide: IAuthorProps;
  shareLinks: ISocialLinks;
  available: {
    start: Date;
    end: Date;
  };
  program: {
    label: string;
    text: string;
  }[];
};

export type ITourCheckoutProps = {
  billingAddress: {
    firstName: string;
    lastName: string;
    fullAddress: string;
    fullAddress2: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    fullAddress: string;
    fullAddress2: string;
  };
  paymentMethods: {
    methods: string;
    card: {
      cardNumber: string;
      cardHolder: string;
      expirationDate: string;
      ccv: string;
    };
  };
};
