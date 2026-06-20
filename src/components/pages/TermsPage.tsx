import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone } from "lucide-react";

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
    <div className="bg-white min-h-screen font-sans pt-24 md:pt-28">
      {/* Hero */}
      <section className="hero-gradient py-16 px-4 text-center border-b border-brand-green-100">
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-display">
            Terms of <span className="text-gradient-green">Service</span>
          </h1>
          <p className="text-gray-500 mt-3">
            Last updated: June 2026 · Effective immediately
          </p>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto leading-relaxed">
            Please read these terms carefully before using wastEdge's services. By using our platform, you agree to be bound by these terms.
          </p>
        </div>
      </section>

      {/* Terms content */}
      <section className="max-w-3xl mx-auto px-4 py-14">
        {/* Quick summary */}
        <div className="bg-brand-green-50 border border-brand-green-200 rounded-2xl p-6 mb-10">
          <h2 className="font-black text-brand-green-800 text-lg font-display mb-3">📋 Quick Summary</h2>
          <ul className="space-y-2 text-sm text-brand-green-900">
            {[
              "✅ Free doorstep pickup — no upfront payment required",
              "✅ You get paid instantly on-site before collector leaves",
              "✅ All collectors are verified and background-checked",
              "✅ Your personal data is never sold to third parties",
              "✅ You can cancel anytime before the collector is dispatched",
            ].map(item => (
              <li key={item} className="font-semibold">{item}</li>
            ))}
          </ul>
        </div>

        {/* Full terms */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <div key={i} className="border-b border-gray-100 pb-7 last:border-0">
              <h2 className="text-lg font-black text-gray-900 font-display mb-3">{section.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h3 className="font-black text-gray-900 text-lg font-display mb-2">Contact Us</h3>
          <p className="text-gray-500 text-sm mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2">
            <a href="mailto:legal@wastedge.in" className="flex items-center gap-2.5 text-sm text-brand-green-700 font-semibold hover:underline">
              <Mail size={15} className="text-brand-green-600" />
              legal@wastedge.in
            </a>
            <a href="tel:+919810329454" className="flex items-center gap-2.5 text-sm text-brand-green-700 font-semibold hover:underline">
              <Phone size={15} className="text-brand-green-600" />
              +91 98103 29454
            </a>
          </div>
          <div className="mt-4 p-3 bg-brand-green-50 rounded-xl border border-brand-green-100 text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-700">Registered Address:</strong><br />
            wastEdge Solution India Pvt. Ltd.<br />
            Okhla Industrial Estate, Phase 1,<br />
            New Delhi – 110020
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm mb-4">Ready to recycle responsibly?</p>
          <Link to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green-600 hover:bg-brand-green-700 text-white font-black text-sm rounded-xl shadow-lg shadow-brand-green-200 transition-all">
            Schedule a Pickup <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
