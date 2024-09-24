import { useState } from "react";
import Particle from "./Particles";
import axios from "axios";

const Typewriter = () => {
  const [value, setValue] = useState("Start Searching!");
  const [count, setCount] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [responseList, setResponseList] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleInput = () => {
    const searchBox = document.getElementById("search-box");
    searchBox.style.height = "auto";
    searchBox.style.height = searchBox.scrollHeight + "px";
    searchBox.style.width = "500px";
    searchBox.style.width = searchBox.scrollWidth + "px";
    searchBox.style.resize = "vertical";
    searchBox.style.whiteSpace = "normal";
    searchBox.style.maxWidth = "600px";
    searchBox.style.textWrap = "wrap";
    searchBox.style.fontSize = "1em";
    searchBox.style.border = "2px solid white";
  };

  const handleClick = () => {
    if (count === 0) setValue("");
    setCount(count + 1);
    setShowButton(value != null || value === "" ? true : "");
  };

  const processResponseString = (str) => {
    str = JSON.stringify(str);
    var strArray = str.trim().split("");

    strArray = reProcessArray(strArray);

    return strArray.join("");
  };

  const reProcessArray = (strArray) => {
    strArray.forEach((char, index) => {
      switch (char) {
        case '"':
          strArray[index] = '"';
          break;

        case "\n":
          strArray[index] = "\n";
          break;

        case "\\":
          if (strArray[index + 1] === "n") {
            strArray[index] = "";
            strArray[index + 1] = "\n";
          } else if (strArray[index + 1] === '"') {
            strArray[index] = "";
            strArray[index + 1] = '"';
          } else if (
            strArray[index + 1] === "t" ||
            typeof strArray[index + 1] === "number"
          ) {
            strArray[index] = "";
            strArray[index + 1] = "";
          }
          break;

        case "*":
          strArray[index] = "";
          break;
      }
    });
    return strArray;
  };

  const submitQuery = (e) => {
    e.preventDefault();
    const query = document.getElementById("search-box").value;

    try {
      axios
        .post("http://127.0.0.1:5000/ask", { query })
        .then((res) => {
          const responseQuery = query;
          const responseDescription = processResponseString(res.data.response);
          const jsonResponseObject = {
            query: responseQuery,
            description: responseDescription,
          };
          setResponseList([jsonResponseObject, ...responseList]);
          setError("");
          console.log(responseDescription);
        })
        .catch((err) => {
          setError(err.message);
          const responseQuery = query;
          const responseDescription = err.message;
          const jsonResponseObject = {
            query: responseQuery,
            description: responseDescription,
          };
          setResponseList([jsonResponseObject, ...responseList]);
        });
    } catch (err) {
      setError(err.message);
    }

    if (query !== null) {
      const mainContainer =
        document.getElementsByClassName("main-container")[0];
      mainContainer.classList.remove("flex-center");
      const outerContainer =
        document.getElementsByClassName("outer-container")[0];
      outerContainer.classList.add("move-bottom");
      const responseBox = document.getElementsByClassName("response")[0];
      responseBox.style.minHeight = "21em";
      responseBox.style.overFlow = "hidden";
      responseBox.style.backgroundColor="#7463f881";
      const searchBox = document.getElementsByClassName("search-box")[0];
      searchBox.style.backgroundColor = "transparent";
      setValue("");
    }

    resetSearchBoxSize();
  };

  const resetSearchBoxSize = () => {
    const searchBox = document.getElementById("search-box");
    searchBox.style.height = "2em";
    searchBox.style.minWidth = "10em";
  };

  return (
    <>
      <Particle />
      <div className="main-container flex-center">
        <div className="response">
          <ul>
            {responseList.map((item, index) => (
              <ul key={index}>
                {responseList.query != null || responseList.query != "" ? (
                  <div id="query-div">
                    <span id="query-span">
                      {" "}
                      {item.query.charAt(0).toUpperCase() +
                        item.query.slice(1).toLowerCase()}
                    </span>
                  </div>
                ) : (
                  ""
                )}

                {responseList.description != null ||
                responseList.description != "" ? (
                  <div id="description-div">
                    <div id="description-span">Description:</div>{" "}
                    {item.description}
                  </div>
                ) : (
                  ""
                )}
              </ul>
            ))}
            {responseList && <div className="incoming-line"></div>}
          </ul>
        </div>
        <div className="outer-container">
          <div
            contentEditable
            className="typewriter"
            onChange={handleInput}
            suppressContentEditableWarning={true}
          >
            <textarea
              type="text"
              className="search-box"
              id="search-box"
              rows={1}
              value={value}
              onClick={handleClick}
              onChange={handleChange}
              onInput={handleInput}
              placeholder="Enter text here!"
            />
          </div>
          <div>
            {showButton && (
              <button id="search-button" onClick={submitQuery}>
                <span id="arrow-symbol">&#10230;</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Typewriter;
