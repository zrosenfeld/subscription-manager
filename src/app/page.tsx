import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060708] text-neutral-300 flex flex-col items-center justify-center px-5">
      <div className="max-w-lg text-center">
        <p className="text-sm text-neutral-600 uppercase tracking-widest font-semibold mb-4">substack</p>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-100 mb-4">
          You&apos;re probably paying for things you don&apos;t need to.
        </h1>
        <p className="text-neutral-500 text-lg mb-10 leading-relaxed">
          Tell us what you subscribe to. We&apos;ll find every bundle, carrier perk, and card credit you&apos;re leaving on the table.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-7 py-3.5 rounded-xl bg-green-500 text-[#060708] font-semibold text-[15px] hover:bg-green-400 transition-colors"
          >
            Find my savings →
          </Link>
          <Link
            href="/sign-in"
            className="px-7 py-3.5 rounded-xl border border-white/[0.07] text-neutral-400 font-semibold text-[15px] hover:bg-white/[0.04] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
