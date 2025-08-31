import React, { useEffect, useState } from "react";
import axios from "axios";

type LinkPreviewProps = {
  url: string;
};

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await axios.get(
          `https://api.microlink.io/?url=${encodeURIComponent(url)}`
        );
        setPreview(res.data);
      } catch (error) {
        console.error("Error fetching preview:", error);
      }
    };
    fetchPreview();
  }, [url]);

  if (!preview) return <p className="text-gray-500">Loading preview...</p>;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-lg p-3 shadow hover:shadow-lg transition"
    >
      <div className="flex items-start gap-3">
        {preview.data.image?.url && (
          <img
            src={preview.data.image.url}
            alt="Preview"
            className="w-20 h-20 object-cover rounded"
          />
        )}
        <div>
          <h4 className="font-semibold">{preview.data.title}</h4>
          <p className="text-sm text-gray-600">{preview.data.description}</p>
          <span className="text-xs text-blue-500">{preview.data.publisher}</span>
        </div>
      </div>
    </a>
  );
};

export default LinkPreview;
