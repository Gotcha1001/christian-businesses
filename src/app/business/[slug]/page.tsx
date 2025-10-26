// // src/app/business/[slug]/page.tsx
// "use client";

// import { useQuery } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
// import { useParams } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { motion } from "framer-motion";

// export default function BusinessPage() {
//   const { slug } = useParams();
//   const business = useQuery(api.businesses.getBySlug, { slug: slug as string }); // Add getBySlug query in convex/businesses.ts

//   if (!business) return <div>Loading...</div>;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="container mx-auto p-6"
//     >
//       <Card className="max-w-4xl mx-auto bg-purple-900/20 border-purple-500/20">
//         <CardHeader>
//           <CardTitle className="text-3xl text-purple-100">
//             {business.name}
//           </CardTitle>
//           <Badge className="mt-2">{business.type}</Badge>
//         </CardHeader>
//         <CardContent>
//           <img
//             src={business.logoUrl}
//             alt={business.name}
//             className="w-48 mb-4"
//           />
//           <p className="text-purple-300 mb-4">{business.description}</p>
//           <div className="mb-4">
//             <h3 className="text-xl text-purple-100">Contact</h3>
//             <p>Address: {business.contact.address}</p>
//             <p>Email: {business.contact.email}</p>
//             <p>Phone: {business.contact.phone}</p>
//           </div>
//           <div>
//             <h3 className="text-xl text-purple-100 mb-2">Products</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {business.products.map((prod, i) => (
//                 <Card key={i} className="p-4 bg-purple-800/30">
//                   <img
//                     src={prod.imageUrl}
//                     alt={prod.name}
//                     className="w-32 mb-2"
//                   />
//                   <p className="text-purple-100">
//                     {prod.name} - ${prod.price}
//                   </p>
//                   {prod.description && (
//                     <p className="text-purple-300">{prod.description}</p>
//                   )}
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }
// src/app/business/[slug]/page.tsx
// "use client";

// import { useQuery } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
// import { useParams } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { motion } from "framer-motion";
// import { Mail, Phone, MapPin, ShoppingBag } from "lucide-react";

// export default function BusinessPage() {
//   const { slug } = useParams();
//   const business = useQuery(api.businesses.getBySlug, {
//     slug: slug as string,
//   });

//   if (business === undefined) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="text-purple-200 text-xl"
//         >
//           Loading...
//         </motion.div>
//       </div>
//     );
//   }

//   if (business === null) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl text-purple-100 mb-2">Business Not Found</h2>
//           <p className="text-purple-300">
//             This business doesn&apos;t exist or has been removed.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="container mx-auto p-6 min-h-screen"
//     >
//       <Card className="max-w-5xl mx-auto bg-purple-900/20 border-purple-500/20 backdrop-blur-sm">
//         <CardHeader>
//           <div className="flex items-start justify-between flex-wrap gap-4">
//             <div className="flex items-center gap-4">
//               {business.logoUrl && (
//                 <motion.img
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   src={business.logoUrl}
//                   alt={business.name}
//                   className="w-24 h-24 object-cover rounded-lg border-2 border-purple-500/30"
//                 />
//               )}
//               <div>
//                 <CardTitle className="text-4xl text-purple-100 mb-2">
//                   {business.name}
//                 </CardTitle>
//                 <Badge className="bg-purple-600/50">{business.type}</Badge>
//               </div>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-8">
//           {/* Description */}
//           <div>
//             <h3 className="text-2xl text-purple-100 mb-3 font-semibold">
//               About
//             </h3>
//             <p className="text-purple-300 text-lg leading-relaxed">
//               {business.description}
//             </p>
//           </div>

