import { z } from "zod";

export const createProfileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  description: z.string().trim().max(300).optional(),
  tags: z.array(z.string()).default([]),
});

export const createContentSchema = z.object({
  profileId: z.string().uuid(),
  title: z.string().trim().min(2).max(140),
  contentType: z.string().trim().min(2).max(40),
  idea: z.string().trim().max(4000).optional(),
  platform: z.string().trim().max(40).optional(),
});

export const createJobSchema = z.object({
  profileId: z.string().uuid().optional(),
  type: z.string().trim().min(2).max(80),
  payload: z.record(z.string(), z.unknown()).default({}),
});

export const authSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export const createLibraryItemSchema = z.object({
  profileId: z.string().uuid(),
  type: z.string().trim().min(2).max(40),
  title: z.string().trim().min(2).max(140),
  body: z.string().trim().max(8000).optional(),
});

export const createManualPostingSchema = z.object({
  profileId: z.string().uuid(),
  contentId: z.string().uuid(),
  platform: z.string().trim().min(2).max(40),
  caption: z.string().trim().max(2200).optional(),
  hashtags: z.string().trim().max(600).optional(),
  plannedDate: z.string().trim().optional(),
});
