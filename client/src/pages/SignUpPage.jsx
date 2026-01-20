import React from 'react';

const SignUpPage = () => {
  return (
    <div className="h-screen w-full bg-[#f0f5ff] flex flex-col overflow-hidden font-sans">
      {/* Header with Logo on the Left */}
      <header className="w-full p-8 md:p-10 absolute top-0 left-0">
        <a href="/" className="text-2xl font-bold text-blue-600 tracking-tight hover:opacity-80 transition-opacity">
          Salesor
        </a>
      </header>

      <main className="flex grow items-center justify-center px-4 mt-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-8 md:p-10 border border-white/50">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Create Account</h1>
            <p className="text-slate-500 text-sm">Join 1,000+ businesses using Salesor.</p>
          </div>

          <form className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">First Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Last Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Work Email</label>
              <input 
                type="email" 
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Password</label>
              <input 
                type="password" 
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <button className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-slate-800 transform active:scale-[0.98] transition-all mt-4 shadow-lg shadow-slate-200">
              Get Started
            </button>
          </form>

          <p className="mt-4 text-[11px] text-slate-400 text-center px-4">
            By signing up, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-500">
              Already have an account? <a href="/login" className="text-blue-600 font-bold hover:underline">Log in</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;