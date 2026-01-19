import React from "react";
import { Link } from "react-router-dom";
import {Star} from  'lucide-react'

const Homepage = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-100 to-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5">
        <h1 className="text-2xl font-bold text-blue-700">Salesor</h1>

        <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
          <li className="cursor-pointer hover:text-blue-600">Home</li>
          <li className="cursor-pointer hover:text-blue-600">Features</li>
          <li className="cursor-pointer hover:text-blue-600">Resources</li>
          <li className="cursor-pointer hover:text-blue-600">Pricing</li>
          <li className="cursor-pointer hover:text-blue-600">Info</li>
        </ul>

        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-gray-700 font-medium">
            Log in
          </Link>
          <Link
            to="/signup"
            className="bg-black text-white px-4 py-2 rounded-md"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center mt-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Take Control of Your Sales <br />
          Growth with <span className="text-blue-600">Salesor CRM</span>
        </h1>

        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          A simple and powerful CRM SaaS built for small businesses to manage
          leads, track sales pipelines, and make data-driven decisions—all in
          one platform.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/signup"
            className="bg-black text-white px-6 py-3 rounded-md font-medium"
          >
            Get Started
          </Link>
          <button className="border border-gray-400 px-6 py-3 rounded-md font-medium">
            Learn More
          </button>
        </div>

        {/* Social Proof */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            <Star size={28} color="#FFD700" strokeWidth={1.5} />
            <Star size={28} color="#FFD700" strokeWidth={1.5} />
            <Star size={28} color="#FFD700" strokeWidth={1.5} />
            <Star size={28} color="#FFD700" strokeWidth={1.5} />
            <Star size={28} color="#FFD700" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-gray-600">
            Trusted by 1,000+ growing businesses
          </p>
        </div>

        {/* Stats Card */}
        <div className="mt-12 flex justify-center">
          <div className="bg-white shadow-md rounded-xl px-10 py-6 flex gap-10 text-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">200+</h2>
              <p className="text-sm text-gray-500">Companies Using Salesor</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">150+</h2>
              <p className="text-sm text-gray-500">Countries Served</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">2025</h2>
              <p className="text-sm text-gray-500">Founded</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
