import React from "react";

interface BPLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { width: 100, monogramFont: 28, wordmarkFont: 8, taglineFont: 6, lineWidth: 24 },
  md: { width: 140, monogramFont: 40, wordmarkFont: 11, taglineFont: 8, lineWidth: 34 },
  lg: { width: 180, monogramFont: 52, wordmarkFont: 14, taglineFont: 10, lineWidth: 44 },
};

const BPLogo: React.FC<BPLogoProps> = ({ className = "", size = "md" }) => {
  const s = sizes[size];
  const height = s.width * 0.55;

  return (
    <svg
      viewBox={`0 0 ${s.width} ${height}`}
      className={className}
      style={{ width: s.width, height }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gold horizontal lines left of BP */}
      <line
        x1={s.width * 0.05}
        y1={height * 0.28}
        x2={s.width * 0.05 + s.lineWidth * 0.6}
        y2={height * 0.28}
        stroke="#C9A84C"
        strokeWidth={1.5}
      />
      <line
        x1={s.width * 0.05}
        y1={height * 0.40}
        x2={s.width * 0.05 + s.lineWidth * 0.4}
        y2={height * 0.40}
        stroke="#C9A84C"
        strokeWidth={1}
      />
      <line
        x1={s.width * 0.05}
        y1={height * 0.52}
        x2={s.width * 0.05 + s.lineWidth * 0.6}
        y2={height * 0.52}
        stroke="#C9A84C"
        strokeWidth={1.5}
      />

      {/* Gold horizontal lines right of BP */}
      <line
        x1={s.width * 0.95 - s.lineWidth * 0.6}
        y1={height * 0.28}
        x2={s.width * 0.95}
        y2={height * 0.28}
        stroke="#C9A84C"
        strokeWidth={1.5}
      />
      <line
        x1={s.width * 0.95 - s.lineWidth * 0.4}
        y1={height * 0.40}
        x2={s.width * 0.95}
        y2={height * 0.40}
        stroke="#C9A84C"
        strokeWidth={1}
      />
      <line
        x1={s.width * 0.95 - s.lineWidth * 0.6}
        y1={height * 0.52}
        x2={s.width * 0.95}
        y2={height * 0.52}
        stroke="#C9A84C"
        strokeWidth={1.5}
      />

      {/* BP Monogram */}
      <text
        x={s.width * 0.5}
        y={height * 0.48}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#FFFFFF"
        fontFamily="'Playfair Display', 'Times New Roman', serif"
        fontSize={s.monogramFont}
        fontWeight={400}
        letterSpacing="-0.02em"
      >
        BP
      </text>

      {/* BARBER PLUS wordmark */}
      <text
        x={s.width * 0.5}
        y={height * 0.74}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#FFFFFF"
        fontFamily="Inter, sans-serif"
        fontSize={s.wordmarkFont}
        fontWeight={700}
        letterSpacing="0.25em"
      >
        BARBER PLUS
      </text>

      {/* Tagline */}
      <text
        x={s.width * 0.5}
        y={height * 0.92}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#C9A84C"
        fontFamily="Inter, sans-serif"
        fontSize={s.taglineFont}
        fontWeight={400}
        letterSpacing="0.12em"
      >
        Coupe • Style • Confiance
      </text>
    </svg>
  );
};

export default BPLogo;
