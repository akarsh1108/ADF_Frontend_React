import { label } from "framer-motion/client";
import { z } from "zod";

export const connectionString = z.object({
  database: z.string(),
  databaseId: z.number(),
  location: z.string(),
  url: z.string().optional(),
});
export type ConnectionString = z.infer<typeof connectionString>;

export const FileManagementReq = z.object({
  id: z.number(),
  fileName: z.string(),
  format: z.string(),
  source: z.number(),
});

export type FileManagement = z.infer<typeof FileManagementReq>;

export const DestinationConnection = z.object({
  source: z.number(),
  filename: z.string(),
  filetype: z.string(),
  content: z.string(),
  url: z.string().optional(),
});

export type DestinationConnection = z.infer<typeof DestinationConnection>;

export const Headers = z.object({
  key: z.string(),
  value: z.string(),
});
export const data = z.object({
  key: z.string(),
  value: z.any(),
});
export const ApiCall = z.object({
  title: z.string(),
  url: z.string(),
  method: z.string(),
  headers: z.array(Headers),
  data: z.array(Headers),
});

export type ApiCall = z.infer<typeof ApiCall>;

export const scheduling = z.object({
  source: z.number(),
  destination: z.number(),
  label: z.string(),
  interval: z.number().optional(),
  schedular: z.number().optional(),
});

export type Scheduling = z.infer<typeof scheduling>;
