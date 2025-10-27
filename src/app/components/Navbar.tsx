"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-50 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 border-b border-purple-700/30 shadow-2xl"
    >
      {/* Logo/Brand */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent"
        >
          Christian Business
        </Link>
      </motion.div>

      {/* Navigation Links & Auth */}
      <div className="flex items-center gap-6">
        <SignedIn>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/feed"
              className="mr-4 text-purple-200 hover:text-purple-100 transition-colors duration-200 font-medium"
            >
              Feed
            </Link>
          </motion.div>
          <motion.div /* ... */>
            <Link
              href="/top-businesses"
              className="text-purple-200 hover:text-purple-100 transition-colors duration-200 font-medium"
            >
              Top Businesses
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/create-business"
              className="text-purple-200 hover:text-purple-100 transition-colors duration-200 font-medium"
            >
              Create Business
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            whileHover={{ scale: 1.1 }}
          >
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-10 h-10 ring-2 ring-purple-400/50 hover:ring-purple-300 transition-all",
                  userButtonPopoverCard:
                    "bg-purple-950 border border-purple-700/50",
                  userButtonPopoverActionButton: "hover:bg-purple-800",
                },
              }}
            />
          </motion.div>
        </SignedIn>

        <SignedOut>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/50 transition-all duration-300"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </motion.div>
        </SignedOut>
      </div>
    </motion.nav>
  );
}
