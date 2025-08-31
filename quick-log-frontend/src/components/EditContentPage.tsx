import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function EditContentPage() {
  const { contentId } = useParams();
  const { state } = useLocation(); // ✅ get passed state
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("");

  // Prefill from state
  useEffect(() => {
    if (state?.content) {
      setTitle(state.content.title);
      setLink(state.content.link);
      setType(state.content.type);
    }
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        BACKEND_URL + "/api/v1/edit-content",
        {
          contentId,
          title,
          link,
          type,
        },
        {
          headers: { Authorization: token },
        }
      );

      alert(response.data.message);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error editing content:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          ✏️ Edit Your Content
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter content title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Type */}
          <div>
          <label
  htmlFor="contentType"
  className="block text-sm font-medium text-gray-700 mb-2"
>
  Content Type
</label>
<select
  id="contentType"
  value={type}
  onChange={(e) => setType(e.target.value)}
  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
  required
>
  <option value="">-- Select Type --</option>
  <option value="youtube">🎥 YouTube</option>
  <option value="twitter">🐦 Twitter</option>
  <option value="linkedin">💼 LinkedIn</option>
</select>

          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-1/2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
