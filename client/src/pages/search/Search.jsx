import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getVideosAsync } from "../../services/services";
import VideoCard from "../../components/videos/VideoCard";

export default function Search() {
  const [videos, setVideos] = useState([]);
  const toSearch = useLocation().search;

  useEffect(() => {
    toSearch && searchVideos();
  }, [toSearch]);

  const searchVideos = async () => {
    try {
      const res = await getVideosAsync(toSearch);
      if (res.status == 200) {
        setVideos(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="home">
      <div className="video-list">
        {videos.map((item, index) => (
          <VideoCard key={index} video={item} />
        ))}
      </div>
    </div>
  );
}
