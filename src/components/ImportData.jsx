import React, { useEffect, useState } from "react";

const Importer = () => {
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    if (jsonData) {
        var scale = 0.8;
        var character = 49;
        var fontSize = 0;
        var positionX = 0;
        var positionY = 0;
        var spaceSize = 1;
        var rotate = 0;
        var text ="";
        var curve = false;
        // read data to variable
        if (jsonData.text) {
            console.log("Text: ", jsonData.text);
            text = encodeURIComponent(jsonData.text);
        }
        if (jsonData.scale) {
            console.log("Scale: ", jsonData.scale);
            scale = jsonData.scale;
        }
        if (jsonData.character) {
            console.log("Character: ", jsonData.character);
            character = jsonData.character;
        }
        if (jsonData.fontSize) {
            console.log("Font Size: ", jsonData.fontSize);
            fontSize = jsonData.fontSize;
        }
        if (jsonData.position.x) {
            console.log("Position X: ", jsonData.position.x);
            positionX = jsonData.position.x;
        }
        if (jsonData.position.y) {
            console.log("Position Y: ", jsonData.position.y);
            positionY = jsonData.position.y;
        }
        if (jsonData.spaceSize) {
            console.log("Space Size: ", jsonData.spaceSize);
            spaceSize = jsonData.spaceSize;
        }
        if (jsonData.rotate) {
            console.log("Rotate: ", jsonData.rotate);
            rotate = jsonData.rotate;
        }
        if (jsonData.curve) {
            console.log("Curve: ", jsonData.curve);
            curve = jsonData.curve;
        }
        // redirect to the main page
        var str = "/?scale=" + scale + "&character=" + character + "&fontSize=" + fontSize + "&positionX=" + positionX + "&positionY=" + positionY + "&spaceSize=" + spaceSize + "&rotate=" + rotate + "&curve=" + curve + "&text=" + text;
        window.location.href = str;
    }
  }, [jsonData]);


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setJsonData(data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setJsonData(data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileUpload} />
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        Drag and drop a JSON file here
      </div>
    </div>
  );
};

export default Importer;
