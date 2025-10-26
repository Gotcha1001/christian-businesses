// "use client";

// import { useState } from "react";
// import { useQuery } from "convex/react";
// import { api } from "../../../convex/_generated/api";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { Search, Filter, Building2, Package } from "lucide-react";

// export default function Feed() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [typeFilter, setTypeFilter] = useState<string>("all");
//   const [showFilters, setShowFilters] = useState(false);

//   const allBusinesses = useQuery(api.businesses.getAll, {
//     type: typeFilter !== "all" ? typeFilter : undefined,
//   });
//   const searchedBusinesses = useQuery(api.businesses.search, {
//     query: searchQuery,
//     type: typeFilter !== "all" ? typeFilter : undefined,
//   });

//   const businesses = searchQuery ? searchedBusinesses : allBusinesses;

//   // No need for additional filtering since we pass type to the query
//   const displayBusinesses = businesses;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="container mx-auto p-6 min-h-screen"
//     >
//       {/* Header */}
//       <div className="max-w-6xl mx-auto mb-8">
//         <motion.div
//           initial={{ y: -20 }}
//           animate={{ y: 0 }}
//           className="text-center mb-8"
//         >
//           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent mb-3">
//             Discover Faith-Driven Businesses
//           </h1>
//           <p className="text-purple-300 text-lg">
//             Connect with Christian entrepreneurs and their amazing ventures
//           </p>
//         </motion.div>

//         {/* Search and Filter Bar */}
//         <Card className="bg-purple-900/20 border-purple-500/20 backdrop-blur-sm">
//           <CardContent className="p-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               {/* Search Input */}
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
//                 <Input
//                   placeholder="Search businesses by name, type, or description..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
//                 />
//               </div>

//               {/* Filter Toggle Button */}
//               <Button
//                 onClick={() => setShowFilters(!showFilters)}
//                 variant="outline"
//                 className="border-purple-500/30 text-purple-200 hover:bg-purple-800/30 h-12 md:w-auto"
//               >
//                 <Filter className="w-5 h-5 mr-2" />
//                 Filters
//               </Button>
//             </div>

//             {/* Filter Options */}
//             {showFilters && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: "auto", opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 className="mt-4 pt-4 border-t border-purple-500/20"
//               >
//                 <div className="flex flex-col md:flex-row gap-4">
//                   <div className="flex-1">
//                     <label className="text-purple-200 text-sm mb-2 block">
//                       Business Type
//                     </label>
//                     <Select value={typeFilter} onValueChange={setTypeFilter}>
//                       <SelectTrigger className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12">
//                         <SelectValue placeholder="All Types" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-purple-950 border-purple-500/30">
//                         <SelectItem value="all" className="text-purple-100">
//                           All Types
//                         </SelectItem>
//                         <SelectItem value="service" className="text-purple-100">
//                           Service-Based
//                         </SelectItem>
//                         <SelectItem
//                           value="products"
//                           className="text-purple-100"
//                         >
//                           Product-Based
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex items-end">
//                     <Button
//                       onClick={() => {
//                         setSearchQuery("");
//                         setTypeFilter("all");
//                       }}
//                       variant="outline"
//                       className="border-purple-500/30 text-purple-200 hover:bg-purple-800/30 h-12"
//                     >
//                       Clear All
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Results Count */}
//         <div className="mt-4 text-purple-300 text-sm">
//           {displayBusinesses === undefined
//             ? "Loading businesses..."
//             : `Showing ${displayBusinesses.length} ${displayBusinesses.length === 1 ? "business" : "businesses"}`}
//         </div>
//       </div>

