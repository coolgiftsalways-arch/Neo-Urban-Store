import Hero from "../components/Hero";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import About from "../Components/About";
import Track from "../Components/Track";


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