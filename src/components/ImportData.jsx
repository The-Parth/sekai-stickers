import React, { useEffect, useState } from "react";

const Importer2 = () => {
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
        var textColor = "#000000";
        var game = "sekai";
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
        if (jsonData.textColor) { 
            console.log("Text Color: ", jsonData.textColor);
            textColor = jsonData.textColor
        }

          
      
        // redirect to the main page
        var str =
        "/?scale=" + scale + "&character=" + character + "&fontSize=" + fontSize + "&positionX=" + positionX + "&positionY=" + positionY + "&spaceSize=" + spaceSize + "&rotate=" + rotate + "&curve=" + curve + "&text=" + text+"&textColor=" + encodeURIComponent(textColor);
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

const Importer = ({ callback }) => {
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    if (jsonData) {
        var scale = 0.8;
        var character = 49;
        var fontSize = 0;
        var positionX = 0;
        var positionY = 0;
        var imagePositionX = 0;
        var imagePositionY = 0;
        var spaceSize = 1;
        var rotate = 0;
        var text ="";
        var curve = false;
        var xscale = 1;
        var yscale = 1;
        var font = "YurukaStd";
        var textColor = null;
        var game = "sekai";
        
        // read data to variable
        if (jsonData.text) {
            console.log("Text: ", jsonData.text);
            text = jsonData.text;
        }
        if (jsonData.scale) {
            console.log("Scale: ", jsonData.scale);
            scale = jsonData.scale;
        }
        if (true) {
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
        if (jsonData.imagePosition) {
            console.log("Image Position: ", jsonData.imagePosition);
            imagePositionX = jsonData.imagePosition.x;
            imagePositionY = jsonData.imagePosition.y;
        }
        if (jsonData.xscale) {
            console.log("X Scale: ", jsonData.xscale);
            xscale = jsonData.xscale;
        }
        if (jsonData.yscale) {
            console.log("Y Scale: ", jsonData.yscale);
            yscale = jsonData.yscale;
        }

        var imageUrl = null;
        if (jsonData.custom) {
            if (jsonData.imageUrl) {
                console.log("Image URL: ", jsonData.imageUrl);
                imageUrl = jsonData.imageUrl;
            }
        }

        if (jsonData.textColor) {
            console.log("Text Color: ", jsonData.textColor);
            textColor = jsonData.textColor;
        }

        if (jsonData.font) {
            console.log("Font: ", jsonData.font);
            font = jsonData.font;
        }

        if (jsonData.game) {
            console.log("Game: ", jsonData.game);
            game = jsonData.game;
        }
        
        // redirect to the main page
        const data = {
            scale: scale,
            character: character,
            fontSize: fontSize,
            position: {
                x: positionX,
                y: positionY
            },
            spaceSize: spaceSize,
            imagePosition: {
                x: imagePositionX,
                y: imagePositionY
            },
            rotate: rotate,
            curve: curve,
            text: text,
            textColor: textColor,
            custom: jsonData.custom,
            imageUrl: imageUrl,
            xscale: xscale,
            yscale: yscale,
            font: font,
            game: game
        };

        // parse data to callback function
        callback(data);

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
