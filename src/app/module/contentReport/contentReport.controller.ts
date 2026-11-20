import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { contentReportService } from "./contentReport.services";

const createContentReport = catchAsync(
  async (req: Request, res: Response) => {
    const data = await contentReportService.createContentReport(
      req.user,
      req.body,
    );

    sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: "Content report created successfully.",
      data,
    });
  },
);

export const contentReportController = {
  createContentReport,
};