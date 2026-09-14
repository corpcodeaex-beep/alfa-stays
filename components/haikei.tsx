// Haikei-style SVG backgrounds (https://haikei.app).
// Shapes are generated with Haikei and rewritten to use the Realtime Colors CSS variables,
// so they re-theme automatically. Swap the path data with your own Haikei exports.

type P = { className?: string; flip?: boolean };

/** Layered waves — use as a section divider. */
export function LayeredWaves({ className, flip }: P) {
  return (
    <svg
      viewBox="0 0 900 180"
      preserveAspectRatio="none"
      className={className}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
      aria-hidden
    >
      <path
        d="M0 62L37.5 66.3C75 70.7 150 79.3 225 74.8C300 70.3 375 52.7 450 47.2C525 41.7 600 48.3 675 57.5C750 66.7 825 78.3 862.5 84.2L900 90V181H0Z"
        fill="var(--secondary)"
        opacity="0.55"
      />
      <path
        d="M0 103L37.5 99.3C75 95.7 150 88.3 225 91.8C300 95.3 375 109.7 450 113.3C525 117 600 110 675 102.5C750 95 825 87 862.5 83L900 79V181H0Z"
        fill="var(--primary)"
        opacity="0.35"
      />
      <path
        d="M0 137L37.5 134.5C75 132 150 127 225 128.8C300 130.7 375 139.3 450 141.5C525 143.7 600 139.3 675 134.3C750 129.3 825 123.7 862.5 120.8L900 118V181H0Z"
        fill="var(--background)"
      />
    </svg>
  );
}

/** Soft blob scene — decorative background glow. */
export function BlobScene({ className }: P) {
  return (
    <svg viewBox="0 0 900 600" className={className} aria-hidden>
      <defs>
        <filter id="haikei-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="60" />
        </filter>
      </defs>
      <g filter="url(#haikei-blur)">
        <path
          transform="translate(210 180)"
          d="M112.4 -125.6C149.6 -99.2 186.3 -67.1 196.4 -26.9C206.5 13.3 190 61.6 160.6 101.3C131.2 141 88.9 172.1 41.6 186.8C-5.7 201.5 -58 199.8 -104.5 178.2C-151 156.6 -191.7 115.1 -203.4 66.7C-215.2 18.3 -198 -37 -168.3 -80.5C-138.6 -124 -96.4 -155.7 -52.5 -174.8C-8.6 -193.9 37 -200.4 70.6 -181.9C104.2 -163.4 75.2 -152 112.4 -125.6Z"
          fill="var(--primary)"
          opacity="0.45"
        />
        <path
          transform="translate(680 400)"
          d="M129.5 -111.3C163.7 -69.2 184.1 -12.6 173.5 38.2C162.9 89 121.3 134.2 69.9 159.3C18.5 184.4 -42.7 189.4 -92.1 165.3C-141.5 141.2 -179.1 88 -186.9 31.6C-194.7 -24.8 -172.7 -84.4 -132.7 -127C-92.7 -169.6 -34.8 -195.2 16.5 -208.3C67.8 -221.4 95.3 -153.4 129.5 -111.3Z"
          fill="var(--accent)"
          opacity="0.35"
        />
      </g>
    </svg>
  );
}

/** Layered peaks — footer backdrop. */
export function LayeredPeaks({ className }: P) {
  return (
    <svg viewBox="0 0 900 160" preserveAspectRatio="none" className={className} aria-hidden>
      <path d="M0 96L75 70L150 104L225 58L300 92L375 46L450 88L525 52L600 98L675 60L750 94L825 66L900 90V161H0Z" fill="var(--secondary)" opacity="0.4" />
      <path d="M0 122L75 104L150 128L225 96L300 120L375 90L450 118L525 94L600 126L675 100L750 124L825 104L900 118V161H0Z" fill="var(--primary)" opacity="0.3" />
    </svg>
  );
}
