import { SplitReveal } from "@/components/motion/SplitReveal";

export function Contact() {
  const message = encodeURIComponent("Hello Chirag Photography, I would like to enquire about photography for my event.");
  return (
    <section id="contact" data-theme="dark" className="bg-charcoal container-x pt-[18vh] pb-[12vh] text-paper">
      <p className="label text-stone">(08) — Inquire</p>
      <SplitReveal as="h2" className="mt-8 font-serif text-display">
        Let&apos;s capture your <em className="italic text-champagne">celebration.</em>
      </SplitReveal>
      <div className="grid-12 mt-20 gap-y-16 md:mt-28">
        <aside className="col-span-12 space-y-10 md:col-span-4">
          <div>
            <p className="label text-stone">Location</p>
            <p className="mt-3 text-paper/85">Bengaluru, Karnataka, India</p>
          </div>
          <div>
            <p className="label text-stone">WhatsApp / Call</p>
            <a href="https://wa.me/919036343493" className="u-link mt-3 block w-fit font-serif text-3xl">+91 90363 43493</a>
          </div>
          <div>
            <p className="label text-stone">Follow our work</p>
            <a href="https://www.instagram.com/chirag__photography.__/" target="_blank" rel="noreferrer" className="u-link mt-3 block w-fit text-paper/85">@chirag__photography.__</a>
          </div>
        </aside>
        <div className="col-span-12 flex flex-col items-start justify-center md:col-span-7 md:col-start-6">
          <p className="max-w-[42ch] text-lg text-paper/75">Tell us about your wedding, birthday or event. Tap below to start a WhatsApp conversation with Chirag Photography.</p>
          <a href={`https://wa.me/919036343493?text=${message}`} target="_blank" rel="noreferrer" className="mt-10 grid size-36 place-items-center rounded-full bg-paper text-ink transition-colors duration-500 hover:bg-champagne">
            <span className="label">Send enquiry ↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
