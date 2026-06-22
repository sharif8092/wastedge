import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, Shield, FileText } from "lucide-react";

export function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using wastEdge's services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using particular wastEdge services, you shall be subject to any posted guidelines or rules applicable to such services.`
    },
    {
      title: "2. Service Description",
      content: `wastEdge provides an online platform that connects individuals and businesses with verified scrap collectors. Our services include doorstep scrap collection, real-time price quotes, digital weighing, and instant payment settlements via UPI or cash.`
    },
    {
      title: "3. User Responsibilities",
      content: `Users agree to provide accurate and complete information when scheduling pickups. The scrap materials must be legally owned by the user or authorized representative. Users must ensure a safe pickup environment for our collectors. Misrepresentation of scrap quantity or type may result in adjusted pricing.`
    },
    {
      title: "4. Pricing and Payment",
      content: `All prices displayed on our platform are indicative rates based on current market conditions and are subject to change without notice. Final pricing is determined at the time of weighing using our ISO-certified scales. Payment is made immediately on-site before the collector departs. No advance payment is required from users.`
    },
    {
      title: "5. Collector Conduct",
      content: `All wastEdge collectors are background-verified, trained, and equipped with certified digital weighing equipment. Collectors must maintain professional conduct, provide valid identification upon request, and complete assigned pickups in a timely manner. Any grievances can be reported to our support team.`
    },
    {
      title: "6. Cancellation Policy",
      content: `Users may cancel a scheduled pickup at any time before the collector is dispatched. Cancellations after dispatch may incur a small convenience fee. Repeated cancellations without valid reason may result in account restrictions.`
    },
    {
      title: "7. Environmental Commitment",
      content: `wastEdge is committed to responsible recycling practices. All collected materials are processed through certified recycling facilities. We comply with all applicable environmental regulations and maintain records of material disposition. Users contribute directly to reducing landfill waste by using our services.`
    },
    {
      title: "8. Limitation of Liability",
      content: `wastEdge shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use of our services. Our maximum liability for any claim arising from these terms shall not exceed the amount paid by the user in the preceding 30 days.`
    },
    {
      title: "9. Privacy Policy",
      content: `We collect personal information including name, phone number, email, and address solely for the purpose of facilitating scrap pickups and improving our services. We do not sell or share your personal information with third parties without your consent, except as required by law. Data is stored securely and retained only as long as necessary.`
    },
    {
      title: "10. Modifications to Terms",
      content: `wastEdge reserves the right to modify these terms at any time. Changes will be posted on this page with an updated effective date. Continued use of our services after such changes constitutes acceptance of the new terms.`
    },
    {
      title: "11. Governing Law",
      content: `These terms are governed by the laws of India. Any disputes arising from or relating to these terms shall be subject to the exclusive jurisdiction of courts in New Delhi, India.`
    },
  ];

  return (
    <div className="bg-[#050505] min-h-screen font-sans text-gray-100 selection:bg-emerald-500/30">
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-emerald-600/10 rounded-full -translate-y-1/2 blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="max-w-2xl mx-auto relative animate-fade-in-up z-10">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <FileText size={30} className="text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white font-display tracking-tight leading-tight">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-sm">Service</span>
          </h1>
          <p className="text-gray-400 mt-4 text-sm font-medium tracking-widest uppercase">
            Last updated: June 2026 · Effective immediately
          </p>
          <p className="text-gray-400 mt-4 max-w-lg mx-auto leading-relaxed">
            Please read these terms carefully before using wastEdge's services. By using our platform, you agree to be bound by these terms.
          </p>
        </div>
      </section>

      {/* Terms content */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        
        {/* Quick summary */}
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-8 mb-12 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
          <h2 className="font-black text-emerald-400 text-lg font-display mb-4 flex items-center gap-2">
            <Shield size={20} /> Quick Summary
          </h2>
          <ul className="space-y-3 text-sm text-gray-300">
            {[
              "Free doorstep pickup — no upfront payment required",
              "You get paid instantly on-site before collector leaves",
              "All collectors are verified and background-checked",
              "Your personal data is never sold to third parties",
              "You can cancel anytime before the collector is dispatched",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-emerald-400 mt-0.5">✅</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Full terms */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="border-b border-white/5 pb-10 last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-white font-display mb-4 tracking-tight">{section.title}</h2>
              <p className="text-gray-400 text-[15px] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-16 bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 relative overflow-hidden group hover:border-emerald-500/20 transition-colors">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
          <h3 className="font-black text-white text-xl font-display mb-3 relative z-10">Have questions about our terms?</h3>
          <p className="text-gray-400 text-sm mb-6 relative z-10">Our legal and support team is here to help you understand your rights and our obligations.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <a href="mailto:legal@wastedge.in" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">
              <Mail size={16} className="text-emerald-400" />
              legal@wastedge.in
            </a>
            <a href="tel:18001234567" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">
              <Phone size={16} className="text-emerald-400" />
              1800-123-4567
            </a>
          </div>
        </div>

      </section>
    </div>
  );
}
