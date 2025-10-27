import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    credits: v.number(),
    profileImage: v.optional(v.string()),
    bio: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),

  businesses: defineTable({
    userId: v.string(),
    name: v.string(),
    slug: v.string(),
    logoUrl: v.string(),
    description: v.string(),
    type: v.string(),
    likes: v.optional(v.number()), // Temporarily optional
    likedBy: v.optional(v.array(v.string())), // Temporarily optional

    // Enhanced contact information
    contact: v.object({
      address: v.string(),
      email: v.string(),
      phone: v.string(),
      website: v.optional(v.string()),
    }),

    // Social media links
    socialLinks: v.optional(
      v.object({
        facebook: v.optional(v.string()),
        instagram: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        twitter: v.optional(v.string()),
        youtube: v.optional(v.string()),
      })
    ),

    // Business hours
    businessHours: v.optional(
      v.object({
        monday: v.optional(v.string()),
        tuesday: v.optional(v.string()),
        wednesday: v.optional(v.string()),
        thursday: v.optional(v.string()),
        friday: v.optional(v.string()),
        saturday: v.optional(v.string()),
        sunday: v.optional(v.string()),
      })
    ),

    products: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
        imageUrl: v.string(),
        description: v.optional(v.string()),
        category: v.optional(v.string()),
        inStock: v.optional(v.boolean()),
      })
    ),

    // Categories for better organization
    categories: v.optional(v.array(v.string())),

    // Tags for better searchability
    tags: v.optional(v.array(v.string())),

    colors: v.optional(
      v.object({
        primary: v.string(),
        secondary: v.string(),
        accent: v.optional(v.string()),
      })
    ),

    // SEO fields
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),

    // Analytics
    views: v.optional(v.number()),
    featured: v.optional(v.boolean()),
    verified: v.optional(v.boolean()),

    // Timestamps (optional for backward compatibility)
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_slug", ["slug"])
    .index("by_type", ["type"])
    .index("by_featured", ["featured"])
    .index("by_likes", ["likes"]) // Add this index for sorting by likes
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["type", "featured"],
    }),

  // New: Reviews system
  reviews: defineTable({
    businessId: v.id("businesses"),
    userId: v.string(),
    userName: v.string(),
    rating: v.number(), // 1-5
    comment: v.string(),
    createdAt: v.number(),
  })
    .index("by_business", ["businessId"])
    .index("by_user", ["userId"]),

  // New: Business inquiries/contact requests
  inquiries: defineTable({
    businessId: v.id("businesses"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    status: v.string(), // "new", "contacted", "resolved"
    createdAt: v.number(),
  }).index("by_business", ["businessId"]),

  // New: Favorites/Bookmarks
  favorites: defineTable({
    userId: v.string(),
    businessId: v.id("businesses"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_business", ["businessId"])
    .index("by_user_and_business", ["userId", "businessId"]),
});
