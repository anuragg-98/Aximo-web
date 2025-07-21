import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import VideoPreview from "./VideoPreview";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const currentIndexRef = useRef(1);
  const nextVdRef = useRef(null);
  const [hasClicked, setHasClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const totalVideos = 4;

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  useEffect(() => {
    if (loadedVideos >= 2) {
      // Only two videos are loading initially
      setLoading(false);
    }
  }, [loadedVideos]);

  const handleMiniVdClick = () => {
    setHasClicked(true);
    currentIndexRef.current = (currentIndexRef.current % totalVideos) + 1;

    if (nextVdRef.current) {
      nextVdRef.current.play();
    }
  };

  // Animation for shape morphing
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.set("#video-frame", {
        clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
        borderRadius: "0% 0% 40% 10%",
      });

      gsap.from("#video-frame", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        borderRadius: "0% 0% 0% 0%",
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#video-frame",
          start: "center center",
          end: "bottom center",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // Animation when user clicks to switch video
  useGSAP(
    () => {
      if (hasClicked) {
        const ctx = gsap.context(() => {
          gsap.set("#next-video", { visibility: "visible" });

          gsap.to("#next-video", {
            transformOrigin: "center center",
            scale: 1,
            width: "100%",
            height: "100%",
            duration: 1,
            ease: "power1.inOut",
            onStart: () => nextVdRef.current?.play(),
          });

          gsap.from("#current-video", {
            transformOrigin: "center center",
            scale: 0,
            duration: 1.5,
            ease: "power1.inOut",
          });
        });

        return () => ctx.revert();
      }
    },
    {
      dependencies: [hasClicked],
      revertOnUpdate: true,
    }
  );

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          {/* Mini preview button */}
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <VideoPreview>
              <div
                onClick={handleMiniVdClick}
                className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
              >
                <video
                  src={getVideoSrc((currentIndexRef.current % totalVideos) + 1)}
                  loop
                  muted
                  id="current-video"
                  className="size-64 origin-center scale-150 object-cover object-center"
                  onLoadedData={handleVideoLoad}
                  preload="metadata"
                />
              </div>
            </VideoPreview>
          </div>

          {/* Video that fades in after click */}
          <video
            ref={nextVdRef}
            src={getVideoSrc(currentIndexRef.current)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
            preload="metadata"
          />

          {/* Background looping video */}
          <video
            src={getVideoSrc(
              currentIndexRef.current === totalVideos - 1
                ? 1
                : currentIndexRef.current
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
            preload="auto"
          />
        </div>

        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          G<b>A</b>MING
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              redefi<b>n</b>e
            </h1>

            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>

            <Button
              id="watch-trailer"
              title="Watch trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