//           {/* Contact Information */}
//           <div className="bg-purple-950/30 rounded-lg p-6 border border-purple-500/20">
//             <h3 className="text-2xl text-purple-100 mb-4 font-semibold">
//               Contact Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="flex items-start gap-3">
//                 <MapPin className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
//                 <div>
//                   <p className="text-purple-200 font-medium">Address</p>
//                   <p className="text-purple-300">
//                     {business.contact.address || "Not provided"}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <Mail className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
//                 <div>
//                   <p className="text-purple-200 font-medium">Email</p>
//                   <a
//                     href={`mailto:${business.contact.email}`}
//                     className="text-purple-300 hover:text-purple-200 transition-colors"
//                   >
//                     {business.contact.email || "Not provided"}
//                   </a>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <Phone className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
//                 <div>
//                   <p className="text-purple-200 font-medium">Phone</p>
//                   <a
//                     href={`tel:${business.contact.phone}`}
//                     className="text-purple-300 hover:text-purple-200 transition-colors"
//                   >
//                     {business.contact.phone || "Not provided"}
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Products Section */}
//           {business.products && business.products.length > 0 && (
//             <div>
//               <h3 className="text-2xl text-purple-100 mb-6 font-semibold flex items-center gap-2">
//                 <ShoppingBag className="w-6 h-6" />
//                 Products & Services
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {business.products.map((prod, i) => (
//                   <motion.div
//                     key={i}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.1 }}
//                   >
//                     <Card className="p-4 bg-purple-800/30 border-purple-500/20 hover:bg-purple-800/40 transition-all h-full">
//                       {prod.imageUrl && (
//                         <img
//                           src={prod.imageUrl}
//                           alt={prod.name}
//                           className="w-full h-40 object-cover rounded-lg mb-4"
//                         />
//                       )}
//                       <h4 className="text-xl font-semibold text-purple-100 mb-2">
//                         {prod.name}
//                       </h4>
//                       <p className="text-2xl font-bold text-purple-200 mb-2">
//                         ${prod.price.toFixed(2)}
//                       </p>
//                       {prod.description && (
//                         <p className="text-purple-300 text-sm">
//                           {prod.description}
//                         </p>
//                       )}
//                     </Card>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {(!business.products || business.products.length === 0) && (
//             <div className="text-center py-8">
//               <p className="text-purple-300">
//                 No products or services listed yet.
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }

"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Edit,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function BusinessPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const business = useQuery(api.businesses.getBySlug, {
    slug: slug as string,
  });
  const currentUser = useQuery(api.users.get);

  // Check if current user owns this business
  const isOwner =
    currentUser && business && business.userId === currentUser.clerkId;

  if (business === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-purple-200 text-xl"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (business === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-purple-100 mb-2">Business Not Found</h2>
          <p className="text-purple-300">
            This business doesn&apos;t exist or has been removed.
          </p>
          <Button
            onClick={() => router.push("/feed")}
            className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600"
          >
            Back to Feed
          </Button>
        </div>
      </div>
    );
  }

  // Social media links array
  const socialLinks = [
    {
      name: "Website",
      url: business.contact.website,
      icon: Globe,
      color: "text-blue-400",
    },
    {
      name: "Facebook",
      url: business.socialLinks?.facebook,
      icon: Facebook,
      color: "text-blue-500",
    },
    {
      name: "Instagram",
      url: business.socialLinks?.instagram,
      icon: Instagram,
      color: "text-pink-500",
    },
    {
      name: "LinkedIn",
      url: business.socialLinks?.linkedin,
      icon: Linkedin,
      color: "text-blue-600",
    },
    {
      name: "Twitter",
      url: business.socialLinks?.twitter,
      icon: Twitter,
      color: "text-sky-400",
    },
    {
      name: "YouTube",
      url: business.socialLinks?.youtube,
      icon: Youtube,
      color: "text-red-500",
    },
  ].filter((link) => link.url); // Only show links that exist

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 min-h-screen"
    >
      <Card className="max-w-5xl mx-auto bg-purple-900/20 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {business.logoUrl && (
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  src={business.logoUrl}
                  alt={business.name}
                  className="w-24 h-24 object-cover rounded-lg border-2 border-purple-500/30"
                />
              )}
              <div>
                <CardTitle className="text-4xl text-purple-100 mb-2">
                  {business.name}
                </CardTitle>
                <Badge className="bg-purple-600/50">{business.type}</Badge>
              </div>
            </div>

            {/* Edit Button - Only visible to owner */}
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                  onClick={() => router.push("/create-business")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Business
                </Button>
              </motion.div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Description */}
          <div>
            <h3 className="text-2xl text-purple-100 mb-3 font-semibold">
              About
            </h3>
            <p className="text-purple-300 text-lg leading-relaxed">
              {business.description}
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-purple-950/30 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-2xl text-purple-100 mb-4 font-semibold">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-purple-200 font-medium">Address</p>
                  <p className="text-purple-300">
                    {business.contact.address || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-purple-200 font-medium">Email</p>
                  <a
                    href={`mailto:${business.contact.email}`}
                    className="text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    {business.contact.email || "Not provided"}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-purple-200 font-medium">Phone</p>
                  <a
                    href={`tel:${business.contact.phone}`}
                    className="text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    {business.contact.phone || "Not provided"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          {socialLinks.length > 0 && (
            <div className="bg-purple-950/30 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-2xl text-purple-100 mb-4 font-semibold">
                Connect With Us
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-800/30 hover:bg-purple-800/50 rounded-lg border border-purple-500/20 transition-all"
                    >
                      <Icon className={`w-5 h-5 ${link.color}`} />
                      <span className="text-purple-200">{link.name}</span>
                      <ExternalLink className="w-3 h-3 text-purple-400" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Products Section */}
          {business.products && business.products.length > 0 && (
            <div>
              <h3 className="text-2xl text-purple-100 mb-6 font-semibold flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Products & Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {business.products.map((prod, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="p-4 bg-purple-800/30 border-purple-500/20 hover:bg-purple-800/40 transition-all h-full">
                      {prod.imageUrl && (
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h4 className="text-xl font-semibold text-purple-100 mb-2">
                        {prod.name}
                      </h4>
                      <p className="text-2xl font-bold text-purple-200 mb-2">
                        ${prod.price.toFixed(2)}
                      </p>
                      {prod.description && (
                        <p className="text-purple-300 text-sm">
                          {prod.description}
                        </p>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {(!business.products || business.products.length === 0) && (
            <div className="text-center py-8">
              <p className="text-purple-300">
                No products or services listed yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Back to Feed Button */}
      <div className="max-w-5xl mx-auto mt-6">
        <Button
          onClick={() => router.push("/feed")}
          variant="outline"
          className="border-purple-500/30 text-purple-200 hover:bg-purple-800/30"
        >
          ← Back to All Businesses
        </Button>
      </div>
    </motion.div>
  );
}
