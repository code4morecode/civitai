// import { pgDbRead } from '~/server/db/pgDb';
import { faker } from '@faker-js/faker';
import {
  Availability,
  ImageGenerationProcess,
  ModelFileVisibility,
  ModelModifier,
  ModelStatus,
  ModelUploadType,
  NsfwLevel,
  ScanResultCode,
  TagSource,
  TagType,
  ToolType,
  TrainingStatus,
} from '@prisma/client';
import { capitalize } from 'lodash-es';
import { constants } from '~/server/common/constants';
import { CheckpointType, ModelType } from '~/server/common/enums';
import { IMAGE_MIME_TYPE, VIDEO_MIME_TYPE } from '~/server/common/mime-types';

// const getSchema = async () => {
//   const query = `
//     select col.table_name,
//            col.column_name,
//            col.column_default,
//            col.is_nullable,
//            col.data_type,
//            col.udt_name,
//            string_agg(enu.enumlabel, '|' order by enu.enumsortorder) as enum_values
// --        array_agg(enu.enumlabel) as enum_values
//     from information_schema.columns col
//            join information_schema.tables tab on tab.table_schema = col.table_schema
//       and tab.table_name = col.table_name
//       and tab.table_type = 'BASE TABLE'
//            left join pg_type typ on col.udt_name = typ.typname
//            left join pg_enum enu on typ.oid = enu.enumtypid
//     where col.table_schema = 'public'
// --       and typ.typtype = 'e'
//     group by col.table_name,
//              col.ordinal_position,
//              col.column_name,
//              col.column_default,
//              col.is_nullable,
//              col.data_type,
//              col.udt_name
//     order by col.table_name,
//              col.ordinal_position;
//   `;
//
//   type Query = {
//     table_name: string;
//     column_name: string;
//     udt_name: string;
//     data_type: string;
//     is_nullable: 'YES' | 'NO';
//     column_default: string | null;
//     enum_values: string | null;
//   };
//
//   const { rows } = await pgDbRead.query<Query>(query);
//   console.log(rows[0]);
//   console.log(rows[0].enum_values?.split('|'));
//
//   const tableData: { [p: string]: Omit<Query, 'table_name'>[] } = {};
//
//   for (const r of rows) {
//     if (
//       ![
//         'integer',
//         'bigint',
//         'double precision',
//         'numeric',
//
//         'timestamp with time zone',
//         'timestamp without time zone',
//         'date',
//
//         'text',
//         'character varying',
//
//         'jsonb',
//
//         'boolean',
//
//         'ARRAY',
//
//         'USER-DEFINED',
//       ].includes(r.data_type)
//     )
//       console.log(r);
//
//     // if (r.data_type === 'ARRAY') console.log(r);
//
//     const { table_name, ...rest } = r;
//
//     if (!tableData.hasOwnProperty(table_name)) {
//       tableData[table_name] = [rest];
//     } else {
//       tableData[table_name].push(rest);
//     }
//   }
//   console.log(tableData);
//   return tableData;
// };
//
// const desiredTables = ['User', 'Model'];
//
// const makeRows = async (schema: AsyncReturnType<typeof getSchema>) => {
//   desiredTables.forEach((t) => {
//     const s = schema[t];
//     for (const col of s) {
//       const { data_type } = col;
//       let val: any;
//       // TODO get foreign key
//       if (['integer', 'bigint'].includes(data_type)) val = 0; // change to random
//     }
//   });
// };
//
// const getRows = async (table: string) => {
//   // Prisma.sql``
//   const query = `SELECT * FROM "${table}" LIMIT 1`;
//   const { rows } = await pgDbRead.query(query);
//   console.log(rows[0]);
//   return rows
// }

const randw = faker.helpers.weightedArrayElement;
const rand = faker.helpers.arrayElement;
const fbool = faker.datatype.boolean;

const genUsers = (num: number, includeCiv = false) => {
  const ret = [];

  if (includeCiv) {
    num -= 1;

    // civ user
    const civUser = [
      'Civitai',
      'hello@civitai.com',
      null,
      null,
      -1,
      true,
      false,
      'civitai',
      true,
      true,
      '2022-11-13 00:00:00.000',
      null,
      null,
      null,
      null,
      true,
      '{"fp": "fp16", "size": "pruned", "format": "SafeTensor"}',
      null,
      '{Buzz}',
      null,
      '{"scores": {"total": 39079263, "users": 223000, "images": 2043471, "models": 36812792, "reportsAgainst": -8000, "reportsActioned": null}, "firstImage": "2022-11-09T17:39:48.137"}',
      '{"newsletterSubscriber": true}',
      null,
      false,
      1,
      0,
      '{}',
      null,
      false,
      null,
      'Eligible',
      null,
    ];

    ret.push(civUser);
  }

  // random users
  for (let step = 1; step <= num; step++) {
    const created = faker.date.past({ years: 3 }).toISOString();
    const isMuted = fbool(0.01);

    const row = [
      randw([
        { value: null, weight: 1 },
        { value: faker.person.fullName(), weight: 20 },
      ]), // name
      randw([
        { value: null, weight: 1 },
        { value: faker.internet.email(), weight: 20 },
      ]), // email
      randw([
        { value: null, weight: 1 },
        { value: faker.date.between({ from: created, to: Date.now() }).toISOString(), weight: 3 },
      ]), // "emailVerified"
      randw([
        { value: null, weight: 1 },
        { value: faker.image.avatar(), weight: 10 },
      ]), // image
      step, // id
      fbool(), // "blurNsfw"
      fbool(), // "showNsfw"
      randw([
        { value: null, weight: 1 },
        { value: faker.internet.userName(), weight: 20 },
      ]), // username
      fbool(0.01), // "isModerator"
      fbool(0.01), // tos
      created, // "createdAt"
      randw([
        { value: null, weight: 100 },
        { value: faker.date.between({ from: created, to: Date.now() }).toISOString(), weight: 1 },
      ]), // "deletedAt"
      randw([
        { value: null, weight: 100 },
        { value: faker.date.between({ from: created, to: Date.now() }).toISOString(), weight: 1 },
      ]), // "bannedAt"
      randw([
        { value: null, weight: 1 },
        { value: `cus_Na${faker.string.alphanumeric(12)}`, weight: 5 },
      ]), // "customerId"
      randw([
        { value: null, weight: 10 },
        { value: `sub_${faker.string.alphanumeric(24)}`, weight: 1 },
      ]), // "subscriptionId"
      fbool(), // "autoplayGifs"
      '{"fp": "fp16", "size": "pruned", "format": "SafeTensor"}', // "filePreferences" // TODO make random
      randw([
        { value: null, weight: 30 },
        { value: 'overall', weight: 2 },
        { value: 'new_creators', weight: 1 },
      ]), // "leaderboardShowcase"
      randw([
        { value: null, weight: 2 },
        { value: '{Buzz}', weight: 3 },
        { value: '{Moderation,Buzz}', weight: 1 },
      ]), // "onboardingSteps"
      null, // "profilePictureId" // TODO link with Image ID
      randw([
        { value: '{}', weight: 5 },
        { value: '{"scores": {"total": 0, "users": 0}}', weight: 3 },
        {
          value: `{"scores": {"total": ${faker.number.int(10_000_000)}, "users": ${faker.number.int(
            100_000
          )}, "images": ${faker.number.int(100_000)}, "models": ${faker.number.int(
            1_000_000
          )}, "articles": ${faker.number.int(100_000)}}, "firstImage": "${faker.date
            .between({ from: created, to: Date.now() })
            .toISOString()}"}`,
          weight: 1,
        },
      ]), // meta
      '{}', // settings // TODO not sure if we even need this
      isMuted ? faker.date.between({ from: created, to: Date.now() }).toISOString() : null, // "mutedAt"
      isMuted, // muted
      rand([1, 31]), // "browsingLevel" // TODO which other ones?
      rand([3, 15]), // onboarding // TODO which other ones?
      '{}', // "publicSettings" // TODO not sure if we even need this
      isMuted ? faker.date.between({ from: created, to: Date.now() }).toISOString() : null, // "muteConfirmedAt"
      fbool(0.01), // "excludeFromLeaderboards"
      null, // "eligibilityChangedAt" // TODO
      'Eligible', // "rewardsEligibility" // TODO
      randw([
        { value: null, weight: 3 },
        { value: `ctm_01j6${faker.string.alphanumeric(22)}`, weight: 1 },
      ]), // "paddleCustomerId"
    ];

    ret.push(row);
  }

  return ret;
};

