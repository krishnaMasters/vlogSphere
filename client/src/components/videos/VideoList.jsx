import { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import "./videolist.css";
import * as services from "../../services/services";

export default function VideoList() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    loadVideosAsync();
  }, []);

  const loadVideosAsync = async () => {
    try {
      const res = await services.getVideosAsync();
      if (res?.data) {
        setVideos(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="video-list">
      {videos.map((item, index) => (
        <VideoCard key={index} video={item} />
      ))}
    </div>
  );
}
