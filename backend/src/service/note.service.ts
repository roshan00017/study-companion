import { NoteModel } from "../models";
import { CreateNoteDto, UpdateNoteDto, INote } from "../types";

class NoteService {
  async createNote(userId: string, noteData: CreateNoteDto): Promise<INote> {
    const { taskId, ...restData } = noteData;

    // Only include taskId if it's not empty
    const notePayload = {
      userId,
      ...restData,
      ...(taskId ? { taskId } : {}),
    };

    return await NoteModel.create(notePayload);
  }

  async getNotes(userId: string): Promise<INote[]> {
    return await NoteModel.find({ userId }).sort({ updatedAt: -1 });
  }

  async getNoteById(noteId: string, userId: string): Promise<INote | null> {
    return await NoteModel.findOne({ _id: noteId, userId });
  }

  async updateNote(
    noteId: string,
    userId: string,
    updateData: UpdateNoteDto
  ): Promise<INote | null> {
    return await NoteModel.findOneAndUpdate(
      { _id: noteId, userId },
      updateData,
      { new: true }
    );
  }

  async deleteNote(noteId: string, userId: string): Promise<INote | null> {
    return await NoteModel.findOneAndDelete({ _id: noteId, userId });
  }
}

export default new NoteService();
