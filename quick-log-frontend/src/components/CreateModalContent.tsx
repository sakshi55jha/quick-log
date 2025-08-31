import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface CreateModalContentProps{
    isOpen: boolean;
    onClose: ()=> void;
    onSubmit: (data: {title: string; link: string; type: string}) => void
}



export default function CreateModalContent({isOpen, onClose, onSubmit}: CreateModalContentProps){
const [form, setForm] = useState({
    title: "",
    link: "",
    type: "",
})
  const [loading, setLoading] = useState(false);
if(!isOpen) return null;

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
setForm({
    ...form,
    [e.target.name]: e.target.value
})
}

const handleSubmit = async(e: React.FormEvent)=>{
    e.preventDefault();
    if(!form.type){
    alert("⚠️ Please select a content type (YouTube or Twitter).");
      return;
    }

    try {
      setLoading(true);
       const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in first.");
        return;
      }
             
      const res = await axios.post(
        BACKEND_URL + "/api/v1/content", // your route
        {
          title: form.title,
          link: form.link,
          type: form.type,
        },
        {
          headers: {
      Authorization: token,   // 👈 send raw token only
    },
        }
      );

     if (onSubmit) onSubmit(form);

      // 🔥 UPDATED: ping dashboard listeners to refetch
      window.dispatchEvent(new Event("contentUpdated"));

      // reset + close
      setForm({ title: "", link: "", type: "" });
      onClose();
      console.log("✅ Added:", res.data);
    } catch (error: any) {
      console.error("❌ Error adding:", error?.response?.data || error?.message);
      alert("Failed to add content. Please try again.");
    } finally {
      setLoading(false); // 🔥 UPDATED
    }
    
}

return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Content</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          
          <input
            type="url"
            name="link"
            placeholder="Content Link"
            value={form.link}
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="type">
  Content Type
     </label>
          <select
          id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          >
            <option value="">-- Select Type --</option> {/* ⬅️ Placeholder option */}
            <option value="youtube">YouTube</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
               disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
               {loading ? "Saving..." : "Add Content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}