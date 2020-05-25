import React from "react";
import './image-link-form.css';

const ImageLinkForm = ({ onInputChange, onSubmit }) => {
  return (
    <div>
      <p className="f3">
        {"This Magic Brain will detect faces in your picture. Give it a try! Paste a valid image url into the textbox below!"}
      </p>
      <div className="center">
        <div className="pa4 br3 shadow-5 form center" >
          <input className="f4 pa2 w-70 center" type="text" onChange={onInputChange} />
          <button className="w-30 grow f4 link ph3 pv2 dib white bg-light-blue" onClick={onSubmit} >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
