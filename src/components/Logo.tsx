import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/">
      <h1 className={`text-3xl font-headline text-primary cursor-pointer ${className}`}>
        Çiçek Terapi
      </h1>
    </Link>
  );
}
