import Navbar from "../components/Navbar";

export const Pricing = () => (
  /* Use overflow-y-auto for mobile, md:overflow-hidden for desktop */
  <div className="min-h-screen md:h-screen w-full bg-[#f0f5ff] flex flex-col overflow-y-auto md:overflow-hidden font-sans">
    <Navbar />
    
    {/* py-12 on mobile ensures you can scroll to the bottom-most card */}
    <section className="flex grow flex-col justify-center items-center max-w-7xl mx-auto px-6 py-12 md:py-0 text-center">
      
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-slate-900 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-500 font-medium">
          Join 1,000+ growing businesses. Scale as you go.
        </p>
      </div>

      {/* Grid: 1 column on mobile, 3 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-5xl w-full mx-auto items-stretch">
        
        {/* Free Plan */}
        <div className="bg-white p-8 md:p-6 rounded-3xl border border-slate-100 shadow-lg flex flex-col">
          <h3 className="text-xl font-bold mb-1">Free</h3>
          <div className="text-3xl font-extrabold mb-4">$0<span className="text-sm text-slate-400 font-normal">/mo</span></div>
          <ul className="text-slate-600 text-sm space-y-3 mb-8 md:mb-6 text-left flex-grow">
            <li>✓ Up to 100 leads</li>
            <li>✓ Basic CRM features</li>
            <li>✓ 1 User account</li>
          </ul>
          <button className="w-full py-3 md:py-2.5 rounded-xl font-bold border-2 border-slate-100 hover:bg-slate-50 transition-all">
            Get Started
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white p-8 md:p-6 rounded-3xl border-2 border-blue-600 shadow-2xl relative transform md:scale-105 z-10 flex flex-col">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Popular
          </div>
          <h3 className="text-xl font-bold mb-1 text-blue-600">Pro</h3>
          <div className="text-3xl font-extrabold mb-4 text-slate-900">$29<span className="text-sm text-slate-400 font-normal text-slate-600">/mo</span></div>
          <ul className="text-slate-600 text-sm space-y-3 mb-8 md:mb-6 text-left flex-grow">
            <li>✓ Unlimited leads</li>
            <li>✓ Advanced Analytics</li>
            <li>✓ Up to 10 Team members</li>
            <li>✓ Email Integration</li>
          </ul>
          <button className="w-full py-3 md:py-2.5 rounded-xl font-bold bg-black text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            Go Pro
          </button>
        </div>

        {/* Enterprise */}
        <div className="bg-white p-8 md:p-6 rounded-3xl border border-slate-100 shadow-lg flex flex-col">
          <h3 className="text-xl font-bold mb-1 text-slate-800">Enterprise</h3>
          <div className="text-3xl font-extrabold mb-4 text-slate-900">$99<span className="text-sm text-slate-400 font-normal">/mo</span></div>
          <ul className="text-slate-600 text-sm space-y-3 mb-8 md:mb-6 text-left flex-grow">
            <li>✓ Custom Workflows</li>
            <li>✓ Dedicated Support</li>
            <li>✓ API Access</li>
            <li>✓ Unlimited Users</li>
          </ul>
          <button className="w-full py-3 md:py-2.5 rounded-xl font-bold border-2 border-slate-100 hover:bg-slate-50 transition-all text-slate-700">
            Contact Sales
          </button>
        </div>
      </div>

      <p className="mt-10 md:mt-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        14-day free trial • No credit card required
      </p>
    </section>
  </div>
);






export const Info = () => (

  <div className="min-h-screen md:h-screen w-full bg-[#f0f5ff] flex flex-col overflow-y-auto md:overflow-hidden font-sans">
    <Navbar />
    
    {/* py-12 on mobile ensures content doesn't touch the very top/bottom edges */}
    <main className="flex-grow flex items-center justify-center px-6 py-12 md:py-0">
      <section className="max-w-5xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Empowering Small Businesses to Scale
          </h1>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto">
          <p className="text-base md:text-lg text-slate-600 leading-relaxed text-center mb-8">
            Salesor was founded in 2025 with a single mission: to provide small and medium 
            businesses with the same high-powered tools used by giants, without the 
            complexity or high costs.
          </p>

          {/* Cards Grid: 1 column on mobile, 2 columns on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-600 text-white p-7 rounded-[2rem] shadow-xl shadow-blue-200/50">
              <h3 className="text-xl font-bold mb-2">Our Vision</h3>
              <p className="text-blue-50 leading-relaxed text-sm">
                To be the world’s most intuitive CRM, where data becomes 
                action in a single click. We bridge the gap between effort and results.
              </p>
            </div>

            <div className="bg-white p-7 rounded-[2rem] shadow-xl shadow-blue-100/50 border border-white">
              <h3 className="text-xl font-bold mb-2 text-blue-600">Our Impact</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                Helping over 1,000 companies grow their revenue by an average 
                of 35% in their first year through automated pipelines.
              </p>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed text-center max-w-2xl mx-auto text-sm italic px-4">
            "We believe that software should work for you, not the other way around. 
            Every feature is designed to help you focus on building relationships."
          </p>
        </div>
      </section>
    </main>

    {/* Footer - Hidden or adjusted for mobile if it takes too much space */}
    <div className="py-8 text-center mt-auto">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2025 Salesor CRM Inc.</span>
    </div>
  </div>
);




export const Contact = () => (
  <div className="min-h-screen bg-[#f0f5ff]">
    <Navbar />
    <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
      <div>
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Get in touch</h1>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Have questions about our CRM or need technical support? Our team is here to help you 24/7.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">✉️</div>
            support@salesor.com
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">📍</div>
            San Francisco, CA
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-white">
        <form className="space-y-5">
          <input type="text" placeholder="Full Name" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-100" />
          <input type="email" placeholder="Work Email" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-100" />
          <textarea placeholder="How can we help?" rows="4" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-100"></textarea>
          <button className="w-full bg-black text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg">Send Message</button>
        </form>
      </div>
    </div>
  </div>
);