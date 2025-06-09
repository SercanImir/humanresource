import React from "react";

/**
 * Flat, şeffaf arka planlı PEOPLEMESH logosu.
 * size prop’u ile piksel cinsinden genişlik/ yükseklik kontrol edilebilir.
 */
export const Logo: React.FC<{ size?: number }> = ({ size = 120 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
            // Altın sarısı hafif glow efekti
            filter: "drop-shadow(0 0 6px var(--accent))",
        }}
    >
        {/* Ortadaki node */}
        <circle cx="60" cy="60" r="6" fill="#004E7C" />
        {/* Kenarlara giden çizgiler */}
        <line x1="60" y1="60" x2="60" y2="12" stroke="#004E7C" strokeWidth="4" />
        <line x1="60" y1="60" x2="108" y2="40" stroke="#004E7C" strokeWidth="4" />
        <line x1="60" y1="60" x2="84" y2="104" stroke="#004E7C" strokeWidth="4" />
        <line x1="60" y1="60" x2="36" y2="104" stroke="#004E7C" strokeWidth="4" />
        <line x1="60" y1="60" x2="12" y2="40" stroke="#004E7C" strokeWidth="4" />

        {/* Altı insan figürü */}
        {[
            { cx: 60, cy: 12 },
            { cx: 108, cy: 40 },
            { cx: 84, cy: 104 },
            { cx: 36, cy: 104 },
            { cx: 12, cy: 40 },
            { cx: 60, cy: 12 },
        ].map(({ cx, cy }, i) => {
            // Even index = altın, odd = lacivert
            const fill = i % 2 === 0 ? "#F4B740" : "#004E7C";
            return (
                <g key={i}>
                    <circle cx={cx} cy={cy} r="10" fill={fill} />
                    <rect
                        x={cx - 12}
                        y={cy + 12}
                        width="24"
                        height="16"
                        rx="6"
                        fill={fill}
                    />
                </g>
            );
        })}

        {/* Altındaki yazı */}
        <text
            x="50%"
            y="118"
            textAnchor="middle"
            fill=  "#FFFFFF"
            fontSize="12"
            fontFamily="sans-serif"
            letterSpacing="1.5"
            fontWeight="600"
        >
            PEOPLEMESH
        </text>
    </svg>
);