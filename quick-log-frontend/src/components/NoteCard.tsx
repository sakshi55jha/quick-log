import { Share2, Edit3, Trash2 } from "lucide-react";
import LinkPreview from "./LinkPreview";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

type CardProps = {
  contentId: string;
  title: string;
  tags?: string[];
  dateAdded: string;
  imageUrl?: string;
   link?: string; // backend returns link (can be a URL or text link)
  type?: "youtube" | "twitter" | "linkedin" ;
};

export default function NoteCard({
  contentId,
 title,
  tags = [],
  dateAdded,
  imageUrl,
  link,
  type,
}: CardProps)
{
  const handleDelete = async()=>{
    try{
    const token = localStorage.getItem("token")
    const res = await axios.delete(BACKEND_URL + "/api/v1/content", {
      headers:{
      Authorization : token,
      },
       data: { contentId },
    })
      alert("Deleted successfully ✅");

    }catch(err){
         console.error("Delete failed:", err);
      alert("Failed to delete ❌");
    }
  }
    const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col gap-4 h-fit">
      {/* Top Actions */}
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Share"
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <a href={link} target="_blank"> 
               <Share2 size={18} className="text-gray-600" />
               </a>
          
          </button>
          <button
            type="button"
            title="Edit"
            className="p-2 rounded-lg hover:bg-gray-100 transition"
onClick={() =>
  navigate(`/edit/${contentId}`, {
    state: {
      content: {
        contentId,
        title,
        tags,
        dateAdded,
        imageUrl,
        link,
        type,
      },
    },
  })
}
          >
            <Edit3 size={18} className="text-gray-600" />
          </button>
          <button
            type="button"
            title="Delete"
            className="p-2 rounded-lg hover:bg-red-50 transition"
             onClick={handleDelete}
          >
            <Trash2 size={18} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Content */}
  {type === "youtube" && (
  <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden"> {/* 16:9 ratio */}
    <a href={link!} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block">
      <iframe
        src={link
          ?.replace("watch", "embed")
          .replace("?v=", "/")}
        title="YouTube video player"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    </a>
  </div>
)}
   {type === "twitter" && (
  <div className="relative w-full">
    <blockquote className="twitter-tweet">
      <a 
        href={link?.replace("x.com", "twitter.com")} 
        style={{ display: "none" }}// 👈 hides the raw URL
      >
        {link}
      </a>
    </blockquote>
  </div>
)}
        
 {type === "linkedin" && link && (
  <LinkPreview url={link} />
)} 
      

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full shadow-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-400">
        <p>Added on {dateAdded}</p>
        {type && <span className="italic text-gray-500">{type}</span>}
      </div>
    </div>
  );
}