//       {/* Business Grid */}
//       <div className="max-w-6xl mx-auto">
//         {displayBusinesses === undefined ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//               <Card
//                 key={i}
//                 className="bg-purple-900/20 border-purple-500/20 animate-pulse"
//               >
//                 <CardHeader>
//                   <div className="h-6 bg-purple-800/30 rounded w-3/4 mb-2"></div>
//                   <div className="h-4 bg-purple-800/30 rounded w-1/2"></div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="h-20 bg-purple-800/30 rounded mb-4"></div>
//                   <div className="h-32 bg-purple-800/30 rounded"></div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         ) : displayBusinesses.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center py-16"
//           >
//             <div className="bg-purple-900/20 border-2 border-dashed border-purple-500/30 rounded-2xl p-12 max-w-md mx-auto">
//               <Building2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
//               <h3 className="text-2xl text-purple-100 font-semibold mb-2">
//                 No Businesses Found
//               </h3>
//               <p className="text-purple-300 mb-6">
//                 {searchQuery
//                   ? "Try adjusting your search or filters"
//                   : "Be the first to create a business!"}
//               </p>
//               <Link href="/create-business">
//                 <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
//                   Create Your Business
//                 </Button>
//               </Link>
//             </div>
//           </motion.div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {displayBusinesses.map((biz, index) => (
//               <motion.div
//                 key={biz._id}
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: index * 0.1 }}
//                 whileHover={{ y: -5 }}
//               >
//                 <Link href={`/business/${biz.slug}`}>
//                   <Card className="bg-purple-900/20 border-purple-500/20 hover:bg-purple-900/30 hover:border-purple-400/30 transition-all cursor-pointer h-full">
//                     <CardHeader>
//                       <div className="flex items-start justify-between gap-3 mb-3">
//                         <CardTitle className="text-purple-100 text-xl line-clamp-2">
//                           {biz.name}
//                         </CardTitle>
//                         <Badge
//                           className={
//                             biz.type === "service"
//                               ? "bg-blue-600/50 shrink-0"
//                               : "bg-green-600/50 shrink-0"
//                           }
//                         >
//                           {biz.type === "service" ? (
//                             <Building2 className="w-3 h-3 mr-1" />
//                           ) : (
//                             <Package className="w-3 h-3 mr-1" />
//                           )}
//                           {biz.type}
//                         </Badge>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       {/* Logo */}
//                       {biz.logoUrl && (
//                         <motion.img
//                           whileHover={{ scale: 1.05 }}
//                           src={biz.logoUrl}
//                           alt={biz.name}
//                           className="w-full h-40 object-cover rounded-lg border border-purple-500/20"
//                         />
//                       )}

//                       {/* Description */}
//                       <p className="text-purple-300 text-sm line-clamp-3">
//                         {biz.description}
//                       </p>

//                       {/* Products Count */}
//                       {biz.products && biz.products.length > 0 && (
//                         <div className="flex items-center gap-2 text-purple-400 text-sm">
//                           <Package className="w-4 h-4" />
//                           <span>
//                             {biz.products.length}{" "}
//                             {biz.products.length === 1 ? "Product" : "Products"}
//                           </span>
//                         </div>
//                       )}

//                       {/* View Details Button */}
//                       <Button
//                         className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           window.location.href = `/business/${biz.slug}`;
//                         }}
//                       >
//                         View Details →
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 </Link>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Building2,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationResult {
  results: Doc<"businesses">[];
  nextCursor: string | null;
}

