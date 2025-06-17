import { Response, NextFunction } from "express";

import { ApiError, sendSuccess } from "../utils/response.utils";
import { noteService } from "../service";
import { AuthRequest, CreateNoteDto, UpdateNoteDto } from "../types";

class NoteController {
  async createNote(
    req: AuthRequest<CreateNoteDto>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const note = await noteService.createNote(userId, req.body);
      sendSuccess(res, "Note created successfully", note, 201);
    } catch (error) {
      next(error);
    }
  }

  async getNotes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const notes = await noteService.getNotes(userId);
      sendSuccess(res, "Notes fetched successfully", notes);
    } catch (error) {
      next(error);
    }
  }

  async getNoteById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const note = await noteService.getNoteById(id, userId);
      if (!note) {
        throw new ApiError(404, "Note not found");
      }

      sendSuccess(res, "Note fetched successfully", note);
    } catch (error) {
      next(error);
    }
  }
  async getNotesByTaskId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.uid;
      const { taskId } = req.params;

      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const notes = await noteService.getNotesByTaskId(userId, taskId);
      sendSuccess(res, "Notes fetched successfully", notes);
    } catch (error) {
      next(error);
    }
  }
  async updateNote(
    req: AuthRequest<UpdateNoteDto>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const note = await noteService.updateNote(id, userId, req.body);
      if (!note) {
        throw new ApiError(404, "Note not found");
      }

      sendSuccess(res, "Note updated successfully", note);
    } catch (error) {
      next(error);
    }
  }

  async deleteNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const result = await noteService.deleteNote(id, userId);
      if (!result) {
        throw new ApiError(404, "Note not found");
      }

      sendSuccess(res, "Note deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

export default new NoteController();
