import { Share2, Plus, Menu, User } from "lucide-react";
import { useState, useEffect } from "react";
import CreateModalContent from "./CreateModalContent";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // check login state
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // handle Add Content
  const handleAddContent = (data: { title: string; link: string; type: string }) => {
    console.log("✅ New Content Added:", data);
  };

  // share brain logic
  const shareBrain = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        BACKEND_URL + "/api/v1/manager/share",
        { share: true },
        {
          headers: {
            authorization: token,
          },
        }
      );

      const hash = res.data.hash || res.data.message;
      const link = `${window.location.origin}/share/${hash}`;

      await navigator.clipboard.writeText(link);
      alert("Share link copied to clipboard: " + link);
    } catch (err) {
      alert("Error generating Share Link");
    } finally {
      setLoading(false);
    }
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("Logged out successfully ✅");
    window.location.reload(); // optional: reload to reset UI
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-sm border-b relative">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold hidden sm:block">All Logs</h1>
      </div>

      {/* Right Section */}
      <div className="hidden sm:flex items-center space-x-3">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          onClick={shareBrain}
        >
          <Share2 size={16} />
          <span>Share Brain</span>
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          <span>Add Content</span>
        </button>

        {/* ✅ Profile Dropdown if logged in */}
        {isLoggedIn && (
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-100"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <User size={18} />
              <span>Profile</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded-md py-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateModalContent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddContent}
      />

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-md flex flex-col p-4 space-y-2 sm:hidden z-50">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            onClick={shareBrain}
          >
            <Share2 size={16} />
            <span>Share Brain</span>
          </button>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setMenuOpen(false);
            }}
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={16} />
            <span>Add Content</span>
          </button>

          {/* ✅ Profile on mobile */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              <User size={16} />
              <span>Logout</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
