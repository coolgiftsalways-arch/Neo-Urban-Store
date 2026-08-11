import Hero from "../components/Hero";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import About from "../components/About";
import Track from "../components/Track";


export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <BestSeller />
      <About />
      <Track />
    </>
  );
}