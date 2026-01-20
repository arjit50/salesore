import React from 'react';

const LoginPage = () => {
  return (
    <div className="h-screen w-full bg-[#f0f5ff] flex flex-col overflow-hidden font-sans">
      {/* Header with Logo on the Left */}
      <header className="w-full p-8 md:p-10 absolute top-0 left-0">
        <a href="/" className="text-2xl font-bold text-blue-600 tracking-tight hover:opacity-80 transition-opacity">
          Salesor
        </a>
      </header>

      {/* Main Content Area */}
      <main className="grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-8 md:p-10 border border-white/50">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm">Log in to manage your sales growth.</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 ml-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot?</a>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-slate-800 transform active:scale-[0.98] transition-all mt-2 shadow-lg shadow-slate-200">
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px grow bg-slate-100"></div>
            <span className="text-xs font-bold text-slate-300 uppercase">Or</span>
            <div className="h-px grow bg-slate-100"></div>
          </div>

          {/* <button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-3.5 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700">
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
            <span className="text-sm">Sign in with Google</span>
          </button> */}

          {/* Redirect link at the bottom of the card */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <a href="/signup" className="text-blue-600 font-bold hover:underline">Sign up for free</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;