// SharedPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NoteCard from "./NoteCard";
import { BACKEND_URL } from "../config";
type ContentType = {
  _id: string;
  title: string;
  description?: string;
  tags?: string[];
  createdAt: string; 
  updatedAt?: string; 
  imageUrl?: string;
  link?: string;
  type?: "youtube" | "twitter";
};

export default function SharedContent() {
  const { shareLink } = useParams(); // 👈 get shareLink from URL
  const [contents, setContents] = useState<ContentType[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        const res = await axios.get(
         `${BACKEND_URL}/api/v1/manager/${shareLink}`
        );

        setContents(res.data.content);
        setUserName(res.data.name);
      } catch (error) {
        console.error("Error fetching shared content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedContent();
  }, [shareLink]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading shared content...</p>;
  }

  return (
   <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        {userName}'s Shared Content
      </h1>

      {contents.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((item) => (
            <NoteCard
              key={item._id}
              title={item.title}
              description={item.description}
              tags={item.tags}
              dateAdded={new Date(item.createdAt).toLocaleDateString()}
              imageUrl={item.imageUrl}
              link={item.link}
              type={item.type}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No content found for this user.</p>
      )}
    </div>
  );
}
