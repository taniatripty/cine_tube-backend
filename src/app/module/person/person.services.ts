import { prisma } from "../../lib/prisma";
import { IRequest } from "../../interface/requestUser.interface";
import { TCreatePersonInput } from "./person.interface";

const createPerson = async (
  payload: TCreatePersonInput,
  user: Pick<IRequest, "name" | "image">,
) => {
  return prisma.person.create({
    data: {
      name: user.name,
      photo: user.image,
      ...payload,
    },
  });
};

export const personService = {
  createPerson,
};