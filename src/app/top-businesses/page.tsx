"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

export default function TopBusinesses() {
  const [cursor, setCursor] = useState<string | null>(null);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const limit = 20;

  const paginatedBusinesses = useQuery(api.businesses.getTop, {
    paginationOpts: { cursor, numItems: limit },
  });

  const displayBusinesses = paginatedBusinesses?.page ?? [];
  const continueCursor = paginatedBusinesses?.continueCursor ?? null;
  const hasNextPage = !(paginatedBusinesses?.isDone ?? true);
  const hasPrevPage = prevCursors.length > 0;

  const handleNext = () => {
    if (continueCursor && !paginatedBusinesses?.isDone) {
      setPrevCursors((prev) => [...prev, cursor!]);
      setCursor(continueCursor);
    }
  };

  const handlePrev = () => {
    if (hasPrevPage) {
      setCursor(prevCursors[prevCursors.length - 1] ?? null);
      setPrevCursors((prev) => prev.slice(0, -1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 min-h-screen"
    >
      <div className="max-w-6xl mx-auto mb-8">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent mb-3">
            Top Businesses by Likes
          </h1>
          <p className="text-purple-300 text-lg">
            Discover the most popular faith-driven businesses
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto">
        {paginatedBusinesses === undefined ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-purple-300"
          >
            Loading...
          </motion.div>
        ) : displayBusinesses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <p className="text-purple-300">
              No businesses yet. Be the first to like one!
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayBusinesses.map(
                (biz: Doc<"businesses">, index: number) => (
                  <motion.div
                    key={biz._id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link href={`/business/${biz.slug}`}>
                      <Card className="bg-purple-900/20 border-purple-500/20 hover:bg-purple-900/30 hover:border-purple-400/30 transition-all cursor-pointer h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <CardTitle className="text-purple-100 text-xl line-clamp-2">
                              {biz.name}
                            </CardTitle>
                            <Badge
                              className={
                                biz.type === "service"
                                  ? "bg-blue-600/50 shrink-0"
                                  : "bg-green-600/50 shrink-0"
                              }
                            >
                              {biz.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {biz.logoUrl && (
                            <motion.img
                              whileHover={{ scale: 1.05 }}
                              src={biz.logoUrl}
                              alt={biz.name}
                              className="w-full h-40 object-cover rounded-lg border border-purple-500/20"
                            />
                          )}
                          <p className="text-purple-300 text-sm line-clamp-3">
                            {biz.description}
                          </p>
                          <div className="flex items-center gap-2 text-purple-400 text-sm">
                            <Heart className="w-4 h-4" />
                            <span>{biz.likes ?? 0} likes</span>
                          </div>
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            View Details →
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )
              )}
            </div>
            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrev}
                disabled={!hasPrevPage}
                variant="outline"
                className="border-purple-500/30 text-purple-200 hover:bg-purple-800/30"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!hasNextPage}
                variant="outline"
                className="border-purple-500/30 text-purple-200 hover:bg-purple-800/30"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
