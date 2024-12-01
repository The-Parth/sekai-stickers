import "./App.css";
import Canvas from "./components/Canvas";
import { useState, useEffect } from "react";
import characters from "./characters.json";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Picker from "./components/Picker";
import Info from "./components/Info";
import Importer from "./components/ImportData";


const { ClipboardItem } = window;

function App() {
  const [run, setRun] = useState(false);
  // after 3 seconds, set run to true
  useEffect(() => {
    setTimeout(() => {
      setRun(true);
    }, 3000);
  }, []);

  const [infoOpen, setInfoOpen] = useState(false);

  const handleClickOpen = () => {
    setInfoOpen(true);
  };

  const handleClose = () => {
    setInfoOpen(false);
  };

  const resetTextposition = () => {
    setPosition({
      x: characters[character].defaultText.x + 50,
      y: characters[character].defaultText.y + 60,
    });
  };
  const resetImageposition = () => {
    setImagePosition({ x: 0, y: 0 });
  };

  const [character, setCharacter] = useState(49);
  const [scale, setScale] = useState(85);
  const [text, setText] = useState(characters[character].defaultText.text);
  const [position, setPosition] = useState({
    x: characters[character].defaultText.x + 50,
    y: characters[character].defaultText.y + 60,
  });
  const [fontSize, setFontSize] = useState(characters[character].defaultText.s);
  const [spaceSize, setSpaceSize] = useState(18);
  const [rotate, setRotate] = useState(characters[character].defaultText.r);
  const [curve, setCurve] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [importerOpen, setImporterOpen] = useState(false);
  const [textColor, setTextColor] = useState(characters[character].color);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isImageDragging, setIsImageDragging] = useState(false);
  const img = new Image();

  //reset uploaded image's url and text colour when a new character is selected
  useEffect(() => {
    setImageUrl(null);
    setTextColor(characters[character].color);
    setLoaded(false);
    
  }, [character]);

  // Get Parameters from URL
  const location = window.location;
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // wait 2 seconds before proceeding with loading the data
    setTimeout(() => {
      if (params.get("character")) {
        setCharacter(parseInt(params.get("character")));
      }
      if (params.get("text")) {
        setText(decodeURIComponent(params.get("text")));
      }
      if (params.get("scale")) {
        setScale(parseInt(params.get("scale")));
      }
      const newPosition = { ...position };
      if (params.get("positionX")) {
        newPosition.x = parseInt(params.get("positionX"));
      }
      if (params.get("positionY")) {
        newPosition.y = parseInt(params.get("positionY"));
      }
      if (params.get("positionX") || params.get("positionY")) {
        setPosition(newPosition);
      }
      if (params.get("fontSize")) {
        setFontSize(parseInt(params.get("fontSize")));
      }
      if (params.get("spaceSize")) {
        setSpaceSize(parseInt(params.get("spaceSize")));
      }
      if (params.get("rotate")) {
        setRotate(parseFloat(params.get("rotate")));
      }
      if (params.get("curve") === "true") {
        setCurve(true);
      }
      if (params.get("textColor")) {
        setTextColor(params.get("textColor"));
      }
      if(params.get("imageUrl")){
        setImageUrl(decodeURIComponent(params.get("imageUrl")));
      }
      window.history.replaceState({}, document.title, location.pathname);

    }, 20);
  }, [location]);

  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    if (!run) return;
    setText(characters[character].defaultText.text);
    setPosition({
      x: characters[character].defaultText.x + 50,
      y: characters[character].defaultText.y + 60,
    });
    setRotate(characters[character].defaultText.r);
    setFontSize(characters[character].defaultText.s);
    setTextColor(characters[character].color);
    setImagePosition({ x: 0, y: 0 });
    setImageUrl(null);
    setLoaded(false);
  }, [character]);

  img.src = imageUrl ? imageUrl : "/img/" + characters[character].img;

  img.onload = () => {
    setLoaded(true);

  };

  let angle = (Math.PI * text.length) / 7;

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
    // Reset the input value to allow reuploading the same image
    event.target.value = null;

    // reset all image positions
    setImagePosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    const canvas = e.target.getBoundingClientRect();
    const x = e.clientX - canvas.left;
    const y = e.clientY - canvas.top;
  
    // Check if click is near the text
    if (
      text.length > 0 &&
      x > position.x - 120 &&
      x < position.x + 120 &&
      y > position.y - 50 &&
      y < position.y + 50
    ) {
      setIsDragging(true);
      setDragStart({ x, y });
      return;
    }
  
    const imgWidth = img.width * (scale / 100);
    const imgHeight = img.height * (scale / 100);
    const imgStartX = (canvas.width - imgWidth) / 2 + imagePosition.x;
    const imgStartY = (canvas.height - imgHeight) / 2 + imagePosition.y;
  
    if (
      x > imgStartX &&
      x < imgStartX + imgWidth &&
      y > imgStartY &&
      y < imgStartY + imgHeight
    ) {
      setIsImageDragging(true);
      setDragStart({ x, y });
      return;
    }
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging && !isImageDragging) return;

    const canvas = e.target.getBoundingClientRect();
    const x = e.clientX - canvas.left;
    const y = e.clientY - canvas.top;
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;
  
    if (isDragging) {
      setPosition((prevPosition) => ({
        x: prevPosition.x + deltaX,
        y: prevPosition.y + deltaY,
      }));
    }
  
    if (isImageDragging) {
      setImagePosition((prevPosition) => ({
        x: prevPosition.x + deltaX,
        y: prevPosition.y - deltaY,
      }));
    }
  
    setDragStart({ x, y });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsImageDragging(false);
  };
  
  
  const draw = (ctx) => {
    ctx.canvas.width = 400;
    ctx.canvas.height = 390;

    if (loaded && document.fonts.check("12px YurukaStd")) {
      var hRatio = ctx.canvas.width / img.width;
      var vRatio = ctx.canvas.height / img.height;
      var ratio = (Math.min(hRatio, vRatio) * scale) / 100;
      var centerShift_x = (ctx.canvas.width - img.width * ratio) / 2;
      var centerShift_y = (ctx.canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x + imagePosition.x,
        centerShift_y - imagePosition.y,
        img.width * ratio,
        img.height * ratio
      );
      ctx.font = `${fontSize}px YurukaStd, SSFangTangTi`;
      ctx.lineWidth = 9;
      ctx.save();

      ctx.translate(position.x, position.y);
      ctx.rotate(rotate / 10);
      ctx.textAlign = "center";
      ctx.strokeStyle = "white";
      ctx.fillStyle = textColor;
      var lines = text.split("\n");
      if (curve) {
        for (let line of lines) {
          for (let i = 0; i < line.length; i++) {
            ctx.rotate(angle / line.length / 2.5);
            ctx.save();
            ctx.translate(0, -1 * fontSize * 3.6);
            ctx.strokeText(line[i], 0, 0);
            ctx.fillText(line[i], 0, 0);
            ctx.restore();
          }
        }
      } else {
        for (var i = 0, k = 0; i < lines.length; i++) {
          ctx.strokeText(lines[i], 0, k);
          ctx.fillText(lines[i], 0, k);
          k += spaceSize;
        }
        ctx.restore();
      }
    }
  };

  const importDataCallback = (data) => {
    if (data.imageUrl) {
      setImageUrl(data.imageUrl);
      img.src = data.imageUrl;
    } else {
      setImageUrl(null);
      setCharacter(data.character);
      img.src = "/img/" + characters[data.character].img
    }
    setTimeout(() => {
    setScale(data.scale);
    setText(data.text);
    setPosition(data.position);
    setFontSize(data.fontSize);
    setSpaceSize(data.spaceSize);
    setRotate(data.rotate);
    setCurve(data.curve);
    setTextColor(data.textColor);
    console.log(data.textColor)
    setImagePosition(data.imagePosition);
    }, 100);
  };

  const download = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    const link = document.createElement("a");
    link.download = `${characters[character].name.replace(
      " ",
      "_"
    )}_sticker.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); 
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  function b64toBlob(b64Data, contentType = null, sliceSize = null) {
    contentType = contentType || "image/png";
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  const copy = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    await navigator.clipboard.write([
      new ClipboardItem({
      "image/png": b64toBlob((canvas.toDataURL().split(",")[1])),
      }),
    ]);
  };


  
  
  const exportVals = () => {
    const data = {
      character,
      scale,
      text,
      position,
      fontSize,
      spaceSize,
      rotate,
      curve,
      textColor,
      imagePosition,
    };

    if (imageUrl) {
        data.imageUrl = imageUrl;
        data.custom = true;
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    var defName = "";
    if (imageUrl) {
       defName = "custom_image_data";
    } else {
        defName = `${characters[character].name.replace(" ", "_")}_data`;
    }

    const fileName = window.prompt("Enter the file name", `${defName}`);

    if (fileName) {
      link.download = fileName + ".json";
      link.click();
    }

    URL.revokeObjectURL(url);
  };

  return (
    <div className="App" style={{ fontFamily: "YurukaStd" }}>
      <Info open={infoOpen} handleClose={handleClose} />
      <div className="header">
        <h1 onClick={() => (window.location.href = "/")}>
          Project Sekai Sticker Maker
        </h1>
      </div>
      <div className="container">
        <div className="vertical" id="canvas-container">
          <div className="horizontal">
            <div className="canvas">
              <Canvas draw={draw} 
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}  
                />
              <Slider
                className="slider-horizontal"
                value={position.x}
                onChange={(e, v) => setPosition({ ...position, x: v })}
                min={0}
                max={400}
                step={1}
                track={false}
                color="secondary"
              />
              <div style={{ fontFamily: "YurukaStd", marginTop: "-10px" }}>
                <label>X: </label>
                <Slider
                  className="slider"
                  value={imagePosition.x}
                  onChange={(e, v) =>
                    setImagePosition({ ...imagePosition, x: v })
                  }
                  min={-200}
                  max={200}
                  step={1}
                  track={false}
                  color="secondary"
                />
              </div>
            </div>
          </div>
          <Slider
            value={curve ? 390 - position.y + fontSize * 3 : 390 - position.y}
            onChange={(e, v) =>
              setPosition({
                ...position,
                y: curve ? 390 + fontSize * 3 - v : 390 - v,
              })
            }
            min={0}
            max={390}
            step={1}
            orientation="vertical"
            track={false}
            color="secondary"
          />

          <label>Y: </label>
          <Slider
            className="slider"
            value={imagePosition.y}
            onChange={(e, v) => setImagePosition({ ...imagePosition, y: v })}
            min={-200}
            max={200}
            step={1}
            track={false}
            orientation="vertical"
            color="secondary"
          />
        </div>

        <div className="horizontal">
          <div className="settings">
            <div>
              <label>Scale: </label>
              <Slider
                className="slider"
                value={scale}
                onChange={(e, v) => setScale(v)}
                min={15}
                max={110}
                step={1}
                track={false}
                color="secondary"
              />
            </div>
            <div>
              <label>Rotate: </label>
              <Slider
                className="slider"
                value={rotate}
                onChange={(e, v) => setRotate(v)}
                min={-10}
                max={10}
                step={0.2}
                track={false}
                color="secondary"
              />
            </div>
            <div>
              <label>
                <nobr>Font size: </nobr>
              </label>
              <Slider
                className="slider"
                value={fontSize}
                onChange={(e, v) => setFontSize(v)}
                min={10}
                max={100}
                step={1}
                track={false}
                color="secondary"
              />
            </div>
            <div>
              <label>
                <nobr>Spacing: </nobr>
              </label>
              <Slider
                className="slider"
                value={spaceSize}
                onChange={(e, v) => setSpaceSize(v)}
                min={18}
                max={100}
                step={1}
                track={false}
                color="secondary"
              />
            </div>
            <div>
              <label>Curve (Beta): </label>
              <Switch
                checked={curve}
                onChange={(e) => setCurve(e.target.checked)}
                color="secondary"
              />
            </div>

            <div style={{ paddingBottom: "15px" }}>
              <label>Text Color:</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                style={{ marginLeft: "25px" }}
              />
            </div>
          </div>
          <div className="text">
            <TextField
              label="Text"
              size="small"
              color="secondary"
              value={text}
              multiline={true}
              fullWidth
              onChange={(e) => setText(e.target.value)}
              style={{marginTop: '15px'}}
            />
          </div>
          <div className="horizontal">
            <div className="picker">
              <Button
                variant="contained"
                color="secondary"
                component="label"
                style={{ marginTop: "15px" }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  hidden
                />
              </Button>
            </div>
            <div className="horizontal">
              <Button color="secondary" variant="contained" style={{marginTop:'15px'}} onClick={resetTextposition}  >
                Reset Text Position
              </Button>
              <Button color="secondary" variant="contained" style={{marginTop:'15px'}} onClick={resetImageposition}>
                Reset Image Position
              </Button>
            </div>

            <div className="picker" style={{ marginTop: "15px" }}>
              <Picker setCharacter={setCharacter} />
             </div>
            
            <div className="horizontal">
              <Button variant="contained" color="secondary" component="label" style={{marginTop:'15px'}}>
                Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden/>
              </Button>
            </div>
             <div className="buttons">
              <Button color="secondary" onClick={copy}>
                Copy
              </Button>
              <Button color="secondary" onClick={download}>
                Download
              </Button>
            </div>
            <div classname="horizontal">
              <Button color="secondary" onClick={exportVals}>
                Export as JSON
              </Button>
            </div>
          </div>
          <Button
            color="primary"
            onClick={() => setImporterOpen(!importerOpen)}
          >
            {importerOpen ? "Close" : "Import JSON"}
          </Button>
        </div>
      </div>
      {importerOpen && <Importer callback={importDataCallback} />}
      <div className="footer">
        <p>©SEGA / Project Sekai</p>
        <p>
          This website is not affiliated with or endorsed by SEGA, Colourful
          Palette, or Crypton Future Media.
        </p>
        <Button color="secondary" onClick={handleClickOpen}>
          Info
        </Button>
      </div>

 

      
    </div>
  );
}

export default App;
