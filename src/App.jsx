import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import Footer from "./components/Footer";

// Lazy loading only non-critical below-fold components
const Hero = lazy(() => import("./components/Hero"));
const About = lazy(() => import("./components/About"));
const Projects = lazy(() => import("./components/Projects"));
const Services = lazy(() => import("./components/Services"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const Contact = lazy(() => import("./components/Contact"));

function App() {
  return (
    <div className="bg-[#0f0f0f] text-white scroll-smooth overflow-x-hidden">
      <Navbar />

      <Suspense fallback={<Loader />}>
        <Hero />
      </Suspense>

      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <About />
        <Projects />
        <Services />
        <Testimonials />
        <Contact />
      </Suspense>

      <Footer />
    </div>
  );
}

export default App;
