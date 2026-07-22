import { relations } from "drizzle-orm";

import { blogs } from "./blogs";
import { images } from "./images";


export const blogsRelations = relations(blogs, ({ many }) => ({
    images: many(images),
}));


export const imagesRelations = relations(images, ({ one }) => ({
    blog: one(blogs, {
        fields: [images.blogId],
        references: [blogs.id],
    }),
}));