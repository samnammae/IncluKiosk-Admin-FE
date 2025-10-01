import Header from "@/components/layout/Header";
import FadeScrollPage from "@/components/layout/intro/FadeScrollPage";
import Hero from "@/components/layout/intro/Hero";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <Header />
      <Hero />
      <FadeScrollPage />
    </div>
  );
}
