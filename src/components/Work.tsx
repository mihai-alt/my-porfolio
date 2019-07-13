import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Work = () => {
  useGSAP(() => {
    // Responsive: on smaller screens we don't do the pinned horizontal scroll.
    const isSmall = window.innerWidth <= 1025;
    let timeline: GSAPTimeline | null = null;

    if (!isSmall) {
      let translateX: number = 0;

      function setTranslateX() {
        const box = document.getElementsByClassName("work-box");
        if (!box || box.length === 0) return;
        const rectLeft = document
          .querySelector(".work-container")!
          .getBoundingClientRect().left;
        const rect = box[0].getBoundingClientRect();
        const parentWidth = box[0].parentElement!.getBoundingClientRect()
          .width;
        const padding = parseInt(
          window.getComputedStyle(box[0]).padding || "0"
        );
        translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
      }

      setTranslateX();

      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top top",
          end: `+=${translateX}`,
          scrub: true,
          pin: true,
          id: "work",
        },
      });

      timeline
        .to(
          ".work-flex",
          {
            x: -translateX,
            ease: "none",
          },
          0
        )
        .to(
          ".work-box",
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power1.out" },
          0
        );

      const onResize = () => {
        // recompute translateX and update scrollTrigger end
        setTranslateX();
        const st = ScrollTrigger.getById("work");
        if (st) {
          st.vars.end = `+=${translateX}`;
          st.refresh();
        }
      };

      window.addEventListener("resize", onResize);

      // cleanup
      return () => {
        timeline?.kill();
        ScrollTrigger.getById("work")?.kill();
        window.removeEventListener("resize", onResize);
      };
    }

    // Small screens: simply reveal boxes stacked vertically
    if (isSmall) {
      gsap.to(".work-box", { opacity: 1, y: 0, stagger: 0.05, duration: 0.4 });
    }
    return;
  });
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {[...Array(6)].map((_value, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>Project Name</h4>
                    <p>Category</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>Javascript, TypeScript, React, Threejs</p>
              </div>
              <WorkImage image="/images/placeholder.webp" alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
