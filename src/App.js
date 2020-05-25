import React, { useState } from "react";
import "./App.css";
import Navigation from "./components/navigation/navigation.component";
import Logo from "./components/logo/logo.component";
import ImageLinkForm from "./components/image-link-form/image-link-form.component";
import Rank from "./components/rank/rank.component";
import Particles from "react-particles-js";
import FaceRecognition from "./components/face-recognition/face-recognition.component";
import Signin from "./components/signin/signin.component";
import Register from "./components/register/register.component";

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 700,
      },
    },
  },
};

function App() {
  const [input, setInput] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [boxes, setBoxes] = useState([]);
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [state, setState] = useState({
    user: {
      id: "",
      name: "",
      email: "",
      entries: 0,
      joined: "",
    },
  });

  const loadUser = (data) => {
    setState({
      ...state,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  const calculateFaceLocations = (data) => {
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    const detectedFaces = data.outputs[0].data.regions;
    var detectedBoxes = [];
    for (var elem in detectedFaces) {
      const boundingBox = detectedFaces[elem].region_info.bounding_box;
      const faceLocationParams = {
        leftCol: boundingBox.left_col * width,
        topRow: boundingBox.top_row * height,
        rightCol: width - boundingBox.right_col * width,
        bottomRow: height - boundingBox.bottom_row * height,
      };
      detectedBoxes.push(faceLocationParams);
    }
    return detectedBoxes;
  };

  const displayFaceBox = (boxes) => {
    setBoxes(boxes);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onSubmit = () => {
    setImageUrl(input);
    fetch("https://facereco-server.herokuapp.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch("https://facereco-server.herokuapp.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              setState((prevState) => ({
                user: {
                  ...prevState.user,
                  entries: count,
                },
              }));
            })
            .catch(console.log);
        }
        displayFaceBox(calculateFaceLocations(response));
      })
      .catch((err) => console.log(err));
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      setIsSignedIn(false);
      setImageUrl("");
      setBoxes([]);
      setRoute("signin");
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      {route === "home" ? (
        <div>
          <Logo />
          <Rank name={state.user.name} entires={state.user.entries} />
          <ImageLinkForm onInputChange={onInputChange} onSubmit={onSubmit} />
          <FaceRecognition imageUrl={imageUrl} boxes={boxes} />
        </div>
      ) : route === "signin" ? (
        <Signin onRouteChange={onRouteChange} loadUser={loadUser} />
      ) : (
        <Register onRouteChange={onRouteChange} loadUser={loadUser} />
      )}
    </div>
  );
}

export default App;
