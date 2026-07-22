"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";

export default function Login() {
  return (
    <PageTransition>
      <div className="min-h-screen w-full flex items-center justify-center p-md relative overflow-hidden bg-background">
        {/* Decorative background elements */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full top-[-10%] left-[-10%] -z-10"
          style={{ background: "radial-gradient(circle, rgba(160, 202, 255, 0.15) 0%, rgba(238, 244, 255, 0) 70%)", filter: "blur(80px)" }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full bottom-[-10%] right-[-10%] -z-10"
          style={{ background: "radial-gradient(circle, rgba(160, 202, 255, 0.15) 0%, rgba(238, 244, 255, 0) 70%)", filter: "blur(80px)" }}
        />

        <main className="w-full max-w-[440px] z-10">
          {/* Brand Identity Container */}
          <div className="flex flex-col items-center mb-xl space-y-md animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
              </div>
              <span className="font-display-lg-mobile text-display-lg-mobile font-bold text-on-background tracking-tight">Pathwise</span>
            </div>
            <div className="px-md py-1 bg-surface-container-low rounded-full border border-outline-variant/30">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Join 12,000+ students improving their scores</p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-surface-container-lowest border border-bordermist rounded-xl p-xl shadow-none transition-all duration-300">
            <div className="mb-xl text-center">
              <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">Welcome</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Please enter your details to continue</p>
            </div>

            <form className="space-y-lg" onSubmit={(e) => e.preventDefault()}>
              {/* Email Field */}
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                  <input 
                    className="w-full h-12 pl-12 pr-md bg-white border border-bordermist rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                    id="email" 
                    placeholder="name@email.com" 
                    type="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-xs">
                <div className="flex justify-between items-center px-1">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
                  <Link href="#" className="font-label-sm text-label-sm text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    className="w-full h-12 pl-12 pr-md bg-white border border-bordermist rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                  />
                  <button className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant" type="button">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Link href="/dashboard" passHref>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 bg-[#2F6FB0] text-white rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-all mt-6"
                >
                  Log In
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </motion.button>
              </Link>

              {/* Divider */}
              <div className="relative py-md">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-bordermist"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-surface-container-lowest px-md font-label-sm text-outline-variant">Or continue with</span>
                </div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-md">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 h-12 border border-bordermist rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors group"
                >
                  <img className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQZRjsrR-mDZ1NWjnFVFYUHk4TOv8QNknIDgHrIkF2CBOPry13WMyWbKIHIjVnYsIJ5pjGJtKE9agQU9lVtPc4aOr2UrO4yALATLcbC5XJcdaHk6djWeZ9Lgc5eV7otVUkSMXMxGojFZaC8_GHPsNyV2_5mNFdD8gxholawe0fhAuVN4KTnGHlEFzg3bekIjIg75f9ULr81WMgjRdbHcfzFaCNw2n4Gf_WD3Zj9ZAJNpzjN4PlabexZkQ62lCuV6GWCVUOmjwJcNYY" alt="Google" />
                  Google
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 h-12 border border-bordermist rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>apps</span>
                  Apple
                </motion.button>
              </div>
            </form>
          </div>

          {/* Footer Link */}
          <p className="mt-lg text-center font-body-md text-body-md text-on-surface-variant">
            Don't have an account? <Link href="/onboarding" className="font-bold text-on-background hover:text-primary transition-colors">Sign up</Link>
          </p>

          {/* Legal Links */}
          <div className="mt-xl flex justify-center gap-lg font-label-sm text-label-sm text-outline-variant">
            <Link href="#" className="hover:text-on-surface-variant">Terms of Service</Link>
            <Link href="#" className="hover:text-on-surface-variant">Privacy Policy</Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
