
import {z} from 'zod'

export const productSchemas = z.object({
    name: z.string(),
    price : z.number().min(1),
    description: z.string(),
    image : z.array(z.string()).min(1,"At Least One Image Required..."),
    status: z.enum(["draft","archived","published"]),
    category: z.enum(["women","men","kids"]),
    isFeatured : z.boolean().optional()
})



export const bannerSchemas = z.object({
    title: z.string(),
    imageBanner : z.string()
})