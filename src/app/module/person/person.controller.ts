import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { personService } from "./person.services";

const createPerson = catchAsync(async (req: Request, res: Response) => {
  const data = await personService.createPerson(req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Person created successfully.",
    data,
  });
});

const getAllPeople = catchAsync(async (_req: Request, res: Response) => {
  const data = await personService.getAllPeople();

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "People retrieved successfully.",
    data,
  });
});

export const personController = {
  createPerson,
  getAllPeople,
};