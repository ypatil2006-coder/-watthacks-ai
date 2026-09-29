import React, { useState, useEffect, useRef } from 'react';

const CARDS = [
  {
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    tag: '01 / 04 • BIOPHILIC CAMPUS',
    category: 'Sustainable Architecture',
    title: 'Zero-Emission Corporate Eco Park',
    desc: 'Biophilic timber design & living wetlands balancing urban thermal loads.',
    alt: 'WattHacks Sustainable Biophilic Corporate Eco Park'
  },
  {
    image: 'https://images.unsplash.com/photo-1594818379496-da1e345b0ded?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1660330589257-813305a4a383?auto=format&fit=crop&w=1200&q=80',
    tag: '02 / 04 • SOLAR GENERATION',
    category: 'Photovoltaic Arrays',
    title: 'Utility-Scale Solar Energy Field',
    desc: 'Direct green kilowatt arbitrage during peak daytime solar insolation.',
    alt: 'WattHacks Utility-Scale Solar Energy Field'
  },
  {
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1200&q=80',
    tag: '03 / 04 • CARBON ABATEMENT',
    category: 'Fossil Grid Baseline',
    title: 'Thermal Power Emissions Monitoring',
    desc: 'Displacing coal-heavy peak surcharges (India CEA 0.716 kg/kWh baseline).',
    alt: 'WattHacks Carbon Emissions & Fossil Baseline Monitoring'
  },
  {
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=1200&q=80',
    tag: '04 / 04 • KINETIC WIND POWER',
    category: 'Renewable Night Tariffs',
    title: 'Coastal Wind Turbine Farm',
    desc: 'Harvesting off-peak nighttime wind energy rebates across Maharashtra.',
    alt: 'WattHacks Coastal Wind Turbine Farm'
  }
];

const STACK_STYLES = [
  {
    transform: 'translateY(0px) scale(1) rotate(0deg)',
    zIndex: 30,
    opacity: 1,
    filter: 'none',
    boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
    pointerEvents: 'auto',
    cursor: 'pointer'
  },
  {
    transform: 'translateY(-20px) scale(0.94) rotate(2.5deg)',
    zIndex: 20,
    opacity: 0.92,
    filter: 'brightness(0.96)',
    boxShadow: '0 20px 40px -12px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.6) inset',
    pointerEvents: 'none',
    cursor: 'default'
  },
  {
    transform: 'translateY(-38px) scale(0.88) rotate(-2.5deg)',
    zIndex: 10,
    opacity: 0.78,
    filter: 'brightness(0.92)',
    boxShadow: '0 15px 30px -10px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(255, 255, 255, 0.4) inset',
    pointerEvents: 'none',
    cursor: 'default'
  },
  {
    transform: 'translateY(-54px) scale(0.82) rotate(1.8deg)',
    zIndex: 5,
    opacity: 0.58,
    filter: 'brightness(0.88)',
    boxShadow: '0 10px 20px -8px rgba(15, 23, 42, 0.10), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
    pointerEvents: 'none',
    cursor: 'default'
  }
];