const genModels = (num: number, userIds: number[]) => {
  const ret = [];

  for (let step = 1; step <= num; step++) {
    const created = faker.date.past({ years: 3 }).toISOString();
    const isCheckpoint = fbool(0.3);
    const isLora = fbool(0.6);
    const isDeleted = fbool(0.05);
    const isPublished = fbool(0.4);
    const isEa = fbool(0.05);

    const row = [
      `${capitalize(faker.word.adjective())}${capitalize(faker.word.noun())}`, // name
      rand([null, `<p>${faker.lorem.paragraph()}</p>`]), // description
      isCheckpoint
        ? 'Checkpoint'
        : isLora
        ? 'LORA'
        : rand(Object.values(ModelType).filter((v) => !['Checkpoint', 'LORA'].includes(v))), // type
      created, // createdAt
      rand([created, faker.date.between({ from: created, to: Date.now() }).toISOString()]), // updatedAt
      fbool(), // nsfw
      step, // id
      rand(userIds), // userId
      fbool(0.01), // tosViolation
      isDeleted
        ? 'Deleted'
        : isPublished
        ? 'Published'
        : rand(Object.values(ModelStatus).filter((v) => !['Deleted', 'Published'].includes(v))), // status
      null, // fromImportId // TODO
      fbool(0.1), // poi
      isPublished ? faker.date.between({ from: created, to: Date.now() }).toISOString() : null, // publishedAt
      faker.date.between({ from: created, to: Date.now() }).toISOString(), // lastVersionAt // TODO this one is annoying
      '{}', // meta
      fbool(), // allowDerivatives
      fbool(), // allowDifferentLicense
      fbool(), // allowNoCredit
      isDeleted ? faker.date.between({ from: created, to: Date.now() }).toISOString() : null, // deletedAt
      isCheckpoint ? rand(Object.values(CheckpointType)) : null, // checkpointType
      fbool(0.01), // locked
      isDeleted ? rand(userIds) : null, // deletedBy
      fbool(0.001), // underAttack
      isEa ? faker.date.future().toISOString() : null, // earlyAccessDeadline
      randw([
        { value: null, weight: 100 },
        { value: rand(Object.values(ModelModifier)), weight: 1 },
      ]), // mode
      isLora ? rand(Object.values(ModelUploadType)) : 'Created', // uploadType
      fbool(0.05), // unlisted
      randw([
        { value: '{}', weight: 20 },
        { value: '{"level": 31}', weight: 1 },
      ]), // gallerySettings
      isEa
        ? 'EarlyAccess'
        : randw([
            { value: 'Public', weight: 30 },
            {
              value: rand(
                Object.values(Availability).filter((v) => !['Public', 'EarlyAccess'].includes(v))
              ),
              weight: 1,
            },
          ]), // availability
      rand(['{Sell}', '{Image,RentCivit,Rent,Sell}', '{Image,RentCivit}']), // allowCommercialUse
      randw([
        { value: 0, weight: 5 },
        { value: 1, weight: 4 },
        { value: 28, weight: 3 },
        { value: 15, weight: 2 },
        { value: 31, weight: 2 },
      ]), // nsfwLevel
      '{}', // lockedProperties
      fbool(0.05), // minor
    ];
    ret.push(row);
  }
  return ret;
};

const genMvs = (num: number, modelData: { id: number; type: ModelUploadType }[]) => {
  const ret = [];

  for (let step = 1; step <= num; step++) {
    const model = rand(modelData);
    const isTrain = model.type === 'Trained';
    const created = faker.date.past({ years: 3 }).toISOString();
    const isDeleted = fbool(0.05);
    const isPublished = fbool(0.4);

    const row = [
      `V${faker.number.int(6)}`, //name
      rand([null, `<p>${faker.lorem.sentence()}</p>`]), // description
      isTrain ? faker.number.int({ min: 10, max: 10_000 }) : null, // steps
      isTrain ? faker.number.int({ min: 1, max: 200 }) : null, // epochs
      created, // createdAt // nb: not perfect since it can be different from the model
      rand([created, faker.date.between({ from: created, to: Date.now() }).toISOString()]), // updatedAt
      step, // id
      model.id, // modelId
      rand(['{}', `{${faker.word.noun()}}`]), // trainedWords
      isDeleted
        ? 'Deleted'
        : isPublished
        ? 'Published'
        : rand(Object.values(ModelStatus).filter((v) => !['Deleted', 'Published'].includes(v))), // status
      null, // fromImportId // TODO
      faker.number.int({ min: 1, max: 8 }), // index // TODO needs other indices?
      fbool(0.01), // inaccurate
      rand(constants.baseModels), // baseModel
      rand(['{}', '{"imageNsfw": "None"}', '{"imageNsfw": "X"}']), // meta
      0, // earlyAccessTimeframe // TODO check model early access
      isPublished ? faker.date.between({ from: created, to: Date.now() }).toISOString() : null, // publishedAt
      rand([null, 1, 2]), // clipSkip
      null, // vaeId // TODO
      rand([null, ...constants.baseModelTypes]), // baseModelType
      isTrain
        ? rand([
            '{}',
            '{"type": "Character"}',
            '{"type": "Character", "params": {"engine": "kohya", "unetLR": 0.0005, "clipSkip": 1, "loraType": "lora", "keepTokens": 0, "networkDim": 32, "numRepeats": 14, "resolution": 512, "lrScheduler": "cosine_with_restarts", "minSnrGamma": 5, "noiseOffset": 0.1, "targetSteps": 1050, "enableBucket": true, "networkAlpha": 16, "optimizerType": "AdamW8Bit", "textEncoderLR": 0.00005, "maxTrainEpochs": 10, "shuffleCaption": false, "trainBatchSize": 2, "flipAugmentation": false, "lrSchedulerNumCycles": 3}, "staging": false, "baseModel": "realistic", "highPriority": false, "baseModelType": "sd15", "samplePrompts": ["", "", ""]}',
          ])
        : null, // trainingDetails
      isTrain ? rand(Object.values(TrainingStatus)) : null, // trainingStatus
      fbool(0.2), // requireAuth
      rand([null, '{"strength": 1, "maxStrength": 2, "minStrength": 0.1}']), // settings
      randw([
        { value: 'Public', weight: 2 },
        { value: 'Private', weight: 1 },
      ]), // availability
      randw([
        { value: 0, weight: 5 },
        { value: 1, weight: 4 },
        { value: 28, weight: 3 },
        { value: 15, weight: 2 },
        { value: 31, weight: 2 },
      ]), // nsfwLevel
      null, // earlyAccessConfig // TODO
      null, // earlyAccessEndsAt // TODO
      model.type, // uploadType
    ];
    ret.push(row);
  }
  return ret;
};

