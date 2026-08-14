import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/About.css";
import Image from "../assets/images/about.jpeg"

// --- INLINE SVG ICONS (Themed with Electric Cyan/Blue) ---
const Zap = () => (
  <svg
    className="icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const Flame = () => (
  <svg
    className="icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const Snowflake = () => (
  <svg
    className="icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="20" y1="12" x2="4" y2="12" />
    <line x1="6.34" y1="6.34" x2="17.66" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="6.34" y2="17.66" />
  </svg>
);

const ShieldCheck = () => (
  <svg
    className="icon-svg-small"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 11 12 14 22 4" />
  </svg>
);

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const featureCards = [
  {
    id: 1,
    icon: <Snowflake />,
    title: "Sub-Zero Chill",
    description:
      "Cold-filtered formulation engineered for maximum frost and immediate thermal cool-down.",
  },
  {
    id: 2,
    icon: <Zap />,
    title: "Instant Focus",
    description:
      "Nootropic energy matrix providing sustained mental clarity with zero jitter crash.",
  },
  {
    id: 3,
    icon: <Flame />,
    title: "Zero Sugar",
    description:
      "Full-spectrum flavor profile crafted with organic sweeteners and premium electrolytes.",
  },
];

export default function About() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const cardsRef = useRef([]);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Left Text Reveal
      gsap.fromTo(
        textRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        },
      );

      // 2. Feature Cards Stagger Reveal
      gsap.fromTo(
        cardsRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current[0],
            start: "top 85%",
          },
        },
      );

      // 3. Right Image Reveal & Subtle Floating Loop
      gsap.fromTo(
        imageRef.current,
        { scale: 0.85, opacity: 0, rotate: -3 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        },
      );

      // Continuous Floating Effect on Right Image
      gsap.to(imageRef.current, {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about-section">
      {/* Background Neon Glow Effects */}
      <div className="glow-orb-1" />
      <div className="glow-orb-2" />

      <div className="about-container">
        {/* TOP LAYOUT: Left Content + Right Image */}
        <div className="about-top-grid">
          {/* LEFT SIDE: TEXT CONTENT */}
          <div ref={textRef} className="about-text-content">
            <div className="about-badge">
              <ShieldCheck /> About Neo Urban
            </div>

            <h2 className="about-heading">
              CRAFTED FOR THE <br />
              <span className="text-gradient">NEXT GENERATION</span>
            </h2>

            <p className="about-description">
              Neo Urban Store redefines refreshment. Built for creators, night
              owls, and urban hustlers, our beverages deliver sub-zero chill
              combined with high-voltage energy for maximum output.
            </p>
          </div>

          {/* RIGHT SIDE: HERO IMAGE SHOWCASE */}
          <div className="about-image-column">
            <div ref={imageRef} className="about-image-wrapper">
              <img
                src={Image}
                alt="Cold Drink Bottle Visual"
                className="about-img"
              />
              <div className="about-img-overlay" />

              <div className="about-img-text">
                <span className="overlay-subtitle">Signature Series</span>
                <p className="overlay-title">Ultra Frost Nitro</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM LAYOUT: SMALL CARDS (Icon on Top, Text Below) */}
        <div className="about-cards-grid">
          {featureCards.map((card, index) => (
            <div
              key={card.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="feature-card"
            >
              {/* TOP ICON */}
              <div className="card-icon-box">{card.icon}</div>

              {/* TITLE & PARAGRAPH */}
              <h3 className="card-title">{card.title}</h3>
              <p className="card-description">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}