export default function Hero() {
  const [deckOrder, setDeckOrder] = useState([0, 1, 2, 3]);
  const [swipingCard, setSwipingCard] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const isAnimating = useRef(false);

  const slideNext = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const topCardIdx = deckOrder[0];
    setSwipingCard(topCardIdx);

    setTimeout(() => {
      setDeckOrder((prev) => [...prev.slice(1), prev[0]]);
      setSwipingCard(null);
      isAnimating.current = false;
    }, 880);
  };

  const slidePrev = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    setDeckOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
    setTimeout(() => {
      isAnimating.current = false;
    }, 880);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      slideNext();
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, deckOrder]);

  return (
    <section id="hero" className="min-h-[78vh] flex flex-col justify-center relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Editorial Product Statement (Airy, Balanced, Luxury) */}
        <div className="lg:col-span-6 flex flex-col items-start justify-center pr-0 lg:pr-8">
          
          {/* Category Tag */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-slate-400 font-mono">
              Autonomous Grid Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-light text-slate-900 tracking-tight leading-[1.04] mb-6">
            Enhance your <br />
            <span className="font-normal text-slate-950">grid intelligence.</span>
          </h1>

          {/* Crisp Balanced Subtitle (Airy, No Clutter) */}
          <p className="text-slate-500 text-base sm:text-lg font-light leading-relaxed max-w-lg mb-10">
            Autonomous energy arbitrage powered by Gemini. Shift heavy commercial loads away from peak fossil surcharges into clean night rebates.
          </p>

          {/* Single Elegant CTA Button */}
          <div className="flex items-center gap-8 mb-12">
            <a
              href="#features"
              className="px-8 py-3.5 border border-slate-900 text-slate-900 text-[11px] font-semibold tracking-[0.22em] uppercase hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm active:scale-95 bg-white/40 backdrop-blur-sm rounded-full inline-flex items-center gap-2 cursor-pointer"
            >
              <span>DISCOVER PLATFORM</span>
              <span className="text-xs">&rarr;</span>
            </a>
          </div>

          {/* Bottom Link */}
          <a
            href="#features"
            className="text-xs text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1.5 font-medium tracking-wide cursor-pointer"
          >
            <span>about our grid intelligence</span>
            <span className="text-[10px]">&#8744;</span>
          </a>

        </div>

        {/* Right Column: Card Deck with Layered Perspective & Sliding Physics */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative pt-12 lg:pt-14">
          
          {/* Deck Container */}
          <div
            className="relative w-full max-w-[390px] aspect-[3/4] group select-none"
            style={{ perspective: 1200 }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {CARDS.map((card, idx) => {
              const isTopSwiping = swipingCard === idx;
              const rawPos = deckOrder.indexOf(idx);
              const stackPos = isTopSwiping
                ? 0
                : swipingCard !== null
                ? Math.max(0, rawPos - 1)
                : rawPos;

              const style = STACK_STYLES[stackPos] || STACK_STYLES[3];

              return (
                <div
                  key={idx}
                  onClick={stackPos === 0 ? slideNext : undefined}
                  style={{
                    transform: isTopSwiping
                      ? 'translateX(112%) translateY(-15px) rotate(12deg) scale(0.95)'
                      : style.transform,
                    zIndex: isTopSwiping ? 35 : style.zIndex,
                    opacity: isTopSwiping ? 0 : style.opacity,
                    filter: style.filter,
                    boxShadow: style.boxShadow,
                    pointerEvents: stackPos === 0 && !isTopSwiping ? 'auto' : 'none',
                    cursor: stackPos === 0 ? 'pointer' : 'default',
                    transition: isTopSwiping
                      ? 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.75s ease-out'
                      : 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease, box-shadow 0.8s ease'
                  }}
                  className="absolute inset-0 rounded-3xl overflow-hidden border border-white/80 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 group/card will-change-transform"
                >
                  <img
                    src={card.image}
                    onError={(e) => {
                      if (card.fallbackImage && e.currentTarget.src !== card.fallbackImage) {
                        e.currentTarget.src = card.fallbackImage;
                      } else {
                        e.currentTarget.style.opacity = '0';
                      }
                    }}
                    alt={card.alt}
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                  />
                  <div className="specular-sheen pointer-events-none"></div>

                  {/* Top Tag Pill */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{card.tag}</span>
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent text-white pointer-events-none">
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                      {card.category}
                    </span>
                    <h4 className="text-sm font-medium text-white/95 mt-0.5">
                      {card.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 font-light mt-1">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deck Controls & Interactive Swipe Ribbon */}
          <div className="mt-6 flex items-center justify-between w-full max-w-[390px] px-2 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={slidePrev}
                className="w-7 h-7 rounded-full border border-slate-900/10 hover:border-slate-900/30 bg-white/60 hover:bg-white text-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
                aria-label="Previous card"
              >
                &#8592;
              </button>
              <button
                onClick={slideNext}
                className="w-7 h-7 rounded-full border border-slate-900/10 hover:border-slate-900/30 bg-white/60 hover:bg-white text-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
                aria-label="Next card"
              >
                &#8594;
              </button>
              <span className="text-[10px] text-slate-400 tracking-wider ml-1">
                CLICK CARD TO SLIDE
              </span>
            </div>

            {/* Dynamic Dots Indicator */}
            <div className="flex items-center gap-1.5">
              {CARDS.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => {
                    if (dotIdx !== deckOrder[0] && !isAnimating.current) {
                      slideNext();
                    }
                  }}
                  className={`transition-all duration-300 cursor-pointer ${
                    dotIdx === deckOrder[0]
                      ? 'w-5 h-1.5 rounded-full bg-emerald-500'
                      : 'w-2 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Card ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
