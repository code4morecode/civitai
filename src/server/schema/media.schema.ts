import { z } from 'zod';

export type ImageMetadata = z.infer<typeof imageMetadataSchema>;
export const imageMetadataSchema = z.object({
  height: z.number(),
  width: z.number(),
  hash: z.string().optional(),
  size: z.number().optional(),
});

export type VideoMetadata = z.infer<typeof videoMetadataSchema>;
export const videoMetadataSchema = z.object({
  height: z.number(),
  width: z.number(),
  hash: z.string().optional(), // first frame of video
  duration: z.number().optional(),
  audio: z.boolean().optional(),
  size: z.number().optional(),
  thumbnailFrame: z.number().nullish(),
  youtubeVideoId: z.string().optional(),
  youtubeUploadAttempt: z.number().optional(),
  youtubeUploadEnqueuedAt: z.string().optional(),
  vimeoVideoId: z.string().optional(),
  vimeoUploadAttempt: z.number().optional(),
  vimeoUploadEnqueuedAt: z.string().optional(),
  thumbnailId: z.number().optional(),
  parentId: z.number().optional(),
  // hasSound: z.boolean().default(false), not accessible from HTMLVideoElement
});
