import z from "zod";

export const GenerateContentBodySchema = z.object({
    prompt: z.string().min(3)
})