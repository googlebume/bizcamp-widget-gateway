import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const register = mutation({
  args: {
    companyName: v.string(),
    phone: v.string(),
    workEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const companyName = args.companyName.trim()
    const phone = args.phone.trim()
    const workEmail = args.workEmail.trim().toLowerCase()

    if (companyName.length < 2) {
      throw new Error('Company name must be at least 2 characters.')
    }
    if (phone.length < 7) {
      throw new Error('Phone number looks incomplete.')
    }
    if (!emailPattern.test(workEmail)) {
      throw new Error('Enter a valid work email address.')
    }

    const existing = await ctx.db
      .query('organizations')
      .withIndex('by_workEmail', (q) => q.eq('workEmail', workEmail))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, {
        companyName,
        phone,
      })
      return existing._id
    }

    return await ctx.db.insert('organizations', {
      companyName,
      createdAt: Date.now(),
      phone,
      workEmail,
    })
  },
})

export const getById = query({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.organizationId)
  },
})