const genMFiles = (num: number, mvData: { id: number; type: ModelUploadType }[]) => {
  const ret = [];

  // TODO do these URLs work?
  const typeMap = {
    Model: {
      ext: 'safetensors',
      url: 'https://civitai-delivery-worker-prod.5ac0637cfd0766c97916cefa3764fbdf.r2.cloudflarestorage.com/modelVersion/627691/Capitan_V2_Nyakumi_Neko_style.safetensors',
      meta: '{"fp": "fp16", "size": "full", "format": "SafeTensor"}',
      metaTrain:
        '{"format": "SafeTensor", "selectedEpochUrl": "https://orchestration.civitai.com/v1/consumer/jobs/2604a7f9-fced-4279-bc4e-05fc3bd95e29/assets/Capitan_V2_Nyakumi_Neko_style.safetensors"}',
    },
    'Training Data': {
      ext: 'zip',
      url: 'https://civitai-delivery-worker-prod.5ac0637cfd0766c97916cefa3764fbdf.r2.cloudflarestorage.com/training-images/3625125/806329TrainingData.yqVq.zip',
      meta: '{"fp": null, "size": null, "format": "Other"}',
      metaTrain:
        '{"format": "Other", "numImages": 26, "ownRights": false, "numCaptions": 26, "shareDataset": false, "trainingResults": {"jobId": "c5657331-beee-488d-97fa-8b9e6d6fd48f", "epochs": [{"model_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo-000001.safetensors", "epoch_number": 1, "sample_images": [{"prompt": "blademancy, furry", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000001_00_20240904200838.png"}, {"prompt": "light particles, dual wielding, brown hair, standing, holding, grey background, beard, gradient, no humans, necktie", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000001_01_20240904200845.png"}, {"prompt": "dagger, scar, weapon, english text, halberd, blue necktie, facial hair, artist name, green theme, formal", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000001_02_20240904200852.png"}]}, {"model_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo-000002.safetensors", "epoch_number": 2, "sample_images": [{"prompt": "blademancy, furry", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000002_00_20240904201044.png"}, {"prompt": "light particles, dual wielding, brown hair, standing, holding, grey background, beard, gradient, no humans, necktie", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000002_01_20240904201051.png"}, {"prompt": "dagger, scar, weapon, english text, halberd, blue necktie, facial hair, artist name, green theme, formal", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000002_02_20240904201058.png"}]}, {"model_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo-000003.safetensors", "epoch_number": 3, "sample_images": [{"prompt": "blademancy, furry", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000003_00_20240904201248.png"}, {"prompt": "light particles, dual wielding, brown hair, standing, holding, grey background, beard, gradient, no humans, necktie", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000003_01_20240904201255.png"}, {"prompt": "dagger, scar, weapon, english text, halberd, blue necktie, facial hair, artist name, green theme, formal", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000003_02_20240904201302.png"}]}, {"model_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo-000004.safetensors", "epoch_number": 4, "sample_images": [{"prompt": "blademancy, furry", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000004_00_20240904201452.png"}, {"prompt": "light particles, dual wielding, brown hair, standing, holding, grey background, beard, gradient, no humans, necktie", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000004_01_20240904201459.png"}, {"prompt": "dagger, scar, weapon, english text, halberd, blue necktie, facial hair, artist name, green theme, formal", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000004_02_20240904201505.png"}]}, {"model_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo-000005.safetensors", "epoch_number": 5, "sample_images": [{"prompt": "blademancy, furry", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000005_00_20240904201656.png"}, {"prompt": "light particles, dual wielding, brown hair, standing, holding, grey background, beard, gradient, no humans, necktie", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000005_01_20240904201702.png"}, {"prompt": "dagger, scar, weapon, english text, halberd, blue necktie, facial hair, artist name, green theme, formal", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000005_02_20240904201709.png"}]}, {"model_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo-000006.safetensors", "epoch_number": 6, "sample_images": [{"prompt": "blademancy, furry", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000006_00_20240904201900.png"}, {"prompt": "light particles, dual wielding, brown hair, standing, holding, grey background, beard, gradient, no humans, necktie", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000006_01_20240904201907.png"}, {"prompt": "dagger, scar, weapon, english text, halberd, blue necktie, facial hair, artist name, green theme, formal", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000006_02_20240904201913.png"}]}, {"model_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo-000007.safetensors", "epoch_number": 7, "sample_images": [{"prompt": "blademancy, furry", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000007_00_20240904202103.png"}, {"prompt": "light particles, dual wielding, brown hair, standing, holding, grey background, beard, gradient, no humans, necktie", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000007_01_20240904202110.png"}, {"prompt": "dagger, scar, weapon, english text, halberd, blue necktie, facial hair, artist name, green theme, formal", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000007_02_20240904202117.png"}]}, {"model_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo-000008.safetensors", "epoch_number": 8, "sample_images": [{"prompt": "blademancy, furry", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000008_00_20240904202306.png"}, {"prompt": "light particles, dual wielding, brown hair, standing, holding, grey background, beard, gradient, no humans, necktie", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000008_01_20240904202313.png"}, {"prompt": "dagger, scar, weapon, english text, halberd, blue necktie, facial hair, artist name, green theme, formal", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000008_02_20240904202320.png"}]}, {"model_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo-000009.safetensors", "epoch_number": 9, "sample_images": [{"prompt": "blademancy, furry", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000009_00_20240904202510.png"}, {"prompt": "light particles, dual wielding, brown hair, standing, holding, grey background, beard, gradient, no humans, necktie", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000009_01_20240904202517.png"}, {"prompt": "dagger, scar, weapon, english text, halberd, blue necktie, facial hair, artist name, green theme, formal", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000009_02_20240904202523.png"}]}, {"model_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo.safetensors", "epoch_number": 10, "sample_images": [{"prompt": "blademancy, furry", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000010_00_20240904202715.png"}, {"prompt": "light particles, dual wielding, brown hair, standing, holding, grey background, beard, gradient, no humans, necktie", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000010_01_20240904202721.png"}, {"prompt": "dagger, scar, weapon, english text, halberd, blue necktie, facial hair, artist name, green theme, formal", "image_url": "https://orchestration.civitai.com/v1/consumer/jobs/c5657331-beee-488d-97fa-8b9e6d6fd48f/assets/blademancer_2_stabby_boogaloo_e000010_02_20240904202728.png"}]}], "history": [{"time": "2024-09-04T19:58:04.411Z", "jobId": "c5657331-beee-488d-97fa-8b9e6d6fd48f", "status": "Submitted"}, {"time": "2024-09-04T19:58:10.988Z", "status": "Processing", "message": ""}, {"time": "2024-09-04T20:29:37.747Z", "status": "InReview", "message": "Job complete"}], "attempts": 1, "end_time": "2024-09-04T20:29:35.087Z", "start_time": "2024-09-04T19:58:09.668Z", "submittedAt": "2024-09-04T19:58:04.411Z", "transactionId": "2ebb5147-5fd3-4dbb-a735-e206d218686b"}}',
    },
    Archive: {
      ext: 'zip',
      url: 'https://civitai-delivery-worker-prod-2023-05-01.5ac0637cfd0766c97916cefa3764fbdf.r2.cloudflarestorage.com/91602/default/bingLogoRemoval.2ayv.zip',
      meta: '{"fp": null, "size": null, "format": "Other"}',
      metaTrain: '{"fp": null, "size": null, "format": "Other"}',
    },
    Config: {
      ext: 'yaml',
      url: 'https://civitai-prod.5ac0637cfd0766c97916cefa3764fbdf.r2.cloudflarestorage.com/14014/training-images/somnia140.cR9o.yaml',
      meta: '{"format": "Other"}',
      metaTrain: '{"format": "Other"}',
    },
    Negative: {
      ext: 'pt',
      url: 'https://civitai-delivery-worker-prod-2023-10-01.5ac0637cfd0766c97916cefa3764fbdf.r2.cloudflarestorage.com/default/3336/aloeanticgi1500.sPBn.pt',
      meta: '{"fp": null, "size": null, "format": "Other"}',
      metaTrain: '{"fp": null, "size": null, "format": "Other"}',
    },
    'Pruned Model': {
      ext: 'safetensors',
      url: 'https://civitai-prod.5ac0637cfd0766c97916cefa3764fbdf.r2.cloudflarestorage.com/78515/training-images/mihaV3E100.cCux.safetensors',
      meta: '{"fp": "fp16", "size": "pruned", "format": "SafeTensor"}',
      metaTrain: '{"fp": "fp16", "size": "pruned", "format": "SafeTensor"}',
    },
  };

  for (let step = 1; step <= num; step++) {
    const mv = rand(mvData);
    const isTrain = mv.type === 'Trained';
    const created = faker.date.past({ years: 3 }).toISOString();
    const passScan = fbool(0.98);
    const type = randw([
      { value: 'Model', weight: 8 },
      { value: 'Training Data', weight: 5 },
      { value: 'Archive', weight: 1 },
      { value: 'Config', weight: 1 },
      { value: 'Negative', weight: 1 },
      { value: 'Pruned Model', weight: 1 },
    ]);

    const row = [
      (type === 'Training Data'
        ? `${mv.id}_training_data`
        : `${faker.word.noun()}_${faker.number.int(100)}`) + `.${typeMap[type].ext}`, // name
      typeMap[type].url, // url
      faker.number.float(2_000_000), // sizeKB
      created, // createdAt
      mv.id, // modelVersionId
      passScan
        ? ScanResultCode.Success
        : rand(Object.values(ScanResultCode).filter((v) => !['Success'].includes(v))), // pickleScanResult
      'No Pickle imports', // pickleScanMessage
      passScan
        ? ScanResultCode.Success
        : rand(Object.values(ScanResultCode).filter((v) => !['Success'].includes(v))), // virusScanResult
      null, // virusScanMessage
      passScan ? faker.date.between({ from: created, to: Date.now() }).toISOString() : null, // scannedAt
      passScan
        ? `{"url": "${
            typeMap[type].url
          }", "fixed": null, "hashes": {"CRC32": "${faker.string.hexadecimal({
            length: 8,
            casing: 'upper',
            prefix: '',
          })}", "AutoV1": "${faker.string.hexadecimal({
            length: 8,
            casing: 'upper',
            prefix: '',
          })}", "AutoV2": "${faker.string.hexadecimal({
            length: 10,
            casing: 'upper',
            prefix: '',
          })}", "AutoV3": "${faker.string.hexadecimal({
            length: 64,
            casing: 'upper',
            prefix: '',
          })}", "Blake3": "${faker.string.hexadecimal({
            length: 64,
            casing: 'upper',
            prefix: '',
          })}", "SHA256": "${faker.string.hexadecimal({
            length: 64,
            casing: 'upper',
            prefix: '',
          })}"}, "fileExists": 1, "conversions": {}, "clamscanOutput": "", "clamscanExitCode": 0, "picklescanOutput": "", "picklescanExitCode": 0, "picklescanGlobalImports": null, "picklescanDangerousImports": null}`
        : null, // rawScanResult
      faker.date.between({ from: created, to: Date.now() }).toISOString(), // scanRequestedAt
      randw([
        { value: null, weight: 2 },
        { value: true, weight: 3 },
        { value: false, weight: 1 },
      ]), // exists
      step, // id
      type, // type
      isTrain ? typeMap[type].metaTrain : typeMap[type].meta, // metadata
      rand(Object.values(ModelFileVisibility)), // visibility
      fbool(0.1), // dataPurged
      type === 'Model'
        ? '{"ss_v2": "False", "ss_seed": "431671283", "ss_epoch": "6", "ss_steps": "444", "ss_lowram": "False", "ss_unet_lr": "1.0", "ss_datasets": "[{\\"is_dreambooth\\": true, \\"batch_size_per_device\\": 5, \\"num_train_images\\": 204, \\"num_reg_images\\": 0, \\"resolution\\": [1024, 1024], \\"enable_bucket\\": true, \\"min_bucket_reso\\": 256, \\"max_bucket_reso\\": 2048, \\"tag_frequency\\": {\\"img\\": {\\"1girl\\": 96, \\"solo\\": 63, \\"hat\\": 63, \\"skirt\\": 28, \\"armband\\": 11, \\"vest\\": 37, \\"open mouth\\": 46, \\"brown hair\\": 75, \\"brown vest\\": 2, \\"cowboy hat\\": 8, \\"shirt\\": 17, \\"white shirt\\": 11, \\"closed eyes\\": 10, \\"smile\\": 40, \\"water\\": 3, \\"wet\\": 2, \\"nude\\": 1, \\"long hair\\": 40, \\"outdoors\\": 7, \\"bathing\\": 1, \\"tattoo\\": 2, \\"witch hat\\": 19, \\"food\\": 2, \\"sitting\\": 13, \\"indian style\\": 1, \\"cup\\": 6, \\"bare shoulders\\": 2, \\"steam\\": 2, \\"brown eyes\\": 16, \\"off shoulder\\": 2, \\"holding\\": 11, \\"blue eyes\\": 8, \\"cat\\": 25, \\"blue sky\\": 1, \\"day\\": 9, \\"sky\\": 7, \\"surprised\\": 5, \\"black hair\\": 22, \\"white background\\": 4, \\"wide-eyed\\": 5, \\"dress\\": 7, \\"off-shoulder dress\\": 1, \\"simple background\\": 5, \\"looking at viewer\\": 9, \\"blush\\": 19, \\"door\\": 1, \\"long sleeves\\": 8, \\"book\\": 16, \\"socks\\": 12, \\"bookshelf\\": 2, \\"barefoot\\": 2, \\"heart\\": 2, \\"white dress\\": 2, \\"breasts\\": 1, \\"sleeveless\\": 1, \\"upper body\\": 8, \\"frown\\": 1, \\"closed mouth\\": 7, \\"grin\\": 2, \\"short hair\\": 3, \\"running\\": 4, \\"motion blur\\": 1, \\"bag\\": 14, \\"speed lines\\": 1, \\"arm up\\": 1, \\"laughing\\": 1, \\":d\\": 3, \\"freckles\\": 4, \\"clenched teeth\\": 1, \\"teeth\\": 2, \\"leg warmers\\": 4, \\"loose socks\\": 3, \\"^^^\\": 2, \\"one eye closed\\": 2, \\"black eyes\\": 2, \\"broom\\": 9, \\"railing\\": 1, \\"boots\\": 9, \\"paper\\": 2, \\"holding paper\\": 1, \\"brown headwear\\": 1, \\"plaid\\": 2, \\"indoors\\": 2, \\"hands on hips\\": 2, \\"spiked hair\\": 3, \\"angry\\": 1, \\"from behind\\": 2, \\"dirty\\": 1, \\"red vest\\": 1, \\"belt\\": 2, \\"1boy\\": 3, \\"solo focus\\": 1, \\"shorts\\": 3, \\"striped\\": 1, \\"torn clothes\\": 2, \\"male focus\\": 2, \\"signature\\": 1, \\"from side\\": 2, \\"handbag\\": 4, \\"reading\\": 2, \\"walking\\": 1, \\"quill\\": 2, \\"feathers\\": 2, \\"fingernails\\": 1, \\"holding book\\": 3, \\"open book\\": 2, \\"robot\\": 1, \\"spider web\\": 1, \\"silk\\": 1, \\"messenger bag\\": 1, \\"weapon\\": 3, \\"sword\\": 2, \\"grass\\": 3, \\"nature\\": 5, \\"tree\\": 6, \\"forest\\": 4, \\"apron\\": 2, \\"sleeves rolled up\\": 1, \\"tray\\": 1, \\"tears\\": 3, \\"horse\\": 1, \\"covering face\\": 1, \\"kneehighs\\": 1, \\"bottle\\": 2, \\"blue background\\": 2, \\"sweat\\": 1, \\"flask\\": 1, \\":o\\": 1, \\"orange background\\": 1, \\"mug\\": 2, \\"messy hair\\": 1, \\"stick\\": 1, \\"injury\\": 1, \\"sleeping\\": 1, \\"lying\\": 2, \\"broom riding\\": 5, \\"cape\\": 2, \\"coin\\": 1, \\"crying\\": 2, \\"kneeling\\": 1, \\"holding weapon\\": 1, \\"holding sword\\": 1, \\"multiple girls\\": 3, \\"2girls\\": 1, \\"braid\\": 2, \\"fire\\": 4, \\"portrait\\": 2, \\"sidelocks\\": 1, \\"forehead\\": 2, \\"v-shaped eyebrows\\": 1, \\"looking to the side\\": 1, \\"basket\\": 2, \\"cave\\": 1, \\"straw hat\\": 3, \\"flower\\": 1, \\"from above\\": 1, \\"looking up\\": 1, \\"multiple boys\\": 1, \\"armor\\": 1, \\"polearm\\": 1, \\"ocean\\": 1, \\"cloud\\": 5, \\"beach\\": 2, \\"blurry\\": 1, \\"blurry background\\": 1, \\"skewer\\": 1, \\"multicolored hair\\": 1, \\"two-tone hair\\": 1, \\"swimsuit\\": 4, \\"fish\\": 1, \\"fork\\": 1, \\"bikini\\": 3, \\"navel\\": 1, \\"polka dot\\": 3, \\"polka dot bikini\\": 2, \\"monochrome\\": 5, \\"greyscale\\": 5, \\"bow\\": 2, \\"watercraft\\": 1, \\"boat\\": 1, \\"witch\\": 2, \\"shell\\": 1, \\"jewelry\\": 1, \\"earrings\\": 1, \\"head rest\\": 2, \\"rabbit\\": 1, \\"chair\\": 2, \\"suspenders\\": 1, \\"window\\": 1, \\"plant\\": 1, \\"holding cup\\": 1, \\"pants\\": 1, \\"tentacles\\": 1, \\"underwater\\": 1, \\"octopus\\": 1, \\"bubble\\": 1, \\"air bubble\\": 1, \\"playing games\\": 1, \\"board game\\": 1, \\"hood\\": 1, \\"staff\\": 1, \\"hood up\\": 1, \\"hug\\": 1, \\"purple hair\\": 1, \\"hand to own mouth\\": 1, \\"green shirt\\": 1, \\"gloves\\": 3, \\"flying\\": 4, \\"bird\\": 1, \\"mouse\\": 2, \\"animal\\": 1, \\"rain\\": 1, \\"under tree\\": 1, \\"against tree\\": 1, \\"expressions\\": 1, \\"multiple views\\": 1, \\"reference sheet\\": 1, \\"airship\\": 1, \\"falling\\": 1, \\"floating island\\": 1, \\"crossed arms\\": 1, \\"brown background\\": 1, \\"profile\\": 1, \\"potion\\": 1, \\"sketch\\": 2, \\"thinking\\": 1, \\"hand on own chin\\": 1, \\"detached sleeves\\": 1}}, \\"bucket_info\\": {\\"buckets\\": {\\"0\\": {\\"resolution\\": [128, 256], \\"count\\": 2}, \\"1\\": {\\"resolution\\": [128, 320], \\"count\\": 2}, \\"2\\": {\\"resolution\\": [128, 448], \\"count\\": 2}, \\"3\\": {\\"resolution\\": [192, 256], \\"count\\": 10}, \\"4\\": {\\"resolution\\": [192, 384], \\"count\\": 2}, \\"5\\": {\\"resolution\\": [192, 448], \\"count\\": 2}, \\"6\\": {\\"resolution\\": [192, 512], \\"count\\": 4}, \\"7\\": {\\"resolution\\": [192, 768], \\"count\\": 2}, \\"8\\": {\\"resolution\\": [256, 128], \\"count\\": 2}, \\"9\\": {\\"resolution\\": [256, 192], \\"count\\": 6}, \\"10\\": {\\"resolution\\": [256, 256], \\"count\\": 4}, \\"11\\": {\\"resolution\\": [256, 384], \\"count\\": 2}, \\"12\\": {\\"resolution\\": [256, 448], \\"count\\": 8}, \\"13\\": {\\"resolution\\": [256, 512], \\"count\\": 2}, \\"14\\": {\\"resolution\\": [256, 768], \\"count\\": 2}, \\"15\\": {\\"resolution\\": [320, 256], \\"count\\": 2}, \\"16\\": {\\"resolution\\": [320, 576], \\"count\\": 2}, \\"17\\": {\\"resolution\\": [320, 704], \\"count\\": 4}, \\"18\\": {\\"resolution\\": [320, 768], \\"count\\": 4}, \\"19\\": {\\"resolution\\": [320, 896], \\"count\\": 2}, \\"20\\": {\\"resolution\\": [384, 192], \\"count\\": 2}, \\"21\\": {\\"resolution\\": [384, 256], \\"count\\": 2}, \\"22\\": {\\"resolution\\": [384, 448], \\"count\\": 2}, \\"23\\": {\\"resolution\\": [384, 512], \\"count\\": 2}, \\"24\\": {\\"resolution\\": [384, 576], \\"count\\": 4}, \\"25\\": {\\"resolution\\": [384, 640], \\"count\\": 4}, \\"26\\": {\\"resolution\\": [384, 704], \\"count\\": 2}, \\"27\\": {\\"resolution\\": [384, 832], \\"count\\": 2}, \\"28\\": {\\"resolution\\": [448, 128], \\"count\\": 2}, \\"29\\": {\\"resolution\\": [448, 448], \\"count\\": 4}, \\"30\\": {\\"resolution\\": [448, 576], \\"count\\": 4}, \\"31\\": {\\"resolution\\": [448, 640], \\"count\\": 4}, \\"32\\": {\\"resolution\\": [448, 704], \\"count\\": 2}, \\"33\\": {\\"resolution\\": [448, 768], \\"count\\": 2}, \\"34\\": {\\"resolution\\": [512, 512], \\"count\\": 2}, \\"35\\": {\\"resolution\\": [512, 640], \\"count\\": 2}, \\"36\\": {\\"resolution\\": [512, 704], \\"count\\": 4}, \\"37\\": {\\"resolution\\": [512, 768], \\"count\\": 4}, \\"38\\": {\\"resolution\\": [512, 1024], \\"count\\": 2}, \\"39\\": {\\"resolution\\": [576, 704], \\"count\\": 2}, \\"40\\": {\\"resolution\\": [576, 768], \\"count\\": 4}, \\"41\\": {\\"resolution\\": [576, 1024], \\"count\\": 2}, \\"42\\": {\\"resolution\\": [704, 448], \\"count\\": 2}, \\"43\\": {\\"resolution\\": [704, 768], \\"count\\": 4}, \\"44\\": {\\"resolution\\": [704, 832], \\"count\\": 2}, \\"45\\": {\\"resolution\\": [704, 1024], \\"count\\": 2}, \\"46\\": {\\"resolution\\": [768, 576], \\"count\\": 2}, \\"47\\": {\\"resolution\\": [768, 768], \\"count\\": 2}, \\"48\\": {\\"resolution\\": [832, 576], \\"count\\": 2}, \\"49\\": {\\"resolution\\": [832, 832], \\"count\\": 2}, \\"50\\": {\\"resolution\\": [832, 1024], \\"count\\": 4}, \\"51\\": {\\"resolution\\": [896, 576], \\"count\\": 2}, \\"52\\": {\\"resolution\\": [896, 768], \\"count\\": 2}, \\"53\\": {\\"resolution\\": [960, 704], \\"count\\": 2}, \\"54\\": {\\"resolution\\": [960, 832], \\"count\\": 2}, \\"55\\": {\\"resolution\\": [960, 960], \\"count\\": 2}, \\"56\\": {\\"resolution\\": [1024, 704], \\"count\\": 2}, \\"57\\": {\\"resolution\\": [1024, 768], \\"count\\": 2}, \\"58\\": {\\"resolution\\": [1024, 1024], \\"count\\": 6}, \\"59\\": {\\"resolution\\": [1088, 704], \\"count\\": 4}, \\"60\\": {\\"resolution\\": [1088, 896], \\"count\\": 4}, \\"61\\": {\\"resolution\\": [1152, 768], \\"count\\": 4}, \\"62\\": {\\"resolution\\": [1216, 768], \\"count\\": 6}, \\"63\\": {\\"resolution\\": [1216, 832], \\"count\\": 2}, \\"64\\": {\\"resolution\\": [1280, 768], \\"count\\": 2}, \\"65\\": {\\"resolution\\": [1344, 768], \\"count\\": 10}, \\"66\\": {\\"resolution\\": [1408, 640], \\"count\\": 2}, \\"67\\": {\\"resolution\\": [1472, 576], \\"count\\": 2}}, \\"mean_img_ar_error\\": 0.04257648019652614}, \\"subsets\\": [{\\"img_count\\": 102, \\"num_repeats\\": 2, \\"color_aug\\": false, \\"flip_aug\\": false, \\"random_crop\\": false, \\"shuffle_caption\\": true, \\"keep_tokens\\": 0, \\"image_dir\\": \\"img\\", \\"class_tokens\\": null, \\"is_reg\\": false}]}]", "ss_clip_skip": "2", "ss_full_fp16": "False", "ss_optimizer": "prodigyopt.prodigy.Prodigy(decouple=True,weight_decay=0.5,betas=(0.9, 0.99),use_bias_correction=False)", "ss_num_epochs": "10", "ss_session_id": "3851886725", "modelspec.date": "2024-09-11T15:17:43", "ss_network_dim": "32", "ss_output_name": "Pepper__Carrot", "modelspec.title": "Pepper__Carrot", "ss_dataset_dirs": "{\\"img\\": {\\"n_repeats\\": 2, \\"img_count\\": 102}}", "ss_lr_scheduler": "cosine", "ss_noise_offset": "0.03", "sshs_model_hash": "52e53d98fe907d8b11eba16ce27575bea66ea987e2a1c0a8e9c2240909f01ff3", "ss_cache_latents": "True", "ss_learning_rate": "1.0", "ss_max_grad_norm": "1.0", "ss_min_snr_gamma": "5.0", "ss_network_alpha": "32", "ss_sd_model_hash": "e577480d", "ss_sd_model_name": "290640.safetensors", "ss_tag_frequency": {"img": {":d": 3, ":o": 1, "^^^": 2, "bag": 14, "bow": 2, "cat": 25, "cup": 6, "day": 9, "hat": 63, "hug": 1, "mug": 2, "sky": 7, "wet": 2, "1boy": 3, "belt": 2, "bird": 1, "boat": 1, "book": 16, "cape": 2, "cave": 1, "coin": 1, "door": 1, "fire": 4, "fish": 1, "food": 2, "fork": 1, "grin": 2, "hood": 1, "nude": 1, "rain": 1, "silk": 1, "solo": 63, "tray": 1, "tree": 6, "vest": 37, "1girl": 96, "angry": 1, "apron": 2, "armor": 1, "beach": 2, "blush": 19, "boots": 9, "braid": 2, "broom": 9, "chair": 2, "cloud": 5, "dirty": 1, "dress": 7, "flask": 1, "frown": 1, "grass": 3, "heart": 2, "horse": 1, "lying": 2, "mouse": 2, "navel": 1, "ocean": 1, "pants": 1, "paper": 2, "plaid": 2, "plant": 1, "quill": 2, "robot": 1, "shell": 1, "shirt": 17, "skirt": 28, "smile": 40, "socks": 12, "staff": 1, "steam": 2, "stick": 1, "sweat": 1, "sword": 2, "tears": 3, "teeth": 2, "water": 3, "witch": 2, "2girls": 1, "animal": 1, "arm up": 1, "basket": 2, "bikini": 3, "blurry": 1, "bottle": 2, "bubble": 1, "crying": 2, "flower": 1, "flying": 4, "forest": 4, "gloves": 3, "injury": 1, "nature": 5, "potion": 1, "rabbit": 1, "shorts": 3, "sketch": 2, "skewer": 1, "tattoo": 2, "weapon": 3, "window": 1, "airship": 1, "armband": 11, "bathing": 1, "breasts": 1, "falling": 1, "handbag": 4, "holding": 11, "hood up": 1, "indoors": 2, "jewelry": 1, "octopus": 1, "polearm": 1, "profile": 1, "railing": 1, "reading": 2, "running": 4, "sitting": 13, "striped": 1, "walking": 1, "barefoot": 2, "blue sky": 1, "earrings": 1, "feathers": 2, "forehead": 2, "freckles": 4, "kneeling": 1, "laughing": 1, "outdoors": 7, "portrait": 2, "red vest": 1, "sleeping": 1, "swimsuit": 4, "thinking": 1, "blue eyes": 8, "bookshelf": 2, "from side": 2, "greyscale": 5, "head rest": 2, "kneehighs": 1, "long hair": 40, "open book": 2, "polka dot": 3, "sidelocks": 1, "signature": 1, "straw hat": 3, "surprised": 5, "tentacles": 1, "wide-eyed": 5, "witch hat": 19, "air bubble": 1, "black eyes": 2, "black hair": 22, "board game": 1, "brown eyes": 16, "brown hair": 75, "brown vest": 2, "cowboy hat": 8, "from above": 1, "looking up": 1, "male focus": 2, "messy hair": 1, "monochrome": 5, "open mouth": 46, "short hair": 3, "sleeveless": 1, "solo focus": 1, "spider web": 1, "suspenders": 1, "under tree": 1, "underwater": 1, "upper body": 8, "watercraft": 1, "closed eyes": 10, "expressions": 1, "fingernails": 1, "from behind": 2, "green shirt": 1, "holding cup": 1, "leg warmers": 4, "loose socks": 3, "motion blur": 1, "purple hair": 1, "speed lines": 1, "spiked hair": 3, "white dress": 2, "white shirt": 11, "against tree": 1, "broom riding": 5, "closed mouth": 7, "crossed arms": 1, "holding book": 3, "indian style": 1, "long sleeves": 8, "off shoulder": 2, "torn clothes": 2, "covering face": 1, "hands on hips": 2, "holding paper": 1, "holding sword": 1, "messenger bag": 1, "multiple boys": 1, "playing games": 1, "two-tone hair": 1, "bare shoulders": 2, "brown headwear": 1, "clenched teeth": 1, "holding weapon": 1, "multiple girls": 3, "multiple views": 1, "one eye closed": 2, "blue background": 2, "floating island": 1, "reference sheet": 1, "brown background": 1, "detached sleeves": 1, "hand on own chin": 1, "polka dot bikini": 2, "white background": 4, "blurry background": 1, "hand to own mouth": 1, "looking at viewer": 9, "multicolored hair": 1, "orange background": 1, "simple background": 5, "sleeves rolled up": 1, "v-shaped eyebrows": 1, "off-shoulder dress": 1, "looking to the side": 1}}, "sshs_legacy_hash": "091bd199", "ss_ip_noise_gamma": "None", "ss_network_module": "networks.lora", "ss_num_reg_images": "0", "ss_lr_warmup_steps": "0", "ss_max_train_steps": "740", "ss_mixed_precision": "bf16", "ss_network_dropout": "None", "ss_text_encoder_lr": "1.0", "ss_max_token_length": "225", "ss_num_train_images": "204", "ss_training_comment": "None", "modelspec.resolution": "1024x1024", "ss_new_sd_model_hash": "67ab2fd8ec439a89b3fedb15cc65f54336af163c7eb5e4f2acc98f090a29b0b3", "ss_prior_loss_weight": "1.0", "ss_zero_terminal_snr": "False", "ss_base_model_version": "sdxl_base_v1-0", "ss_scale_weight_norms": "None", "modelspec.architecture": "stable-diffusion-xl-v1-base/lora", "ss_debiased_estimation": "False", "ss_face_crop_aug_range": "None", "ss_training_started_at": "1726066908.2484195", "modelspec.encoder_layer": "2", "ss_adaptive_noise_scale": "None", "ss_caption_dropout_rate": "0.0", "ss_training_finished_at": "1726067863.29673", "modelspec.implementation": "https://github.com/Stability-AI/generative-models", "modelspec.sai_model_spec": "1.0.0", "ss_num_batches_per_epoch": "74", "modelspec.prediction_type": "epsilon", "ss_gradient_checkpointing": "True", "ss_sd_scripts_commit_hash": "f9317052edb4ab3b3c531ac3b28825ee78b4a966", "ss_multires_noise_discount": "0.3", "ss_caption_tag_dropout_rate": "0.0", "ss_multires_noise_iterations": "6", "ss_gradient_accumulation_steps": "1", "ss_caption_dropout_every_n_epochs": "0"}'
        : null, // headerData // TODO
      randw([
        { value: null, weight: 100 },
        { value: faker.word.noun(), weight: 1 },
      ]), // overrideName
    ];
    ret.push(row);
  }
  return ret;
};

