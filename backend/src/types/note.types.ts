export interface INote {
  _id?: string;
  userId: string;
  title: string;
  content: string;
  tags?: string[];
  taskId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  groupId?: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tags?: string[];
  taskId?: string | null;
  groupId?: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  tags?: string[];
  taskId?: string | null;
}
