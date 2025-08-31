import { useEffect, useState } from "react";
import '../App.css'
import NavBar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import Sidebar from '../components/Sidebar'
import axios from "axios";


function Dashboard() {
 const [contents, setContents] = useState<any[]>([]);
  const [activeType, setActiveType] = useState("all"); // default view

// 🔥 UPDATED: Fetch data from backend with Axios
 const fetchContents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/api/v1/content", {
        headers: {
          Authorization: token,
        },
      });

      console.log("Fetched contents:", res.data);

      // ✅ Fix: check inside res.data.content
      if (Array.isArray(res.data.content)) {
        setContents(res.data.content);
      } else {
        console.error("Unexpected response format:", res.data);
      }
    } catch (err) {
      console.error("Error fetching content:", err);
    }
  };

 useEffect(() => {
    fetchContents(); // fetch once on mount

    const intervalId = setInterval(fetchContents, 10000); // 10 sec refresh

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

const filteredContents = activeType === "all"
    ? contents
    : contents.filter(item => item.type === activeType); 
  return (
    <>
      <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeType={activeType} setActiveType={setActiveType}  />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <NavBar/>

        {/* Page content */}
       <div className="p-6 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
     {filteredContents.map((item) => (
            <NoteCard
             contentId={item._id} 
              key={item._id}
              title={item.title}
              link={item.link}
              type={item.type}
              tags={item.tags}
              dateAdded={new Date(item.createdAt).toLocaleDateString()}
/>
      ))}
    </div>
    </div>
    </div>
       
    
    
     
     
    </>
  )
}

export default Dashboard