const genTools = (num: number) => {
  const ret = [];

  for (let step = 1; step <= num; step++) {
    const created = faker.date.past({ years: 3 }).toISOString();
    const name = faker.company.name();
    const page = faker.internet.url();

    const row = [
      step, // id
      name, // name
      null, // icon // TODO image
      created, // createdAt
      rand(Object.values(ToolType)), // type
      fbool(0.9), // enabled
      randw([
        { value: null, weight: 1 },
        {
          value:
            page +
            randw([
              { value: '', weight: 5 },
              { value: '/stuff', weight: 1 },
            ]),
          weight: 5,
        },
      ]), // domain
      randw([
        { value: null, weight: 1 },
        { value: faker.lorem.paragraph(), weight: 5 },
      ]), // description
      randw([
        { value: null, weight: 1 },
        { value: page, weight: 5 },
      ]), // homepage
      rand([null, name]), // company
      null, // priority
      '{}', // metadata
    ];

    ret.push(row);
  }
  return ret;
};

const genTechniques = () => {
  return [
    [1, 'txt2img', '2024-05-20 22:00:06.478', true, 'Image'],
    [2, 'img2img', '2024-05-20 22:00:06.478', true, 'Image'],
    [3, 'inpainting', '2024-05-20 22:00:06.478', true, 'Image'],
    [4, 'workflow', '2024-05-20 22:00:06.478', true, 'Image'],
    [5, 'vid2vid', '2024-05-20 22:00:06.478', true, 'Video'],
    [6, 'txt2vid', '2024-05-20 22:00:06.478', true, 'Video'],
    [7, 'img2vid', '2024-05-20 22:00:06.478', true, 'Video'],
    [8, 'controlnet', '2024-06-04 16:31:37.241', true, 'Image'],
  ];
};

