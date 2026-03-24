import Hero from '../sections/Hero';
import CategoryCloud from '../sections/CategoryCloud';
import NewArrivals from '../sections/NewArrivals';
import PromoSection from '../sections/PromoSection';
import BestSellers from '../sections/BestSellers';

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryCloud />
      <NewArrivals />
      <PromoSection />
      <BestSellers />
    </>
  );
}
