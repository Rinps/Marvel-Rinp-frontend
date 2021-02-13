import { useState } from "react";
import imageTest from "../assets/images/THE_dog.webp";

const Test = () => {
  console.log(
    "If you see this page, it means I have messed up. It was supposed to be removed at the end of the test. I used it to test html and css implementations"
  );

  const [elementToScroll, setElementToScroll] = useState();

  const handleHover = (event) => {
    console.log("target", event.target);
    if (event.relatedTarget.lastChild) {
      const target = event.relatedTarget.lastChild;
      target.scrollBy({ left: 200, behavior: "smooth" });
      setElementToScroll(target);
    }
  };

  const handleNoHovering = () => {
    if (elementToScroll) {
      elementToScroll.scrollBy({ left: -200, behavior: "smooth" });
      setElementToScroll();
    }
  };

  return (
    <div
      className="test"
      onMouseEnter={handleHover}
      onMouseLeave={handleNoHovering}
    >
      <div className="cover"></div>
      <div className="fiche" id="page1">
        <div className="nom">
          <h1>LABREINSTEIN</h1>
        </div>
        <div className="conteneur">
          <img className="portrait" src={imageTest} alt="" />
        </div>
      </div>

      <div className="fiche" id="page2">
        Le meilleur de la crême de la crême, DOCTEUR LABREINSTEIN DANS LA PLACE!
      </div>
    </div>
  );
};

export default Test;
