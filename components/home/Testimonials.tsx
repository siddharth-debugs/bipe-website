import React from "react";
import { getTestimonials } from "@/lib/content";

interface Quote {
  name: string;
  role: string;
  quote: string;
}

function Card({ q }: { q: Quote }) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-mark">&ldquo;</div>
      <p className="testimonial-quote">{q.quote}</p>
      <div className="testimonial-attr">
        <div className="testimonial-name">{q.name}</div>
        <div className="testimonial-role">{q.role}</div>
      </div>
    </article>
  );
}

/**
 * One horizontal strip that loops forever. The children are duplicated
 * so the keyframe can shift exactly -50% and the seam is invisible. The
 * `reverse` flag flips direction; we use it for the second strip so the
 * two flows scroll opposite ways.
 */
function Strip({
  items,
  duration,
  reverse = false,
}: {
  items: Quote[];
  duration: number;
  reverse?: boolean;
}) {
  return (
    <div className="testimonial-strip">
      <div
        className="testimonial-track"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {items.map((q, i) => (
          <Card key={`a-${i}`} q={q} />
        ))}
        {items.map((q, i) => (
          <div key={`b-${i}`} aria-hidden="true" style={{ display: "contents" }}>
            <Card q={q} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const Testimonials = async () => {
  // Split into two staggered strips so the opposing flows don't show
  // identical content side-by-side at any given moment. Pulled from the
  // backend with graceful fallback to lib/data.ts.
  const all = (await getTestimonials()).map((t) => ({
    name: t.name, role: t.role, quote: t.quote,
  }));
  const half = Math.ceil(all.length / 2);
  const stripA = [...all.slice(0, half), ...all.slice(half)];
  const stripB = [...all.slice(half), ...all.slice(0, half)];

  return (
    <section className="section testimonial-section">
      <div className="container">
        <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="eyebrow">Voices · Students & Parents</div>
          <h2 className="bipe-h1" style={{ maxWidth: "22ch", margin: "14px auto 0" }}>
            What families say about <span className="serif">three years</span> at BIPE.
          </h2>
        </div>
      </div>

      <div className="testimonial-marquee">
        <Strip items={stripA} duration={56} />
        <Strip items={stripB} duration={72} reverse />
      </div>
    </section>
  );
};
