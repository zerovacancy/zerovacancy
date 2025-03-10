
import { cn } from "@/lib/utils";

export const PricingFAQ = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-center font-bold text-xl text-slate-800 mb-6">Frequently Asked Questions</h3>
      <div className="space-y-4">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-1">Can I upgrade or downgrade my plan later?</h4>
          <p className="text-sm text-slate-600">Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades will apply at the end of your billing cycle.</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-1">Do you offer refunds?</h4>
          <p className="text-sm text-slate-600">We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied, contact our support team within 7 days of purchase.</p>
        </div>
      </div>
    </div>
  );
};
