
import { cn } from "@/lib/utils";

export const PricingFAQ = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-center font-bold text-xl text-slate-800 mb-6">CREATIVE CURIOSITIES</h3>
      <div className="space-y-4">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-1">Can I evolve my creative investment tier as my vision expands?</h4>
          <p className="text-sm text-slate-600">Absolutely. Your relationship with the collective is fluid, not fixed. Elevate your creative investment immediately when inspiration calls, or adjust your patronage at the close of your current investment cycle. Your journey with our visionaries adapts to your evolving creative ambitions.</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-1">What if the vision doesn't resonate with my spaces?</h4>
          <p className="text-sm text-slate-600">We believe in the alchemy of creative collaboration. If within seven days your soul doesn't connect with the visual narrative we've crafted together, we'll return your creative investment in full. Simply reach out to our Cultural Liaisons, and they'll orchestrate your creative realignment.</p>
        </div>
      </div>
    </div>
  );
};
