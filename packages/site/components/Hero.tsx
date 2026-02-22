"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-dots opacity-30" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative h-16 w-16">
              <Image
                src="/logo.png"
                alt="Mockario"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight md:text-6xl"
          >
            Mock APIs{" "}
            <span className="text-green-600">rapidinho</span>
            <br />
            desenvolva sem esperar o backend
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 text-lg text-neutral-400 md:text-xl"
          >
            Crie APIs simuladas localmente e acelere seu desenvolvimento front-end.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-600/90 transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="https://github.com/Miguel-Leite/mockario"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 px-6 py-3 font-medium hover:bg-neutral-800 transition-colors"
            >
              GitHub
            </a>
          </motion.div>

          {/* Code block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="inline-block rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 font-mono text-sm">
              <span className="text-green-600">$</span> npx @mockario/mockario start
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
