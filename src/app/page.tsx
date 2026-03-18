import { HeroBanner } from '@/components/home/HeroBanner';
import TrustBadges from '@/components/home/TrustBadges';
import { BestSelling } from '@/components/home/BestSelling';
import PromoBanners from '@/components/home/PromoBanners';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import BrandStory from '@/components/home/BrandStory';
import { ProductTabs } from '@/components/home/ProductTabs';
import Testimonials from '@/components/home/Testimonials';
import InstagramFeed from '@/components/home/InstagramFeed';
import Newsletter from '@/components/home/Newsletter';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrustBadges />
      <BestSelling />
      <PromoBanners />
      <CategoryShowcase />
      <BrandStory />
      <ProductTabs />
      <Testimonials />
      <InstagramFeed />
      <Newsletter />
    </>
  );
}
