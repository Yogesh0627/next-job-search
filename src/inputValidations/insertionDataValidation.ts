import z from 'zod'

export const insertDataValidation = z.object({
    roughJobData: z.string(),
    jobCategoryType: z.enum(['Government', 'Private']) // Ensures only 'govt' or 'private' is allowed
});