import { TestimonialCard, type Testimonial } from "@/components/ui/testimonial-cards";

const testimonials: Testimonial[] = [
  {
    id: 1,
    testimonial:
      "RH Tech Solutions took a process that used to take our team days and turned it into something that just works.",
    author: "Naledi Khumalo - Operations Lead, Municipal Services",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&fit=crop&crop=faces",
  },
  {
    id: 2,
    testimonial:
      "They didn't just build what we asked for — they pushed back on the parts that didn't make sense and the product is better for it.",
    author: "Jaco van der Merwe - Founder, Private Player",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=256&h=256&fit=crop&crop=faces",
  },
  {
    id: 3,
    testimonial:
      "Our staff and students actually enjoy using the platform, which says a lot. It was built for real people, not just for a demo.",
    author: "Thandiwe Nkosi - Head of IT, School District",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=256&h=256&fit=crop&crop=faces",
  },
];

export function ShuffleCards() {
  return (
    <div className="flex w-full flex-col items-center text-slate-50">
      <div className="mb-14 max-w-xl text-center">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
          What people say
        </span>
        <h3 className="mt-4 font-(family-name:--font-space-grotesk) text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Trusted by the people who use it.
        </h3>
      </div>

      <div className="flex w-full max-w-5xl flex-col gap-5 sm:flex-row">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} {...testimonial} />
        ))}
      </div>
    </div>
  );
}
