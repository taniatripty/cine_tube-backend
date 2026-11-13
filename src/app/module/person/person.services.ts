import { prisma } from "../../lib/prisma";
import { TCreatePersonInput } from "./person.interface";

const createPerson = async (payload: TCreatePersonInput) => {
  return prisma.person.create({
    data: payload,
  });
};

const getAllPeople = async () => {
  return prisma.person.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const personService = {
  createPerson,
  getAllPeople,
};