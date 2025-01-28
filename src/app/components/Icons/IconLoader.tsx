interface LoaderProps {
    color?: string;
    size?: number;
}

export default function IconLoader({ color, size }: LoaderProps) {
  return (
    <div className="inline-block spinner" style={{color: color || "black"}}>
      <svg
        fill="none"
        height={size || 24}
        viewBox="0 0 24 24"
        width={size || 24}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
