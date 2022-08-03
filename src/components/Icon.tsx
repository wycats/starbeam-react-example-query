import { PropsWithChildren } from 'react';

export default function Icon({
  children,
  filled = true,
}: PropsWithChildren<{ filled?: boolean; padded?: boolean }>) {
  return (
    <span
      className={`material-symbols-outlined`}
      style={{
        fontSize: '1.3em',
        fontVariationSettings: filled
          ? `'FILL' 1, 'wght' 500`
          : `'FILL' 0, 'wght' 100`,
      }}
    >
      {children}
    </span>
  );
}
