import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    logoUrl: v.string(),
    description: v.string(),
    type: v.string(),
    contact: v.object({
      address: v.string(),
      email: v.string(),
      phone: v.string(),
      website: v.optional(v.string()),
    }),
    socialLinks: v.optional(
      v.object({
        facebook: v.optional(v.string()),
        instagram: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        twitter: v.optional(v.string()),
        youtube: v.optional(v.string()),
      })
    ),
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
    categories: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    colors: v.optional(
      v.object({
        primary: v.string(),
        secondary: v.string(),
        accent: v.optional(v.string()),
      })
    ),
    slug: v.string(),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("businesses")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();

    if (existing) {
      throw new Error("You already have a business. Please edit it instead.");
    }

    const now = Date.now();
    return await ctx.db.insert("businesses", {
      userId: identity.subject,
      ...args,
      likes: 0,
      likedBy: [],
      views: 0,
      featured: false,
      verified: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("businesses"),
    name: v.string(),
    logoUrl: v.string(),
    description: v.string(),
    type: v.string(),
    contact: v.object({
      address: v.string(),
      email: v.string(),
      phone: v.string(),
      website: v.optional(v.string()),
    }),
    socialLinks: v.optional(
      v.object({
        facebook: v.optional(v.string()),
        instagram: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        twitter: v.optional(v.string()),
        youtube: v.optional(v.string()),
      })
    ),
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
    categories: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    colors: v.optional(
      v.object({
        primary: v.string(),
        secondary: v.string(),
        accent: v.optional(v.string()),
      })
    ),
    slug: v.string(),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== identity.subject) {
      throw new Error("Not your business");
    }

    await ctx.db.patch(args.id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

export const getByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("businesses")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();
  },
});

// FIXED: Added cursor and limit to the validator
export const getAll = query({
  args: {
    type: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    cursor: v.optional(v.string()), // ADDED THIS
    limit: v.optional(v.number()), // ADDED THIS
  },
  handler: async (ctx, args) => {
    // FIXED: Handle different query paths based on filters
    let paginated;

    if (args.type !== undefined) {
      paginated = await ctx.db
        .query("businesses")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .order("desc")
        .paginate({
          cursor: args.cursor ?? null,
          numItems: args.limit ?? 9,
        });
    } else if (args.featured !== undefined) {
      paginated = await ctx.db
        .query("businesses")
        .withIndex("by_featured", (q) => q.eq("featured", args.featured!))
        .order("desc")
        .paginate({
          cursor: args.cursor ?? null,
          numItems: args.limit ?? 9,
        });
    } else {
      paginated = await ctx.db
        .query("businesses")
        .order("desc")
        .paginate({
          cursor: args.cursor ?? null,
          numItems: args.limit ?? 9,
        });
    }

    const page = await paginated.page;
    return {
      results: page,
      nextCursor: paginated.isDone ? null : paginated.continueCursor,
    };
  },
});

// FIXED: Added proper checks for optional args.tags
export const search = query({
  args: {
    query: v.string(),
    type: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!args.query || args.query.trim() === "") {
      return { results: [], nextCursor: null };
    }
    const allBusinesses = await ctx.db.query("businesses").collect();
    const searchLower = args.query.toLowerCase().trim();
    const searchTerms = searchLower.split(/\s+/);
    const scoredBusinesses = allBusinesses.map((business) => {
      let score = 0;
      const nameLower = business.name.toLowerCase();
      const descLower = business.description.toLowerCase();
      const typeLower = business.type.toLowerCase();
      if (nameLower === searchLower) score += 100;
      if (nameLower.startsWith(searchLower)) score += 50;
      if (nameLower.includes(searchLower)) score += 30;
      searchTerms.forEach((term) => {
        if (nameLower.includes(term)) score += 10;
        if (descLower.includes(term)) score += 5;
        if (typeLower.includes(term)) score += 8;
        if (business.tags?.some((tag) => tag.toLowerCase().includes(term))) {
          score += 15;
        }
        if (
          business.categories?.some((cat) => cat.toLowerCase().includes(term))
        ) {
          score += 12;
        }
      });
      if (business.featured) score += 5;
      if (business.verified) score += 3;
      return { business, score };
    });
    let filtered = scoredBusinesses
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ business }) => business);
    if (args.type) {
      filtered = filtered.filter((b) => b.type === args.type);
    }
    // FIXED: Check if args.tags exists before using it
    if (args.tags && args.tags.length > 0) {
      filtered = filtered.filter(
        (b) => args.tags!.some((tag) => b.tags?.includes(tag)) // Added ! to assert non-null
      );
    }
    const start = args.cursor ? parseInt(args.cursor) : 0;
    const limitNum = args.limit ?? 9;
    const results = filtered.slice(start, start + limitNum);
    const nextCursor =
      start + limitNum < filtered.length ? (start + limitNum).toString() : null;
    return { results, nextCursor };
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    return business;
  },
});

export const incrementViews = mutation({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, { businessId }) => {
    const business = await ctx.db.get(businessId);
    if (business) {
      await ctx.db.patch(businessId, {
        views: (business.views || 0) + 1,
      });
    }
  },
});

export const getFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 6 }) => {
    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .order("desc")
      .take(limit);
    return businesses;
  },
});

export const getStats = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, { businessId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const business = await ctx.db.get(businessId);
    if (!business || business.userId !== identity.subject) {
      throw new Error("Not your business");
    }

    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_business", (q) => q.eq("businessId", businessId))
      .collect();

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_business", (q) => q.eq("businessId", businessId))
      .collect();

    const inquiries = await ctx.db
      .query("inquiries")
      .withIndex("by_business", (q) => q.eq("businessId", businessId))
      .collect();

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      views: business.views || 0,
      reviewCount: reviews.length,
      averageRating: avgRating,
      favoriteCount: favorites.length,
      inquiryCount: inquiries.length,
    };
  },
});

export const like = mutation({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, { businessId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const business = await ctx.db.get(businessId);
    if (!business) throw new Error("Business not found");
    if (business.likedBy?.includes(identity.subject)) return;
    await ctx.db.patch(businessId, {
      likes: (business.likes || 0) + 1,
      likedBy: [...(business.likedBy || []), identity.subject],
    });
  },
});

export const unlike = mutation({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, { businessId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const business = await ctx.db.get(businessId);
    if (!business) throw new Error("Business not found");
    if (!business.likedBy?.includes(identity.subject)) return;
    await ctx.db.patch(businessId, {
      likes: (business.likes || 0) - 1,
      likedBy: business.likedBy.filter((id) => id !== identity.subject),
    });
  },
});
