import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl md:text-9xl"><span className="neon-text">404</span></p>
      <h1 className="mt-4 font-display text-2xl">This pixel doesn't exist.</h1>
      <p className="mt-2 max-w-md text-white/60">
        The page you're looking for has been unplugged or moved. Try the home page or our projects.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-full bg-white px-5 py-2.5 text-sm text-ink">Home</Link>
        <Link href="/projects" className="rounded-full border border-white/20 px-5 py-2.5 text-sm">Projects</Link>
      </div>
    </div>
  );
}
