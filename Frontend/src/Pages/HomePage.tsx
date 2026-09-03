import HeroSection from "../components/HeroSection";
import BrandLogoMarquee from "../components/BrandLogoMarquee";
import TrustIndicators from "../components/TrustIndicators";
import CategoriesSection from "../components/CategoriesSection";
import FeaturedProductsSection from "../components/FeaturedProductsSection";
import SaleSection from "../components/SaleSection";
import CollectionsSection from "../components/CollectionsSection";

const brands = ["ASUS", "MSI", "Intel", "NVIDIA", "Corsair", "Logitech"];

const HomePage = () => {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Brand Logos */}
      <BrandLogoMarquee brands={brands} />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Products */}
      <FeaturedProductsSection />

      {/* Sale Section */}
      <SaleSection />

      {/* Collection Cards */}
      <CollectionsSection />

      {/* Trust Indicators */}
      <TrustIndicators />
    </main>
  );
};

export default HomePage;
