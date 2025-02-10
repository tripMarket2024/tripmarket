import axios from 'axios';
 
import TravelTourView from 'src/sections/_travel/view/travel-tour-view';
 
export async function generateMetadata({ params }) {
  const { id } = params;
 
  try {
    const response = await axios.get(
      `https://tripmarket-staging.vercel.app/api/tours/${id}`
    );
 
 
    const tour = response.data.data;
 
    const ogImage = tour?.media && tour?.media.length > 0
      ? tour.media[0].url
      : '';
 
    return {
      title: tour?.name || 'Travel Tour',
      openGraph: {
        images: [
          {
            url: ogImage,
            alt: tour?.name || 'Preview of the travel tour',
          },
        ],
      },
    };
  } catch (error) {
    console.error('Failed to fetch tour data:', error);
    throw error;
  }
}
 
export default function TravelTourPage() {
  return <TravelTourView />;
}