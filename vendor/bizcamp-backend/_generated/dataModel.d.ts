/* eslint-disable */
/**
 * Standalone admin stubs for Convex document IDs.
 * @module
 */

import type { GenericId } from 'convex/values'

/**
 * Document id for a Convex table. TableName is kept for call-site clarity.
 */
export type Id<TableName extends string = string> = GenericId<TableName>
