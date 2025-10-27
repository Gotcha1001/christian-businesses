import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const like = mutation({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, { businessId }) => {
    const { auth, db } = ctx;
    const user = await auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    const business = await db.get(businessId);
    if (!business) throw new Error("Business not found");

    const userId = user.subject; // Clerk user ID
    if ((business.likedBy || []).includes(userId)) return; // Already liked -- added || [] to handle undefined

    await db.patch(businessId, {
      likes: (business.likes || 0) + 1,
      likedBy: [...(business.likedBy || []), userId],
    });
  },
});

export const getLikes = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, { businessId }) => {
    const business = await ctx.db.get(businessId);
    return { likes: business?.likes || 0, likedBy: business?.likedBy || [] };
  },
});
