interface AccessLogoProps {
  className?: string;
}

export function AccessLogo({ className }: AccessLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2L2 22H22L12 2ZM12 6L5 20H19L12 6Z"
      />
    </svg>
  );
}
