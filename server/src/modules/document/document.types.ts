import { docs } from "@/core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import { CreateDocumentBodySchema } from "./document.validator";


export type Document = InferSelectModel<typeof docs>
export type CreateDocument = InferInsertModel<typeof docs> 


export type CreateDocumentInput = z.infer<typeof CreateDocumentBodySchema>
