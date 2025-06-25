import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getGroupMembers,
  addUserToGroup,
  removeUserFromGroup,
} from "../../services/api/study-group.api";
import { searchUserByEmail } from "../../services/api/user.api";
import { useAuth } from "../../context/AuthContext";

// Backend returns: [{ user: { _id, name, email, ... }, role: "admin" | "member" }]
interface Member {
  user: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
    uid?: string;
  };
  role: string;
}

import { useNavigate } from "react-router-dom";

export default function GroupDashboardPage() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addUserEmail, setAddUserEmail] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [userSelected, setUserSelected] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line
  }, [groupId, user]);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGroupMembers(groupId!);
      setMembers(data);
      // Determine if current user is admin (compare by _id or uid)
      const admin = data.find(
        (m: Member) =>
          (m.user._id === user?.id || m.user.uid === user?.uid) &&
          m.role === "admin"
      );
      setIsAdmin(!!admin);
    } catch (e) {
      setError("Failed to load group members.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!searchResult || !searchResult._id) return;
    setAdding(true);
    try {
      await addUserToGroup(groupId!, searchResult._id, "member");
      setAddUserEmail("");
      setSearchResult(null);
      fetchMembers();
    } catch (e) {
      alert("Failed to add user. Make sure the user exists and you are admin.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    setRemoving(userId);
    try {
      await removeUserFromGroup(groupId!, userId);
      fetchMembers();
    } catch (e) {
      alert("Failed to remove user. You must be admin.");
    } finally {
      setRemoving(null);
    }
  };

  // Search user by email as admin types
  useEffect(() => {
    if (!addUserEmail || addUserEmail.length < 3) {
      setSearchResult(null);
      setSearchError(null);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const user = await searchUserByEmail(addUserEmail.trim());
        setSearchResult(user);
        setSearchError(null);
      } catch (e: any) {
        setSearchResult(null);
        setSearchError(e?.response?.data?.message || "User not found");
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [addUserEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Study Group Dashboard
          </h1>
          {isAdmin && (
            <div className="w-full md:w-auto mt-4 md:mt-0 flex gap-2 items-center relative">
              <div className="flex w-full md:w-64 relative items-center">
                <input
                  type="text"
                  value={addUserEmail}
                  onChange={e => {
                    setAddUserEmail(e.target.value);
                    setSearchResult(null);
                    setUserSelected(false);
                  }}
                  placeholder="Search user by email"
                  className="w-full p-2 border border-green-500 bg-white rounded-l shadow focus:outline-none focus:ring-2 focus:ring-green-400"
                  style={{ zIndex: 2 }}
                  autoComplete="off"
                />
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-green-600 text-white rounded-r shadow hover:bg-green-700 transition text-sm"
                  disabled={adding || !(searchResult && addUserEmail === searchResult.email && userSelected)}
                  style={{ minWidth: 90 }}
                >
                  {adding ? "Adding..." : "Add"}
                </button>
                {addUserEmail && searchResult && addUserEmail === searchResult.email && !searchError && !userSelected && (
                  <div className="absolute top-10 left-0 w-full bg-white border border-gray-200 rounded shadow-lg z-10">
                    <div className="p-3 flex flex-col cursor-pointer hover:bg-green-50"
                      onClick={() => {
                        setAddUserEmail(searchResult.email);
                        setSearchResult(searchResult);
                        setUserSelected(true);
                      }}
                    >
                      <span className="font-semibold text-gray-800">{searchResult.name}</span>
                      <span className="text-sm text-gray-500">{searchResult.email}</span>
                    </div>
                  </div>
                )}
                {addUserEmail && (!searchResult || addUserEmail !== searchResult.email) && (
                  <div className="absolute top-10 left-0 w-full bg-white border border-gray-200 rounded shadow-lg z-10">
                    {searchError ? (
                      <div className="p-3 text-sm text-red-500">{searchError}</div>
                    ) : (
                      <div className="p-3 text-sm text-gray-400">Type to search...</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Tiles */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 lg:mb-0">
            <div
              className="cursor-pointer bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center border border-gray-100 hover:shadow-xl hover:scale-[1.03] transition"
              onClick={() => navigate(`/dashboard/study-groups/${groupId}/tasks`)}
            >
              <span className="text-3xl mb-2">📝</span>
              <span className="font-bold text-lg">Tasks</span>
            </div>
            <div
              className="cursor-pointer bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center border border-gray-100 hover:shadow-xl hover:scale-[1.03] transition"
              onClick={() => navigate(`/dashboard/notes?groupId=${groupId}`)}
            >
              <span className="text-3xl mb-2">📒</span>
              <span className="font-bold text-lg">Notes</span>
            </div>
            <div
              className="cursor-pointer bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center border border-gray-100 hover:shadow-xl hover:scale-[1.03] transition"
              onClick={() =>
                navigate(`/dashboard/flashcards?groupId=${groupId}`)
              }
            >
              <span className="text-3xl mb-2">🃏</span>
              <span className="font-bold text-lg">Flashcards</span>
            </div>
          </div>
          {/* Members List */}
          <div className="w-full lg:w-80 flex-shrink-0 py-2">
            <h2 className="text-xl font-bold mb-4">Members</h2>
            {loading ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {members.length === 0 && (
                  <li className="py-2 text-gray-500">
                    No members in this group.
                  </li>
                )}
                {members.map((member) => (
                  <li
                    key={member.user._id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-base text-orange-800 flex items-center gap-2">
                        {member.user.name}
                        {member.role === "admin" && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                            Admin
                          </span>
                        )}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {member.user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin && member.user._id !== user?.id && (
                        <button
                          onClick={() => handleRemoveUser(member.user._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                          disabled={removing === member.user._id}
                        >
                          {removing === member.user._id
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
