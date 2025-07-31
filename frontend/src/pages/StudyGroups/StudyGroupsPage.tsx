import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserStudyGroups,
  createStudyGroup,
} from "../../services/api/study-group.api";
import StudyGroupModal from "../../components/studyGroup/StudyGroupModal";
import BackButton from "../../components/button/back-button";

interface StudyGroup {
  _id: string;
  name: string;
  description?: string;
}

export default function StudyGroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getUserStudyGroups();
      setGroups(data);
    } catch (e) {
      setError("Failed to load study groups.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: { name: string; description?: string }) => {
    try {
      await createStudyGroup(data);
      setModalOpen(false);
      fetchGroups();
    } catch (e) {
      alert("Failed to create study group. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Study Groups
          </h1>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <span>+ Create Study Group</span>
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.length === 0 && <div>No study groups found.</div>}
            {groups.map((group) => (
              <div
                key={group._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-2 transition-transform hover:scale-[1.02] hover:shadow-xl border border-gray-100 dark:border-gray-700 cursor-pointer"
                onClick={() =>
                  navigate(`/dashboard/study-groups/${group._id}`, {
                    state: { groupName: group.name },
                  })
                }
              >
                <div className="font-bold text-xl text-green-700 dark:text-green-400 mb-1">
                  {group.name}
                </div>
                {group.description && (
                  <div className="text-gray-600 dark:text-gray-300 text-base mb-2">
                    {group.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {modalOpen && (
          <StudyGroupModal
            onSubmit={handleCreate}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
