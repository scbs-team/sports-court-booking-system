import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(8),
    })
});

export const signinSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
    })
});

export const updateUserSchema = z.object({
    body: z.object({
        username: z.string().min(3).optional(),
        email: z.string().email().optional(),
        password: z.string().min(8).optional(),
    }).refine((data) => data.username || data.email || data.password, {
        message: "At least one field is required",
    }),
    params: z.object({
        id: z.string().uuid(),
    }),
});
