export interface INote {
  _id?: string;
  userId: string;
  title: string;
  content: string;
  tags?: string[];
  taskId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tags?: string[];
  taskId?: string | null;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  tags?: string[];
  taskId?: string | null;
}
