import { z } from 'zod';

// Esquema de validação para os dados do webhook
export const CreateWebhookSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .transform((email) => email.toLowerCase()),

  id: z
    .string()
    .uuid('Invalid ID format'),

  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_channel: z.string().optional(),
});

// Tipo inferido do schema para ser usado no código
export type CreateWebhookDto = z.infer<typeof CreateWebhookSchema>;
