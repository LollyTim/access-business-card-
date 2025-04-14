interface QRCodeImageProps {
  username: string
}

export function QRCodeImage({ username }: QRCodeImageProps) {
  // In a real implementation, you would generate this dynamically
  // For this demo, we're using a static image that matches the reference
  return (
    <div className="h-[140px] w-[140px] overflow-hidden">
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        {/* QR Code Frame */}
        <rect width="140" height="140" fill="white" />

        {/* Position Detection Patterns - Top Left */}
        <rect x="10" y="10" width="30" height="30" fill="black" />
        <rect x="15" y="15" width="20" height="20" fill="white" />
        <rect x="20" y="20" width="10" height="10" fill="black" />

        {/* Position Detection Patterns - Top Right */}
        <rect x="100" y="10" width="30" height="30" fill="black" />
        <rect x="105" y="15" width="20" height="20" fill="white" />
        <rect x="110" y="20" width="10" height="10" fill="black" />

        {/* Position Detection Patterns - Bottom Left */}
        <rect x="10" y="100" width="30" height="30" fill="black" />
        <rect x="15" y="105" width="20" height="20" fill="white" />
        <rect x="20" y="110" width="10" height="10" fill="black" />

        {/* QR Code Data Pattern - Simplified representation */}
        <rect x="45" y="10" width="5" height="5" fill="black" />
        <rect x="55" y="10" width="5" height="5" fill="black" />
        <rect x="65" y="10" width="5" height="5" fill="black" />
        <rect x="75" y="10" width="5" height="5" fill="black" />
        <rect x="85" y="10" width="5" height="5" fill="black" />

        <rect x="10" y="45" width="5" height="5" fill="black" />
        <rect x="20" y="45" width="5" height="5" fill="black" />
        <rect x="30" y="45" width="5" height="5" fill="black" />
        <rect x="40" y="45" width="5" height="5" fill="black" />
        <rect x="50" y="45" width="5" height="5" fill="black" />
        <rect x="60" y="45" width="5" height="5" fill="black" />
        <rect x="70" y="45" width="5" height="5" fill="black" />
        <rect x="80" y="45" width="5" height="5" fill="black" />
        <rect x="90" y="45" width="5" height="5" fill="black" />
        <rect x="100" y="45" width="5" height="5" fill="black" />
        <rect x="110" y="45" width="5" height="5" fill="black" />
        <rect x="120" y="45" width="5" height="5" fill="black" />

        <rect x="10" y="55" width="5" height="5" fill="black" />
        <rect x="25" y="55" width="5" height="5" fill="black" />
        <rect x="40" y="55" width="5" height="5" fill="black" />
        <rect x="55" y="55" width="5" height="5" fill="black" />
        <rect x="70" y="55" width="5" height="5" fill="black" />
        <rect x="85" y="55" width="5" height="5" fill="black" />
        <rect x="100" y="55" width="5" height="5" fill="black" />
        <rect x="115" y="55" width="5" height="5" fill="black" />

        <rect x="10" y="65" width="5" height="5" fill="black" />
        <rect x="20" y="65" width="5" height="5" fill="black" />
        <rect x="30" y="65" width="5" height="5" fill="black" />
        <rect x="40" y="65" width="5" height="5" fill="black" />
        <rect x="50" y="65" width="5" height="5" fill="black" />
        <rect x="60" y="65" width="5" height="5" fill="black" />
        <rect x="70" y="65" width="5" height="5" fill="black" />
        <rect x="80" y="65" width="5" height="5" fill="black" />
        <rect x="90" y="65" width="5" height="5" fill="black" />
        <rect x="100" y="65" width="5" height="5" fill="black" />
        <rect x="110" y="65" width="5" height="5" fill="black" />
        <rect x="120" y="65" width="5" height="5" fill="black" />

        <rect x="10" y="75" width="5" height="5" fill="black" />
        <rect x="25" y="75" width="5" height="5" fill="black" />
        <rect x="40" y="75" width="5" height="5" fill="black" />
        <rect x="55" y="75" width="5" height="5" fill="black" />
        <rect x="70" y="75" width="5" height="5" fill="black" />
        <rect x="85" y="75" width="5" height="5" fill="black" />
        <rect x="100" y="75" width="5" height="5" fill="black" />
        <rect x="115" y="75" width="5" height="5" fill="black" />

        <rect x="10" y="85" width="5" height="5" fill="black" />
        <rect x="20" y="85" width="5" height="5" fill="black" />
        <rect x="30" y="85" width="5" height="5" fill="black" />
        <rect x="40" y="85" width="5" height="5" fill="black" />
        <rect x="50" y="85" width="5" height="5" fill="black" />
        <rect x="60" y="85" width="5" height="5" fill="black" />
        <rect x="70" y="85" width="5" height="5" fill="black" />
        <rect x="80" y="85" width="5" height="5" fill="black" />
        <rect x="90" y="85" width="5" height="5" fill="black" />
        <rect x="100" y="85" width="5" height="5" fill="black" />
        <rect x="110" y="85" width="5" height="5" fill="black" />
        <rect x="120" y="85" width="5" height="5" fill="black" />

        {/* Access Bank Logo in center */}
        <g transform="translate(60, 60)">
          <path d="M10 0L20 10L10 20L0 10L10 0Z" fill="#FF5722" />
          <path d="M10 3L17 10L10 17L3 10L10 3Z" fill="white" />
          <path d="M10 6L14 10L10 14L6 10L10 6Z" fill="#FF5722" />
        </g>
      </svg>
    </div>
  )
}