const genPosts = (num: number, userIds: number[], mvIds: number[]) => {
  const ret = [];

  for (let step = 1; step <= num; step++) {
    const created = faker.date.past({ years: 3 }).toISOString();
    const isPublished = fbool(0.8);
    const mvId = rand([null, rand(mvIds)]);

    const row = [
      step, // id
      fbool(0.4), // nsfw // 40% actually seems fair :/
      rand([null, `${faker.word.adjective()} ${faker.word.adjective()} ${faker.word.noun()}`]), // title
      rand([null, `<p>${faker.lorem.sentence()}</p>`]), // detail
      rand(userIds), // userId
      mvId, // modelVersionId
      created, // createdAt
      rand([created, faker.date.between({ from: created, to: Date.now() }).toISOString()]), // updatedAt
      !isPublished ? null : faker.date.between({ from: created, to: Date.now() }).toISOString(), // publishedAt
      !isPublished ? null : `{"imageNsfw": "${rand(Object.values(NsfwLevel))}"}`, // metadata
      fbool(0.01), // tosViolation
      null, // collectionId // TODO
      randw([
        { value: 'Public', weight: 30 },
        {
          value: rand(
            Object.values(Availability).filter((v) => !['Public', 'EarlyAccess'].includes(v))
          ),
          weight: 1,
        },
      ]), // availability
      fbool(0.01), // unlisted
      randw([
        { value: 0, weight: 1 },
        { value: 1, weight: 6 },
        { value: 4, weight: 2 },
        { value: 8, weight: 3 },
        { value: 16, weight: 4 },
      ]), // nsfwLevel
    ];

    ret.push(row);
  }
  return ret;
};

