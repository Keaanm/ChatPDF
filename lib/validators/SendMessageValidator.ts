import {z} from 'zod';

export const SendMessageValidator = z.object({
    fileId: z.number(),
    message: z.string(),
})