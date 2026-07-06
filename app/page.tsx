import VideoSlider from '@/features/home/video-slider';
import Hero from '@/features/home/hero';
import Categories from '@/features/home/categories';
import FeaturedCourses from '@/features/home/featured-courses';
import Stats from '@/features/home/stats';
import Benefits from '@/features/home/benefits';
import Testimonials from '@/features/home/testimonials';
import FAQ from '@/features/home/faq';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <VideoSlider />
      <Categories />
      <FeaturedCourses />
      <Stats />
      <Benefits />
      <Testimonials />
      <FAQ />
    </div>
  );
}