export default function Feed() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const limit = 9;

  // Reset cursor when search or filter changes
  useEffect(() => {
    setCursor(null);
    setPrevCursors([]);
  }, [searchQuery, typeFilter]);

  // FIXED: Properly handle query arguments with correct types
  const queryArgs = searchQuery
    ? {
        query: searchQuery,
        type: typeFilter !== "all" ? typeFilter : undefined,
        cursor: cursor ?? undefined, // Convert null to undefined
        limit,
      }
    : {
        type: typeFilter !== "all" ? typeFilter : undefined,
        cursor: cursor ?? undefined, // Convert null to undefined
        limit,
      };

  const paginatedBusinesses = useQuery(
    searchQuery ? api.businesses.search : api.businesses.getAll,
    queryArgs
  ) as PaginationResult | undefined;

  const displayBusinesses = paginatedBusinesses?.results || [];

  const nextCursor = paginatedBusinesses?.nextCursor;
  const prevCursor = prevCursors[prevCursors.length - 1] || null;
  const hasPrevPage = prevCursors.length > 0;
  const hasNextPage = !!nextCursor;

  const handleNext = () => {
    if (nextCursor) {
      setPrevCursors((prev) => [...prev, cursor!]);
      setCursor(nextCursor);
    }
  };

  const handlePrev = () => {
    if (hasPrevPage) {
      setCursor(prevCursor);
      setPrevCursors((prev) => prev.slice(0, -1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 min-h-screen"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent mb-3">
            Discover Faith-Driven Businesses
          </h1>
          <p className="text-purple-300 text-lg">
            Connect with Christian entrepreneurs and their amazing ventures
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <Card className="bg-purple-900/20 border-purple-500/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input
                  placeholder="Search businesses by name, type, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
                />
              </div>

              {/* Filter Toggle Button */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="border-purple-500/30 text-purple-200 hover:bg-purple-800/30 h-12 md:w-auto"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-purple-500/20"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-purple-200 text-sm mb-2 block">
                      Business Type
                    </label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-950 border-purple-500/30">
                        <SelectItem value="all" className="text-purple-100">
                          All Types
                        </SelectItem>
                        <SelectItem value="service" className="text-purple-100">
                          Service-Based
                        </SelectItem>
                        <SelectItem
                          value="products"
                          className="text-purple-100"
                        >
                          Product-Based
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setTypeFilter("all");
                      }}
                      variant="outline"
                      className="border-purple-500/30 text-purple-200 hover:bg-purple-800/30 h-12"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mt-4 text-purple-300 text-sm">
          {paginatedBusinesses === undefined
            ? "Loading businesses..."
            : `Showing ${displayBusinesses.length} businesses (page ${prevCursors.length + 1})`}
        </div>
      </div>

      {/* Business Grid */}
      <div className="max-w-6xl mx-auto">
        {paginatedBusinesses === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <Card
                key={i}
                className="bg-purple-900/20 border-purple-500/20 animate-pulse"
              >
                <CardHeader>
                  <div className="h-6 bg-purple-800/30 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-purple-800/30 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-purple-800/30 rounded mb-4"></div>
                  <div className="h-32 bg-purple-800/30 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : displayBusinesses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-purple-900/20 border-2 border-dashed border-purple-500/30 rounded-2xl p-12 max-w-md mx-auto">
              <Building2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl text-purple-100 font-semibold mb-2">
                No Businesses Found
              </h3>
              <p className="text-purple-300 mb-6">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Be the first to create a business!"}
              </p>
              <Link href="/create-business">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Create Your Business
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                              {biz.type === "service" ? (
                                <Building2 className="w-3 h-3 mr-1" />
                              ) : (
                                <Package className="w-3 h-3 mr-1" />
                              )}
                              {biz.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Logo */}
                          {biz.logoUrl && (
                            <motion.img
                              whileHover={{ scale: 1.05 }}
                              src={biz.logoUrl}
                              alt={biz.name}
                              className="w-full h-40 object-cover rounded-lg border border-purple-500/20"
                            />
                          )}

                          {/* Description */}
                          <p className="text-purple-300 text-sm line-clamp-3">
                            {biz.description}
                          </p>

                          {/* Products Count */}
                          {biz.products && biz.products.length > 0 && (
                            <div className="flex items-center gap-2 text-purple-400 text-sm">
                              <Package className="w-4 h-4" />
                              <span>
                                {biz.products.length}{" "}
                                {biz.products.length === 1
                                  ? "Product"
                                  : "Products"}
                              </span>
                            </div>
                          )}

                          {/* View Details Button */}
                          <Button
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/business/${biz.slug}`;
                            }}
                          >
                            View Details →
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )
              )}
            </div>

            {/* Pagination Controls */}
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
