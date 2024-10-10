import { z } from "zod";

export const connectionString = z.object({
  database: z.string(),
  databaseId: z.number(),
  location: z.string(),
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
});

export type DestinationConnection = z.infer<typeof DestinationConnection>;
