"use client";

// Animated Text Ticker Component
export default function AnimatedTextTicker() {
  const text = "At CENTURY, we blend bold design with unmatched quality to create streetwear that stands apart. Every piece is crafted using premium fabrics, offering comfort without compromising on style. Our oversized fits and original graphics are rooted in street culture, built for those who move different and think louder. With limited drops and intentional detailing, CENTURY isn't just about fashion—it's about making a statement. Designed to be worn, lived in, and remembered.";
  const capitalizedText = text.replace(/\w\S*/g, (w) => w.toUpperCase());
  
  return (
    <>
      <style jsx global>{`
        @keyframes seamless-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .ticker-seamless {
          animation: seamless-scroll 120s linear infinite;
        }
        .ticker-seamless:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="w-full overflow-hidden py-4 bg-white rounded-lg">
        <div className="flex">
          <div className="ticker-seamless whitespace-nowrap flex">
            <span className="text-xs sm:text-base md:text-lg font-semibold tracking-wide text-gray-800 px-6" style={{ letterSpacing: '0.08em' }}>
              {capitalizedText}
            </span>
            <span className="text-xs sm:text-base md:text-lg font-semibold tracking-wide text-gray-800 px-6" style={{ letterSpacing: '0.08em' }}>
              {capitalizedText}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