const genImages = (num: number, userIds: number[], postIds: number[]) => {
  const ret = [];

  // TODO try to use the s3 uploaded URLs

  for (let step = 1; step <= num; step++) {
    const created = faker.date.past({ years: 3 }).toISOString();
    const type = randw([
      { value: 'image', weight: 20 },
      { value: 'video', weight: 4 },
      // { value: 'audio', weight: 1 }, // not using audio
    ]);
    const mime = type === 'image' ? rand(IMAGE_MIME_TYPE) : rand(VIDEO_MIME_TYPE);
    const ext = mime.split('/').pop();
    const width = rand([128, 256, 512, 768, 1024, 1920]);
    const height = rand([128, 256, 512, 768, 1024, 1920]);
    const hash = faker.string.sample(36);
    const isGenned = fbool();

    // [{"name": "ahegao_sdxl_v4", "type": "lora", "weight": 0.95}]

    const row = [
      `${capitalize(faker.word.adjective())}-${capitalize(
        faker.word.noun()
      )}-${faker.number.int()}.${ext}`, // name
      faker.image.url({ width, height }), // url
      created, // createdAt
      rand([created, faker.date.between({ from: created, to: Date.now() }).toISOString()]), // updatedAt
      hash, // hash
      step, // id
      rand(userIds), // userId
      height, // height
      width, // width
      !isGenned
        ? null
        : `{"Size": "${width}x${height}", "seed": ${faker.string.numeric(
            10
          )}, "steps": ${faker.number.int(
            100
          )}, "prompt": "${faker.lorem.sentence()}", "sampler": "${rand(
            constants.samplers
          )}", "cfgScale": ${faker.number.int(10)}, "clipSkip": ${rand([
            0, 1, 2,
          ])}, "resources": ${randw([
            { value: '[]', weight: 5 },
            {
              value: `[{"name": "${faker.word.noun()}", "type": "lora", "weight": 0.95}]`,
              weight: 1,
            },
          ])}, "Created Date": "${created}", "negativePrompt": "bad stuff", "civitaiResources": [{"type": "checkpoint", "modelVersionId": 272376, "modelVersionName": "1.0"}]}`, // meta
      fbool(0.01), // tosViolation
      null, // analysis
      isGenned ? rand(Object.values(ImageGenerationProcess)) : null, // generationProcess
      null, // featuredAt
      fbool(0.05), // hideMeta
      faker.number.int(20), // index
      mime, // mimeType
      randw([
        { value: null, weight: 1 },
        { value: rand(postIds), weight: 10 },
      ]), // postId
      faker.date.between({ from: created, to: Date.now() }).toISOString(), // scanRequestedAt
      faker.date.between({ from: created, to: Date.now() }).toISOString(), // scannedAt
      null, // sizeKb
      rand(Object.values(NsfwLevel)), // nsfw
      null, // blockedFor
      'Scanned', // ingestion
      null, // needsReview
      type === 'image'
        ? `{"hash": "${hash}", "size": ${faker.number.int(
            1_000_000
          )}, "width": ${width}, "height": ${height}}`
        : `{"hash": "${hash}", "size": ${faker.number.int(
            1_000_000
          )}, "width": ${width}, "height": ${height}}, "audio": ${fbool(
            0.2
          )}, "duration": ${faker.number.float(30)}`, // metadata
      type, // type
      '{"wd14": "20279865", "scans": {"WD14": 1716391779426, "Rekognition": 1716391774556}, "rekognition": "20279864", "common-conversions": "20279863"}', // scanJobs
      randw([
        { value: 0, weight: 1 },
        { value: 1, weight: 6 },
        { value: 4, weight: 2 },
        { value: 8, weight: 3 },
        { value: 16, weight: 4 },
      ]), // nsfwLevel
      fbool(0.05), // nsfwLevelLocked
      randw([
        { value: 0, weight: 1 },
        { value: 1, weight: 6 },
        { value: 4, weight: 2 },
        { value: 8, weight: 3 },
        { value: 16, weight: 4 },
      ]), // aiNsfwLevel
      'urn:air:mixture:model:huggingface:Civitai/mixtureMovieRater', // aiModel
      created, // sortAt
      -1 * faker.number.int({ min: 1e12 }), // pHash // this is actually a bigInt but faker does weird stuff
    ];

    ret.push(row);
  }
  return ret;
};

