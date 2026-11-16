import { CategoryIndex } from "@/components/home/category-index";
import { CollectionLineup } from "@/components/home/collection-lineup";
import { Discovery } from "@/components/home/discovery";
import { EditorialFeature } from "@/components/home/editorial-feature";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { Philosophy } from "@/components/home/philosophy";
import { Routine } from "@/components/home/routine";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CollectionLineup />
      <FeaturedProducts />
      <Philosophy />
      <CategoryIndex />
      <EditorialFeature />
      <Routine />
      <Discovery />
      <Newsletter />
    </>
  );
}
