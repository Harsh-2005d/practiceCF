import { randomUUID } from "node:crypto";
import {prisma} from "../prismac"

interface CfUser {
  handle: string;
  rating?: number;
}

export async function findOrCreateUser(cfUser: CfUser) {
  return prisma.user.upsert({
    where: { handle: cfUser.handle },
    update: {
      rating: cfUser.rating ?? null
    },
    create:{
        id: randomUUID(),
        handle: cfUser.handle,
        rating: cfUser.rating,
    }
  });
}
