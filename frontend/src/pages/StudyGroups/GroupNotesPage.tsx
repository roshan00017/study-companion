import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getNotes, createNote, updateNote, deleteNote } from "../../services/api/note.api";
import NoteCard from "../../components/notes/NoteCard";
import NoteModal from "../../components/notes/NoteModal";
import ViewNoteModal from "../../components/notes/ViewNoteModal";
import type { Note, NotePayload } from "../../types/note.type";
import BackButton from "../../components/button/back-button";

export default function GroupNotesPage() {
  const { groupId } = useParams();
  const location = useLocation();
  const [notes, setNotes] = useState<Note[]>([]);
  const [groupName, setGroupName] = useState<string>(location.state?.groupName || "");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);

  useEffect(() => {
    loadNotes();
    if (location.state && location.state.groupName) setGroupName(location.state.groupName);
  }, [groupId, location.state]);

  const filteredNotes = useMemo(() => {
    return notes;
  }, [notes]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotes(groupId);
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: NotePayload) => {
    if (!groupId) return;
    try {
      if (editingNote) {
        await updateNote(editingNote._id, { ...data, groupId });
      } else {
        await createNote({ ...data, groupId });
      }
      setModalOpen(false);
      setEditingNote(null);
      loadNotes();
    } catch (err) {
      alert("Failed to save note. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteNote(id);
      loadNotes();
    } catch (err) {
      alert("Failed to delete note. Please try again.");
    }
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const openViewModal = (note: Note) => {
    setViewingNote(note);
  };

  const closeModal = () => {
    setEditingNote(null);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        <BackButton className="mb-4" />
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {groupName ? `${groupName} Notes` : "Group Notes"}
          </h1>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <span>+ Create Note</span>
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.length === 0 && <div>No notes found for this group.</div>}
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                content={note.content}
                onEdit={() => openEditModal(note)}
                onDelete={() => handleDelete(note._id)}
                onView={() => openViewModal(note)}
              />
            ))}
          </div>
        )}
        {modalOpen && (
          <NoteModal
            initial={editingNote || undefined}
            onClose={closeModal}
            onSubmit={handleSave}
          />
        )}
        {viewingNote && (
          <ViewNoteModal
            title={viewingNote.title}
            content={viewingNote.content}
            onClose={() => setViewingNote(null)}
          />
        )}
      </div>
    </div>
  );
}
