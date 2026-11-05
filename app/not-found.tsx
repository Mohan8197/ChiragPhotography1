import { TransitionLink } from "@/components/ui/TransitionLink";

export default function NotFound() {
  return (
    <section data-theme="light" className="flex min-h-[100svh] flex-col justify-center container-x">
      <p className="label text-stone-deep">404</p>
      <h1 className="mt-6 font-serif text-display">
        This frame <em className="italic">didn&apos;t develop.</em>
      </h1>
      <TransitionLink href="/" className="label u-link mt-12 w-fit">
        Back to the studio →
      </TransitionLink>
    </section>
  );
}
