import { useState } from "react";
import DragDropFiles from "./DragDropFiles";
import "./upsert.css";
import { FaArrowLeft, FaImage } from "react-icons/fa";
import * as services from "../../services/services";
import { useNavigate } from "react-router-dom";

export default function Upsert({ selectedVideo, setSelectedVideo, onClose }) {
  const [video, setVideo] = useState(null);
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState(selectedVideo ? selectedVideo.title : "");
  const [desc, setDesc] = useState(selectedVideo ? selectedVideo.desc : "");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const clearInputs = () => {
    setVideo(null);
    setCover(null);
    setTitle("");
    setDesc("");
  };

  const handleCover = (e) => {
    e.preventDefault();
    setCover(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const videoName = await uploadVideo();
      const coverName = await uploadCover();

      if (selectedVideo) {
        // update video
        const data = {
          ...selectedVideo,
          videoUrl: videoName ? videoName : selectedVideo.videoUrl,
          cover: coverName ? coverName : selectedVideo.cover,
          title,
          desc,
        };

        const res = await services.updateVideoAsync(selectedVideo._id, data);
        if (res.status == 200) {
          clearInputs();
          setSelectedVideo(res.data);
          setLoading(false);
          onClose(false);
        }
      } else {
        // create new video
        const data = {
          videoUrl: videoName,
          cover: coverName,
          title,
          desc,
        };

        const res = await services.createVideoAsync(data);
        if (res.status == 200) {
          clearInputs();
          setLoading(false);
          navigate(`/videos/${res.data._id}`);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const uploadVideo = async () => {
    if (!video) return;
    try {
      const formData = new FormData();
      const filename = new Date().getTime() + "-" + video.name;
      formData.append("filename", filename);
      formData.append("file", video);

      const res = await services.uploadVideoAsync(formData);
      if (res.status == 200) {
        return filename;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadCover = async () => {
    if (!cover) return;
    try {
      const formData = new FormData();
      const filename = new Date().getTime() + "-" + cover.name;
      formData.append("filename", filename);
      formData.append("file", cover);

      const res = await services.uploadCoverAsync(formData);
      if (res.status == 200) {
        return filename;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="upsert">
      <div className="wrapper container">
        <h2 className="heading">
          {selectedVideo && (
            <FaArrowLeft
              onClick={() => onClose(false)}
              style={{ marginRight: "1rem", cursor: "pointer" }}
            />
          )}
          {selectedVideo ? "Update Video" : "Upload new video"}
        </h2>
        <div className="inputs-wrapper">
          <div className="left">
            <DragDropFiles
              file={video}
              setFile={setVideo}
              selectedVideo={selectedVideo}
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit} className="upsert-form">
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Title"
              />

              <label htmlFor="upload-cover">
                <input
                  type="file"
                  id="upload-cover"
                  accept="image/png, image/jpg, image/jpeg"
                  style={{ display: "none" }}
                  onChange={handleCover}
                />
                <div className="upload-cover">
                  <FaImage className="camera-icon" />
                  <span>
                    {cover
                      ? `${cover?.name}`
                      : selectedVideo
                      ? selectedVideo.cover
                      : "Select Cover"}
                  </span>
                </div>
              </label>

              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description"
              />

              <button type="submit">
                {loading
                  ? "Please wait..."
                  : `${selectedVideo ? "Save" : "Upload"}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