const genArticles = (num: number, userIds: number[], imageIds: number[]) => {
  const ret = [];

  for (let step = 1; step <= num; step++) {
    const created = faker.date.past({ years: 3 }).toISOString();

    const row = [
      step, // id
      created, // createdAt
      rand([created, faker.date.between({ from: created, to: Date.now() }).toISOString()]), // updatedAt
      fbool(0.2), // nsfw
      fbool(0.01), // tosViolation
      null, // metadata
      faker.lorem.sentence(), // title
      `<p>${faker.lorem.paragraphs({ min: 1, max: 10 }, '<br/>')}</p>`, // content
      rand([null, '']), // cover // TODO with images
      rand([null, faker.date.between({ from: created, to: Date.now() }).toISOString()]), // publishedAt
      rand(userIds), // userId
      randw([
        { value: 'Public', weight: 30 },
        {
          value: rand(
            Object.values(Availability).filter((v) => !['Public', 'EarlyAccess'].includes(v))
          ),
          weight: 1,
        },
      ]), // availability
      fbool(0.01), // unlisted
      rand(imageIds), // coverId
      randw([
        { value: 0, weight: 1 },
        { value: 1, weight: 4 },
        { value: 28, weight: 3 },
        { value: 15, weight: 2 },
        { value: 31, weight: 2 },
      ]), // nsfwLevel
      randw([
        { value: 0, weight: 6 },
        { value: 1, weight: 4 },
        { value: 28, weight: 3 },
        { value: 15, weight: 2 },
        { value: 31, weight: 2 },
      ]), // userNsfwLevel
      randw([
        { value: '{}', weight: 6 },
        { value: '{userNsfwLevel}', weight: 1 },
      ]), // lockedProperties
    ];

    ret.push(row);
  }
  return ret;
};

const genImageTools = (num: number, imageIds: number[], toolIds: number[]) => {
  const ret = [];

  for (let step = 1; step <= num; step++) {
    const created = faker.date.past({ years: 3 }).toISOString();
    const imageId = rand(imageIds);
    // newImageIds = newImageIds.filter((i) => i !== imageId);

    const row = [
      imageId, // imageId
      rand(toolIds), // toolId
      null, // notes
      created, // createdAt
    ];

    ret.push(row);
  }
  return ret;
};

const genImageTechniques = (num: number, imageIds: number[], techniqueIds: number[]) => {
  const ret = [];

  for (let step = 1; step <= num; step++) {
    const created = faker.date.past({ years: 3 }).toISOString();
    const imageId = rand(imageIds);
    // newImageIds = newImageIds.filter((i) => i !== imageId);

    const row = [
      imageId, // imageId
      rand(techniqueIds), // techniqueId
      randw([
        { value: null, weight: 20 },
        { value: faker.lorem.sentence(), weight: 1 },
      ]), // notes
      created, // createdAt
    ];

    ret.push(row);
  }
  return ret;
};

const genTags = (num: number) => {
  const ret = [
    [
      'anime',
      null,
      '2023-02-18 02:41:35.011',
      '2023-03-11 08:58:19.316',
      1,
      '{Model,Question,Image,Post}',
      false,
      true,
      false,
      'Label',
      'None',
      false,
      1,
    ],
    [
      'woman',
      null,
      '2023-02-17 18:05:45.976',
      '2023-05-02 05:15:29.764',
      2,
      '{Model,Image,Post,Question}',
      false,
      true,
      false,
      'Label',
      'None',
      false,
      1,
    ],
    [
      'photography',
      null,
      '2023-02-17 18:42:12.828',
      '2024-01-18 21:42:41.591',
      3,
      '{Model,Image,Post,Question}',
      false,
      true,
      false,
      'Label',
      'None',
      false,
      1,
    ],
    [
      'celebrity',
      null,
      '2023-02-17 18:42:12.828',
      '2023-03-03 22:03:56.586',
      4,
      '{Model,Image,Question,Post}',
      false,
      true,
      false,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'subject',
      null,
      '2022-11-12 21:57:05.708',
      '2022-11-12 21:57:05.708',
      5,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'hentai',
      null,
      '2023-02-17 18:42:12.828',
      '2023-02-17 18:42:12.828',
      6,
      '{Model,Image,Post}',
      false,
      true,
      true,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'character',
      null,
      '2023-02-18 02:41:35.011',
      '2023-02-18 02:55:57.727',
      7,
      '{Model,Question,Image,Post}',
      false,
      true,
      false,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'porn',
      null,
      '2023-02-17 19:02:56.629',
      '2023-02-17 19:02:56.629',
      8,
      '{Model,Image,Post}',
      false,
      true,
      true,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'animals',
      null,
      '2022-11-04 17:59:01.748',
      '2022-11-04 17:59:01.748',
      9,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'retro',
      null,
      '2022-11-30 09:51:50.239',
      '2022-11-30 09:51:50.239',
      10,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'food',
      null,
      '2023-02-11 12:49:13.847',
      '2023-03-11 09:35:57.749',
      11,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'Label',
      'None',
      false,
      1,
    ],
    [
      '3d',
      null,
      '2022-11-04 19:46:47.389',
      '2022-11-04 19:46:47.389',
      12,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'scifi',
      null,
      '2022-12-26 03:02:24.520',
      '2022-12-26 03:02:24.520',
      13,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'graphic design',
      null,
      '2023-02-17 03:23:59.457',
      '2023-02-17 03:23:59.457',
      14,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'landscapes',
      null,
      '2022-11-04 17:36:59.422',
      '2022-11-04 17:36:59.422',
      15,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'man',
      null,
      '2023-02-17 18:42:12.828',
      '2023-03-11 08:42:56.790',
      16,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'Label',
      'None',
      false,
      1,
    ],
    [
      'meme',
      null,
      '2022-11-30 02:50:49.164',
      '2023-11-18 12:02:18.061',
      17,
      '{Model,Image,Post,Question}',
      false,
      true,
      true,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'video game',
      null,
      '2023-02-17 18:42:12.828',
      '2023-02-17 18:42:12.828',
      18,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'furry',
      null,
      '2023-02-17 18:12:44.997',
      '2023-02-17 18:12:44.997',
      19,
      '{Model,Image,Post}',
      false,
      true,
      true,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'groteseque',
      null,
      '2023-02-17 18:42:12.828',
      '2023-02-17 18:42:12.828',
      20,
      '{Model,Image,Post}',
      false,
      true,
      true,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'illustration',
      null,
      '2023-02-17 18:13:02.026',
      '2023-02-17 18:13:02.026',
      21,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'fantasy',
      null,
      '2023-02-17 18:42:12.828',
      '2023-02-17 18:42:12.828',
      22,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'architecture',
      null,
      '2022-12-15 01:17:05.065',
      '2023-03-11 09:20:31.396',
      23,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'Label',
      'None',
      false,
      1,
    ],
    [
      'horror',
      null,
      '2022-11-09 23:08:24.969',
      '2022-11-09 23:08:24.969',
      24,
      '{Model,Image,Post}',
      false,
      true,
      true,
      'UserGenerated',
      'None',
      false,
      1,
    ],
    [
      'cartoon',
      null,
      '2023-02-17 18:42:12.828',
      '2023-03-11 09:43:10.712',
      25,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'Label',
      'None',
      false,
      1,
    ],
    [
      'cars',
      null,
      '2023-02-17 18:42:12.828',
      '2023-02-17 18:42:12.828',
      26,
      '{Model,Image,Post}',
      false,
      true,
      false,
      'UserGenerated',
      'None',
      false,
      1,
    ],
  ];

  const retLen = ret.length;

  for (let step = retLen + 1; step <= retLen + num; step++) {
    const created = faker.date.past({ years: 3 }).toISOString();

    const row = [
      rand([faker.word.noun(), `${faker.word.adjective()} ${faker.word.noun()}`]), // name
      null, // color
      created, // createdAt
      rand([created, faker.date.between({ from: created, to: Date.now() }).toISOString()]), // updatedAt
      step, // id
      randw([
        { value: '{Image,Model,Post}', weight: 1 },
        { value: '{Post}', weight: 10 },
        { value: '{Model,Post}', weight: 5 },
        { value: '{Model}', weight: 5 },
        { value: '{Image}', weight: 2 },
      ]), // target
      fbool(0.001), // unlisted
      false, // isCategory
      fbool(0.001), // unfeatured
      randw([
        { value: TagType.System, weight: 5 },
        { value: TagType.Moderation, weight: 30 },
        { value: TagType.Label, weight: 7500 },
        { value: TagType.UserGenerated, weight: 150000 },
      ]), // type
      'None', // nsfw
      false, // adminOnly
      1, // nsfwLevel
    ];

    ret.push(row);
  }
  return ret;
};

