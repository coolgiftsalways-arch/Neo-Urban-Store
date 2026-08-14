import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "@fontsource/nosifer";

import HEROONE from "../assets/images/heroone.png";
import HEROTWO from "../assets/images/herotwo.png";
import HEROTHREE from "../assets/images/herothree.png";
import HEROFOUR from "../assets/images/herofour.png";
import HEROFIVE from "../assets/images/herofive.png";
import HEROSIX from "../assets/images/herosix.png";
import HEROSEVEN from "../assets/images/heroseven.png";
import HEROEIGHT from "../assets/images/heroeight.png";

import "../styles/hero.css";

/* =========================================================
   8 HIGH-VOLTAGE ENERGY DRINK FLAVORS
   ========================================================= */

const FLAVORS = [
  {
    badge: "01 // TOXIC CRUSH",
    title: "LIQUID ADRENALINE",
    subtitle: "300MG ANHYDROUS CAFFEINE",
    description:
      "Raw high-octane energy fuel engineered for night owls, gamers, and extreme performers. Zero crash guaranteed.",
    flavorName: "CRIMSON RAGE",
    accentColor: "#fff",
    glowColor: "#ffff",
    canImage: HEROONE,
  },

  // 🩷 02 — LIGHT RED
{
  badge: "02 // ZERO SURGE",
  title: "CARBON OVERDRIVE",
  subtitle: "TAURINE + ZERO SUGAR INFUSED",
  description:
    "Precision focus matrix crafted to unlock hyper-cognitive reflexes and zero-lag mental stamina. 100% output, zero sugar.",
  flavorName: "CRIMSON SILVER",
  accentColor: "#Ffff",
  glowColor: "#ffff",
  canImage: HEROTWO,
},

  // 🩷 03 — PINK
  {
    badge: "03 // VOID IGNITION",
    title: "NOCTURNAL FUEL",
    subtitle: "ELECTROLYTE RECOVERY MATRIX",
    description:
      "Deep-space berry synthesis designed for midnight coders and relentless dark-mode warriors.",
    flavorName: "NEON PINK",
    accentColor: "#FFf",
    glowColor: "#ffff",
    canImage: HEROTHREE,
  },

  // 💚 04 — GREEN
  {
    badge: "04 // NUCLEAR HAZE",
    title: "ATOMIC REACTOR",
    subtitle: "MAXIMUM CITRULLINE PUMP",
    description:
      "Explosive tropical citrus power boost designed to shatter fatigue barriers and hit maximum velocity.",
    flavorName: "TOXIC GREEN",
    accentColor: "#ffff",
    glowColor: "#ffff",
    canImage: HEROFOUR,
  },

  // 🤍 05 — WHITE
  {
    badge: "05 // NEON RUSH",
    title: "CYBER VOLTAGE",
    subtitle: "MAXIMUM ENERGY MATRIX",
    description:
      "A neon-charged energy blend engineered for all-night sessions, rapid focus and unstoppable momentum.",
    flavorName: "POLAR WHITE",
    accentColor: "#F5F7FA",
    glowColor: "rgba(245, 247, 250, 0.28)",
    canImage: HEROFIVE,
  },

  // 💚 06 — GREEN
  {
    badge: "06 // VENOM CORE",
    title: "INFERNO DRIVE",
    subtitle: "EXTREME PERFORMANCE FORMULA",
    description:
      "A brutal fusion of heat, caffeine and raw energy built for people who refuse to slow down.",
    flavorName: "VENOM GREEN",
    accentColor: "#ffff",
    glowColor: "#ffff",
    canImage: HEROSIX,
  },

  // 💛 07 — YELLOW
  {
    badge: "07 // PHANTOM MODE",
    title: "DARK MATTER",
    subtitle: "ZERO SUGAR · MAXIMUM FOCUS",
    description:
      "Cold, calculated and intensely focused. Designed for deep work, late nights and maximum output.",
    flavorName: "ELECTRIC YELLOW",
    accentColor: "#FFf",
    glowColor: "#fff",
    canImage: HEROSEVEN,
  },

  // ❤️ 08 — keeping red/pinkish for contrast
  {
    badge: "08 // HYPER NOVA",
    title: "FINAL OVERDRIVE",
    subtitle: "ULTIMATE ENERGY FORMULA",
    description:
      "The final evolution. An explosive energy experience designed to push your limits beyond the ordinary.",
    flavorName: "HYPER NOVA",
    accentColor: "#FFf",
    glowColor: "#ffff",
    canImage: HEROEIGHT,
  },
];

