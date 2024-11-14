import { Media, Tours } from "@prisma/client";

export type ToursType = Tours & { media: Media[] };