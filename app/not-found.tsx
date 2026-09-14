import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-6 pt-28 text-center">
      <div>
        <p className="font-display text-8xl font-semibold text-gradient">404</p>
        <h1 className="mt-4 text-2xl font-semibold">This room doesn&apos;t exist</h1>
        <Link href="/" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-background">
          Back home
        </Link>
      </div>
    </div>
  );
}
