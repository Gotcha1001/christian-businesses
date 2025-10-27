// convex/businesses.ts - FIXED UPDATE MUTATION

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

// CREATE BUSINESS
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
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
    products: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
        imageUrl: v.string(),
        description: v.optional(v.string()),
      })
    ),
    colors: v.optional(
      v.object({
        primary: v.string(),
        secondary: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const businessId = await ctx.db.insert("businesses", {
      ...args,
      userId: identity.subject,
      likes: 0,
      likedBy: [],
      views: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return businessId;
  },
});

// UPDATE BUSINESS - FIXED VERSION
export const update = mutation({
  args: {
    id: v.id("businesses"), // This is the _id field
    name: v.string(),
    slug: v.string(),
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
    products: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
        imageUrl: v.string(),
        description: v.optional(v.string()),
      })
    ),
    colors: v.optional(
      v.object({
        primary: v.string(),
        secondary: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const { id, ...updateData } = args; // Separate id from update data

    // Verify ownership
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Business not found");
    if (existing.userId !== identity.subject) {
      throw new Error("Not authorized to update this business");
    }

    // Update without the id field
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// GET USER'S BUSINESS
export const getByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    return businesses[0] ?? null;
  },
});

// GET BY SLUG
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const businesses = await ctx.db
      .query("businesses")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .collect();

    return businesses[0] ?? null;
  },
});

// INCREMENT VIEWS (separate mutation)
export const incrementViews = mutation({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return;

    await ctx.db.patch(args.businessId, {
      views: (business.views || 0) + 1,
    });
  },
});

// GET ALL WITH PAGINATION
export const getAll = query({
  args: {
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 9;

    // Start query and apply filter BEFORE ordering
    let queryBuilder = ctx.db.query("businesses");

    if (args.type) {
      queryBuilder = queryBuilder.filter((q) =>
        q.eq(q.field("type"), args.type)
      );
    }

    // Now apply ordering
    const orderedQuery = queryBuilder.order("desc");

    const results = await orderedQuery.paginate({
      cursor: args.cursor ?? null,
      numItems: limit,
    });

    return {
      results: results.page,
      nextCursor: results.continueCursor,
    };
  },
});

// SEARCH BUSINESSES
export const search = query({
  args: {
    query: v.string(),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 9;

    const results = await ctx.db
      .query("businesses")
      .withSearchIndex("search_name", (q) => {
        let search = q.search("name", args.query);
        if (args.type) {
          search = search.eq("type", args.type);
        }
        return search;
      })
      .paginate({
        cursor: args.cursor ?? null,
        numItems: limit,
      });

    return {
      results: results.page,
      nextCursor: results.continueCursor,
    };
  },
});

// LIKE/UNLIKE BUSINESS
export const toggleLike = mutation({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const business = await ctx.db.get(args.businessId);
    if (!business) throw new Error("Business not found");

    const likedBy = business.likedBy || [];
    const hasLiked = likedBy.includes(identity.subject);

    await ctx.db.patch(args.businessId, {
      likes: hasLiked ? (business.likes || 0) - 1 : (business.likes || 0) + 1,
      likedBy: hasLiked
        ? likedBy.filter((id) => id !== identity.subject)
        : [...likedBy, identity.subject],
    });

    return !hasLiked;
  },
});

export const getTop = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("businesses")
      .withIndex("by_likes")
      .order("desc")
      .paginate(args.paginationOpts);
    return query;
  },
});