// TODO these tags should probably be looking at the "target"

const genTagsOnArticles = (num: number, tagIds: number[], articleIds: number[]) => {
  const ret = [];

  for (let step = 1; step <= num; step++) {
    const created = faker.date.past({ years: 3 }).toISOString();

    const row = [
      rand(articleIds), // articleId
      rand(tagIds), // tagId
      created, // createdAt
    ];

    ret.push(row);
  }
  return ret;
};

const genTagsOnPosts = (num: number, tagIds: number[], postIds: number[]) => {
  const ret = [];

  for (let step = 1; step <= num; step++) {
    const created = faker.date.past({ years: 3 }).toISOString();

    const row = [
      rand(postIds), // postId
      rand(tagIds), // tagId
      created, // createdAt
      null, // confidence
      false, // disabled
      false, // needsReview
    ];

    ret.push(row);
  }
  return ret;
};

const genTagsOnImages = (num: number, tagIds: number[], imageIds: number[]) => {
  const ret = [];

  for (let step = 1; step <= num; step++) {
    const created = faker.date.past({ years: 3 }).toISOString();
    const isAutomated = fbool();
    const isDisabled = fbool(0.01);

    const row = [
      rand(imageIds), // imageId
      rand(tagIds), // tagId
      created, // createdAt
      isAutomated, // automated
      isAutomated ? faker.number.int(99) : null, // confidence
      isDisabled, // disabled
      false, // needsReview
      isDisabled ? faker.date.between({ from: created, to: Date.now() }).toISOString() : null, // disabledAt
      isAutomated
        ? rand([TagSource.WD14, TagSource.Rekognition, TagSource.Computed])
        : TagSource.User, // source
      'Voted', // tagDisabledReason
    ];

    ret.push(row);
  }
  return ret;
};

const genTagsOnModels = (num: number, tagIds: number[], modelIds: number[]) => {
  const ret = [];

  for (let step = 1; step <= num; step++) {
    const created = faker.date.past({ years: 3 }).toISOString();

    const row = [
      rand(modelIds), // modelId
      rand(tagIds), // tagId
      created, // createdAt
    ];

    ret.push(row);
  }
  return ret;
};

const genRows = async () => {
  const users = genUsers(10, true);
  const userIds = users.map((u) => u[4] as number);

  const models = genModels(10, userIds);
  const modelData = models.map((m) => ({ id: m[6] as number, type: m[25] as ModelUploadType }));
  const modelIds = models.map((m) => m[6] as number);

  const mvs = genMvs(10, modelData);
  const mvData = mvs.map((mv) => ({
    id: mv[6] as number,
    type: mv[mv.length - 1] as ModelUploadType,
  }));

  const mFiles = genMFiles(10, mvData);

  const posts = genPosts(
    10,
    userIds,
    mvData.map((mv) => mv.id)
  );
  const postIds = posts.map((p) => p[0] as number);

  const images = genImages(10, userIds, postIds);
  const imageIds = images.map((i) => i[5] as number);

  const articles = genArticles(10, userIds, imageIds);
  const articleIds = articles.map((i) => i[0] as number);

  const tools = genTools(10);
  const techniques = genTechniques();

  const imageTools = genImageTools(
    10,
    imageIds,
    tools.map((t) => t[0] as number)
  );
  const imageTechniques = genImageTechniques(
    10,
    imageIds,
    techniques.map((t) => t[0] as number)
  );

  const tags = genTags(10);
  const tagIds = tags.map((t) => t[4] as number);

  const tagsOnArticles = genTagsOnArticles(10, tagIds, articleIds);
  const tagsOnPosts = genTagsOnPosts(10, tagIds, postIds);
  const tagsOnImages = genTagsOnImages(10, tagIds, imageIds);
  const tagsOnModels = genTagsOnModels(10, tagIds, modelIds);

  // TagsOnImageVote
  // TagsOnModelsVote

  /*
  Account
  Announcement
  ❌ Answer
  ❌ AnswerMetric
  ❌ AnswerReaction
  ❌ AnswerVote
  ApiKey
  ✔️ Article
  ArticleEngagement
  ArticleMetric
  ArticleRank
  ArticleReaction
  ArticleReport
  BlockedImage
  Bounty
  BountyBenefactor
  BountyEngagement
  BountyEntry
  BountyEntryMetric
  BountyEntryRank
  BountyEntryReaction
  BountyEntryReport
  BountyMetric
  BountyRank
  BountyReport
  BuildGuide
  BuzzClaim
  BuzzTip
  BuzzWithdrawalRequest
  BuzzWithdrawalRequestHistory
  ❌ Chat
  ❌ ChatMember
  ❌ ChatMessage
  ❌ ChatReport
  ❌ Club
  ❌ ClubAdmin
  ❌ ClubAdminInvite
  ❌ ClubMembership
  ❌ ClubMembershipCharge
  ❌ ClubMetric
  ❌ ClubPost
  ❌ ClubPostMetric
  ❌ ClubPostReaction
  ❌ ClubRank
  ❌ ClubTier
  Collection
  CollectionContributor
  CollectionItem
  CollectionMetric
  CollectionRank
  CollectionReport
  Comment
  CommentReaction
  CommentReport
  CommentV2
  CommentV2Reaction
  CommentV2Report
  Cosmetic
  CosmeticShopItem
  CosmeticShopSection
  CosmeticShopSectionItem
  CoveredCheckpoint
  CsamReport
  CustomerSubscription
  Donation
  DonationGoal
  DownloadHistory
  EntityAccess
  EntityCollaborator
  EntityMetric
  File
  GenerationServiceProvider
  HomeBlock
  ✔️ Image
  ImageConnection
  ImageEngagement
  ImageFlag
  ImageMetric
  ImageRank
  ImageRatingRequest
  ImageReaction
  ImageReport
  ImageResource
  ✔️ ImageTechnique
  ✔️ ImageTool
  ImagesOnModels
  Import
  JobQueue
  KeyValue
  Leaderboard
  LeaderboardResult
  LegendsBoardResult
  License
  Link
  Log
  MetricUpdateQueue
  ModActivity
  ✔️ Model
  ModelAssociations
  ModelEngagement
  ✔️ ModelFile
  ModelFileHash
  ModelFlag
  ModelInterest
  ModelMetric
  ModelMetricDaily
  ModelRank_New
  ModelReport
  ✔️ ModelVersion
  ModelVersionEngagement
  ModelVersionExploration
  ModelVersionMetric
  ModelVersionMonetization
  ModelVersionRank
  ModelVersionSponsorshipSettings
  OauthClient
  OauthToken
  Partner
  ✔️ Post
  PostMetric
  PostRank
  PostReaction
  PostReport
  PressMention
  Price
  Product
  PurchasableReward
  Purchase
  QueryDurationLog
  QueryParamsLog
  QuerySqlLog
  ❌ Question
  ❌ QuestionMetric
  ❌ QuestionReaction
  RecommendedResource
  RedeemableCode
  Report
  ResourceReview
  ResourceReviewReaction
  ResourceReviewReport
  RunStrategy
  SavedModel
  SearchIndexUpdateQueue
  Session
  SessionInvalidation
  ✔️ Tag
  TagEngagement
  TagMetric
  TagRank
  ✔️ TagsOnArticle
  TagsOnBounty
  TagsOnCollection
  TagsOnImage
  TagsOnImageVote
  TagsOnModels
  TagsOnModelsVote
  ✔️ TagsOnPost
  ❌ TagsOnPostVote
  TagsOnQuestions
  TagsOnTags
  ✔️ Technique
  Thread
  TipConnection
  ✔️ Tool
  ✔️ User
  UserCosmetic
  UserCosmeticShopPurchases
  UserEngagement
  UserLink
  UserMetric
  UserNotificationSettings
  UserPaymentConfiguration
  UserProfile
  UserPurchasedRewards
  UserRank
  UserReferral
  UserReferralCode
  UserReport
  Vault
  VaultItem
  VerificationToken
  Webhook
  _LicenseToModel
   */
};

genRows().then(() => {
  // pgDbRead.end();
  process.exit(0);
});
