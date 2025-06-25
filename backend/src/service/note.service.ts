import { NoteModel } from "../models";
import { CreateNoteDto, UpdateNoteDto, INote } from "../types";

class NoteService {
  async createNote(userId: string, noteData: CreateNoteDto): Promise<INote> {
    const { taskId, ...restData } = noteData;

    const notePayload = {
      userId,
      ...restData,
      ...(taskId ? { taskId } : {}),
    };

    return await NoteModel.create(notePayload);
  }

  async getNotes(userId: string, groupId?: string): Promise<INote[]> {
    const filter: any = { userId };
    if (groupId) filter.groupId = groupId;
    return await NoteModel.find(filter).sort({ updatedAt: -1 });
  }

  async getNoteById(noteId: string, userId: string): Promise<INote | null> {
    return await NoteModel.findOne({ _id: noteId, userId });
  }
  async getNotesByTaskId(userId: string, taskId: string): Promise<INote[]> {
    return await NoteModel.find({ userId, taskId }).sort({ updatedAt: -1 });
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
