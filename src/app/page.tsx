"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Sparkles, Building2, TrendingUp } from "lucide-react";

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const floatingVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
      {/* Animated Background Gradients */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Orbs */}
      <motion.div
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl opacity-20"
      />
      <motion.div
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 1, duration: 5 }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full filter blur-3xl opacity-20"
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-purple-800/30 border border-purple-500/30 rounded-full backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-sm text-purple-200 font-medium">
              Faith-Driven Business Platform
            </span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent"
        >
          Welcome to
          <br />
          Christian Business
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-purple-200 mb-12 max-w-2xl leading-relaxed"
        >
          Create and showcase your faith-based business with elegance and
          purpose. Connect with a community that shares your values.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 rounded-full shadow-2xl shadow-purple-500/50 border border-purple-400/30"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-purple-400/50 text-purple-200 hover:bg-purple-800/30 text-lg px-8 py-6 rounded-full backdrop-blur-sm"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
        >
          {[
            {
              icon: Building2,
              title: "Build Your Presence",
              desc: "Create a stunning business profile in minutes",
            },
            {
              icon: Sparkles,
              title: "Shine Bright",
              desc: "Stand out with customizable themes and designs",
            },
            {
              icon: TrendingUp,
              title: "Grow Together",
              desc: "Connect with faith-driven customers and partners",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-6 bg-purple-900/20 border border-purple-500/20 rounded-2xl backdrop-blur-md hover:bg-purple-900/30 hover:border-purple-400/30 transition-all duration-300"
            >
              <feature.icon className="w-12 h-12 text-purple-300 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-purple-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-purple-300">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-950 to-transparent" />
    </div>
  );
}
