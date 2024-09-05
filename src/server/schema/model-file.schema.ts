import { ModelFileVisibility, TrainingStatus } from '@prisma/client';
import { z } from 'zod';
import { constants } from '~/server/common/constants';
import { labelTypes } from '~/store/training.store';

export type TrainingResults = z.infer<typeof trainingResultsSchema>;
export const trainingResultsSchema = z.object({
  start_time: z.string().nullish(),
  submittedAt: z.string().nullish(),
  end_time: z.string().nullish(),
  // error_type: z.enum(['user', 'system']).nullish(),
  attempts: z.number().nullish(),
  jobId: z.string().nullish(),
  transactionId: z.string().nullish(),
  history: z
    .array(
      z.object({
        jobId: z.string().optional(), // nb: this is an old reference prior to 10/26/23
        time: z.string(),
        status: z.nativeEnum(TrainingStatus),
        message: z.string().nullish(),
      })
    )
    .nullish(),
  epochs: z
    .array(
      z.object({
        epoch_number: z.number(),
        model_url: z.string(),
        sample_images: z
          .array(
            z.object({
              image_url: z.string(),
              prompt: z.string(),
            })
          )
          .optional(),
      })
    )
    .nullish(),
});

export type ModelFileMetadata = z.infer<typeof modelFileMetadataSchema>;
export const modelFileMetadataSchema = z.object({
  format: z.enum(constants.modelFileFormats).nullish(),
  size: z.enum(constants.modelFileSizes).nullish(),
  fp: z.enum(constants.modelFileFp).nullish(),
  labelType: z.enum(labelTypes).nullish(),
  ownRights: z.boolean().nullish(),
  shareDataset: z.boolean().nullish(),
  numImages: z.number().nullish(),
  numCaptions: z.number().nullish(), // this should be named numLabels, but it's too late now
  selectedEpochUrl: z.string().url().nullish(),
  trainingResults: trainingResultsSchema.nullish(),
  bountyId: z.number().nullish(),
  bountyEntryId: z.number().nullish(),
});

export type ModelFileInput = z.infer<typeof modelFileSchema>;
export const modelFileSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  url: z.string().url().min(1, 'You must select a file'),
  sizeKB: z.number(),
  type: z.enum(constants.modelFileTypes),
  format: z.enum(constants.modelFileFormats).optional(),
  visibility: z.nativeEnum(ModelFileVisibility).optional(),
  metadata: modelFileMetadataSchema.optional(),
});

export type ModelFileCreateInput = z.infer<typeof modelFileCreateSchema>;
export const modelFileCreateSchema = z.object({
  name: z.string(),
  url: z.string().url().min(1, 'You must select a file'),
  sizeKB: z.number(),
  type: z.enum(constants.modelFileTypes),
  modelVersionId: z.number(),
  visibility: z.nativeEnum(ModelFileVisibility).optional(),
  metadata: modelFileMetadataSchema.optional(),
});

export type ModelFileUpdateInput = z.infer<typeof modelFileUpdateSchema>;
export const modelFileUpdateSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  url: z.string().url().min(1, 'You must select a file').optional(),
  sizeKB: z.number().optional(),
  type: z.enum(constants.modelFileTypes).optional(),
  modelVersionId: z.number().optional(), // nb: this should probably not be an option here
  visibility: z.nativeEnum(ModelFileVisibility).optional(),
  metadata: modelFileMetadataSchema.optional(),
});

export type ModelFileUpsertInput = z.infer<typeof modelFileUpsertSchema>;
export const modelFileUpsertSchema = z.union([
  modelFileCreateSchema.extend({ id: z.undefined() }),
  modelFileUpdateSchema,
]);
