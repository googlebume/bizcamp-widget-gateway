import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  organizations: defineTable({
    companyName: v.string(),
    createdAt: v.number(),
    phone: v.string(),
    workEmail: v.string(),
  })
    .index('by_workEmail', ['workEmail'])
    .index('by_createdAt', ['createdAt']),
})
