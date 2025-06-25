export interface NotePayload {
  title: string;
  content: string;
  taskId?: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  taskId?: string;
}
