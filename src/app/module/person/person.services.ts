import { prisma } from "../../lib/prisma";
import { TCreatePersonInput } from "./person.interface";

const createPerson = async (payload: TCreatePersonInput) => {
  return prisma.person.create({
    data: payload,
  });
};

export const personService = {
  createPerson,
};