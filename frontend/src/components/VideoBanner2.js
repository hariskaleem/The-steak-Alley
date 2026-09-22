import React, { useRef, useEffect } from "react";

const VideoBanner2 = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const playVideo = async () => {
      try {
        if (videoRef.current) {
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Video playback failed:", err);
      }
    };

    playVideo();
  }, []);

  return (
    <section id="home" className="vbanner_wrapper1 py-5">
      <div className=" position-relative">
        <video
          ref={videoRef}
          width="100%"
          height="auto"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          style={{
            maxWidth: "1500px",
            maxHeight: "450px",
            objectFit: "cover",
            filter: "brightness(50%)",
          }}>
          <source src={process.env.PUBLIC_URL + "/images/6037343_Chef_Meat_1280x720.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div
          className="position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center"
          style={{
            top: 0,
            left: 0,
          }}>
          <h2 className=" mb-4 " style={{ color: "#bd9f67" }}>
            “Grilled to Perfection, Served with Passion.”
          </h2>
        </div>
      </div>
    </section>
  );
};

export default VideoBanner2;
