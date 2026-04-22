import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQItem = ({ question, answer }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 py-6">
      <button 
        className="w-full flex items-center justify-between text-left group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg md:text-xl font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">
          {question}
        </span>
        <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors ${isOpen ? 'text-primary' : 'text-slate-500'}`}>
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
      </button>
      
      {isOpen && (
        <div className="mt-4 text-slate-400 text-sm leading-relaxed max-w-3xl">
          {answer}
        </div>
      )}
    </div>
  );
};

export const FAQSection = () => {
  const faqs = [
    {
      question: "How long does setup really take?",
      answer: "Most users go from signup to live data ingestion in under 15 minutes. Our AI automatically maps your fields from common audit patterns."
    },
    {
      question: "Can I upgrade or downgrade my tier later?",
      answer: "Yes, you can scale your entry capacity up or down at any time from your dashboard settings. Changes reflect instantly."
    },
    {
      question: "Is my audit data secure?",
      answer: "Absolutely. All TITON systems use military-grade encryption (AES-256) and we are fully SOC2 compliant to ensure your business intelligence stays private."
    },
    {
      question: "Do you offer any setup support?",
      answer: "Our Scaling Pro plan includes a one-on-one concierge setup session to ensure your integration is perfect from day one."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Frequently Asked Questions</h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Common objections addressed</p>
      </div>

      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>
      
      <div className="mt-16 p-8 rounded-3xl bg-primary/5 border border-primary/20 text-center">
         <p className="text-white font-bold mb-4 uppercase tracking-tight">Still have questions?</p>
         <button className="text-primary text-[10px] font-black uppercase tracking-[0.4em] hover:underline">
            Contact Support Intelligence
         </button>
      </div>
    </div>
  );
};