/* =========================================================
   HERO COMPONENT
   ========================================================= */

export default function Hero() {
  const [activeIdx, setActiveIdx] = useState(0);

  const heroRef = useRef(null);
  const canImgRef = useRef(null);

  const lightning1Ref = useRef(null);
  const lightning2Ref = useRef(null);

  const current = FLAVORS[activeIdx];

  /* =========================================================
     FLOATING CAN + LIGHTNING ANIMATION
     ========================================================= */

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!canImgRef.current) return;

      /* Floating can */

      gsap.to(canImgRef.current, {
        y: -18,
        rotate: 2,

        duration: 3,

        repeat: -1,
        yoyo: true,

        ease: "sine.inOut",
      });

      /* Lightning flicker */

      const thunderTL = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.2,
      });

      thunderTL
        .to(
          [lightning1Ref.current, lightning2Ref.current],
          {
            opacity: 1,
            duration: 0.04,
            stagger: 0.02,
          }
        )

        .to(
          [lightning1Ref.current, lightning2Ref.current],
          {
            opacity: 0,
            duration: 0.08,
          }
        )

        .to(lightning1Ref.current, {
          opacity: 0.95,
          duration: 0.03,
        })

        .to(lightning1Ref.current, {
          opacity: 0,
          duration: 0.1,
        });
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, []);

  /* =========================================================
     AUTOMATIC 8-SLIDE ROTATION
     ========================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => {
        return (prev + 1) % FLAVORS.length;
      });
    }, 4500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* =========================================================
     FLAVOR CHANGE ANIMATION
     ========================================================= */

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* -----------------------------------------
         TEXT ENTRANCE
         ----------------------------------------- */

      gsap.fromTo(
        ".anim-text",

        {
          y: 30,
          opacity: 0,
          skewX: -3,
        },

        {
          y: 0,
          opacity: 1,
          skewX: 0,

          duration: 0.55,

          stagger: 0.07,

          ease: "power3.out",
        }
      );

      /* -----------------------------------------
         CAN 3D REVEAL
         ----------------------------------------- */

      gsap.fromTo(
        canImgRef.current,

        {
          rotateY: -90,
          scale: 0.78,
          opacity: 0,
        },

        {
          rotateY: 0,
          scale: 1,
          opacity: 1,

          duration: 0.75,

          ease: "back.out(1.4)",
        }
      );
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, [activeIdx]);

  /* =========================================================
     MOUSE PARALLAX
     ========================================================= */

  const handleMouseMove = (e) => {
    if (!canImgRef.current) return;

    /* Disable on mobile */

    if (window.innerWidth <= 768) {
      return;
    }

    const { clientX, clientY } = e;

    const x =
      (clientX / window.innerWidth - 0.5) * 25;

    const y =
      (clientY / window.innerHeight - 0.5) * -25;

    gsap.to(canImgRef.current, {
      rotateY: x,
      rotateX: y,

      duration: 0.4,

      ease: "power2.out",

      overwrite: "auto",
    });
  };

  /* =========================================================
     MANUAL SLIDE CHANGE
     ========================================================= */

  const handleSlideChange = (index) => {
    setActiveIdx(index);
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <section
      className="danger-hero-wrapper"
      ref={heroRef}
      onMouseMove={handleMouseMove}
    >

      <div className="danger-hero-grid">

        {/* =================================================
            LEFT — TEXT
            ================================================= */}

        <div className="hero-text-col">

          {/* ---------------------------------------------
              BADGE
              --------------------------------------------- */}

          <div
            className="danger-badge anim-text"
            style={{
              borderColor: current.accentColor,

              boxShadow:
                `0 0 15px ${current.glowColor}`,
            }}
          >

            <span className="biohazard-icon">
              ☣️
            </span>

            <span>
              {current.badge}
            </span>

          </div>

          {/* ---------------------------------------------
              TITLE
              --------------------------------------------- */}

          <h1 className="danger-title anim-text">

            <span
              className="red-glitch-text"
              style={{
                color: current.accentColor,

                textShadow:
                  `0 0 25px ${current.glowColor},
                   0 0 55px ${current.glowColor}`,
              }}
            >
              {current.title}
            </span>

          </h1>

          {/* ---------------------------------------------
              SUBTITLE
              --------------------------------------------- */}

          <h5
            className="danger-h5-subtitle anim-text"
            style={{
              color: current.accentColor,
            }}
          >
            ⚡ {current.subtitle}
          </h5>

          {/* ---------------------------------------------
              DESCRIPTION
              --------------------------------------------- */}

          <p
            className="danger-subtitle anim-text"
            style={{
              fontFamily:
                "'Nosifer', cursive",

              fontSize: "0.85rem",
            }}
          >
            {current.description}
          </p>

          {/* ---------------------------------------------
              CTA + DOTS
              --------------------------------------------- */}

          <div className="danger-cta-group anim-text">
<button
  className="btn-danger-fire"
  style={{
    backgroundColor: "#000",

    boxShadow:
      `0 0 25px #fff,
       0 0 55px #fff`,
  }}
>
  UNLEASH THE CAN ⚡
</button>

            {/* -------------------------------------------
                8 SLIDE DOTS
                ------------------------------------------- */}

            <div className="stage-dots">

              {FLAVORS.map((flavor, idx) => (

                <button
                  key={flavor.flavorName}

                  type="button"

                  aria-label={`View ${flavor.flavorName}`}

                  title={flavor.flavorName}

                  className={
                    `dot-btn ${
                      activeIdx === idx
                        ? "active"
                        : ""
                    }`
                  }

                  style={{
                    backgroundColor:
                      activeIdx === idx
                        ? current.accentColor
                        : "rgba(255,255,255,0.20)",

                    boxShadow:
                      activeIdx === idx
                        ? `0 0 10px ${current.accentColor}`
                        : "none",
                  }}

                  onClick={() =>
                    handleSlideChange(idx)
                  }
                />

              ))}

            </div>

          </div>

        </div>

        {/* =================================================
            RIGHT — CAN PRESENTATION
            ================================================= */}

        <div className="real-can-container">

          {/* ---------------------------------------------
              COLOR AURA
              --------------------------------------------- */}

          <div
            className="real-can-aura"
            style={{
              background:
                `radial-gradient(
                  circle,
                  ${current.glowColor} 15%,
                  rgba(0, 0, 0, 0) 72%
                )`,
            }}
          />

          {/* ---------------------------------------------
              ELECTRIC THUNDER
              --------------------------------------------- */}

          <svg
            className="thunder-svg-layer"

            viewBox="0 0 300 500"

            preserveAspectRatio="xMidYMid meet"

            aria-hidden="true"
          >

            <defs>

              <filter
                id="electric-glow"

                x="-50%"
                y="-50%"

                width="200%"
                height="200%"
              >

                <feGaussianBlur
                  stdDeviation="4"

                  result="coloredBlur"
                />

                <feMerge>

                  <feMergeNode
                    in="coloredBlur"
                  />

                  <feMergeNode
                    in="SourceGraphic"
                  />

                </feMerge>

              </filter>

            </defs>

            {/* -----------------------------------------
                PRIMARY COLORED BOLT
                ----------------------------------------- */}

            <path
              ref={lightning1Ref}

              className="thunder-bolt thunder-primary"

              d="
                M 110 30
                L 175 120
                L 115 210
                L 195 320
                L 125 410
                L 160 470
              "

              fill="none"

              stroke={current.accentColor}

              filter="url(#electric-glow)"
            />

            {/* -----------------------------------------
                WHITE ELECTRIC CORE
                ----------------------------------------- */}

            <path
              ref={lightning2Ref}

              className="thunder-bolt thunder-core"

              d="
                M 185 20
                L 135 135
                L 180 230
                L 110 330
                L 170 460
              "

              fill="none"

              stroke="#FFFFFF"

              filter="url(#electric-glow)"
            />

          </svg>

          {/* ---------------------------------------------
              PRODUCT CAN
              --------------------------------------------- */}

          <img
            ref={canImgRef}

            src={current.canImage}

            alt={current.flavorName}

            className="real-can-image"

            draggable="false"

            style={{
              filter:
                `drop-shadow(
                  0 10px 25px ${current.glowColor}
                )
                drop-shadow(
                  0 0 15px rgba(0,0,0,0.85)
                )`,
            }}
          />

          {/* ---------------------------------------------
              FLOOR SHADOW
              --------------------------------------------- */}

          <div
            className="real-can-shadow"

            style={{
              background:
                `radial-gradient(
                  ellipse at center,
                  ${current.glowColor} 0%,
                  rgba(0,0,0,0.8) 50%,
                  rgba(0,0,0,0) 80%
                )`,
            }}
          />

        </div>

      </div>

    </section>
  );
}