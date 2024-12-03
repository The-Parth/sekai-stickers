import "./App.css";
import Canvas from "./components/Canvas";
import { useState, useEffect } from "react";
import characters from "./characters.json";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { Grid } from "@mui/material";
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
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeAnchor, setActiveAnchor] = useState(null);
  const [xscale, setXscale] = useState(1);
  const [yscale, setYscale] = useState(1);
  const img = new Image();
const pointSize=10;
//use state of array of 8 points 
const [points, setPoints] = useState([
  { x: 0, y: 0 }, // Top-left
  { x: 0, y: 0 }, // Top-right
  { x: 0, y: 0 }, // Bottom-left
  { x: 0, y: 0 }, // Bottom-right
  { x: 0, y: 0 }, // Top-middle
  { x: 0, y: 0 }, // Left-middle
  { x: 0, y: 0 }, // Bottom-middle
  { x: 0, y: 0 }, // Right-middle
]);

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
      if (params.get("imageUrl")) {
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
      setSelectedElement("text");
      return;
    }

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = (Math.min(hRatio, vRatio) *scale) / 100;
    const imgStartX = (canvas.width - img.width * ratio) / 2;
    const imgStartY = (canvas.height - img.height * ratio) / 2;
    const imgRenderedWidth = img.width * ratio;
    const imgRenderedHeight = img.height * ratio;
    
   if (
  x > imgStartX - 25 &&
  x < imgStartX + imgRenderedWidth + 25 &&
  y > imgStartY - 25 &&
  y < imgStartY + imgRenderedHeight + 25
) {
  
  setIsImageDragging(true);
  for (let i = 0; i < points.length; i++) {
    const { x: px, y: py } = points[i];
    if (Math.abs(x - px) <= pointSize && Math.abs(y - py) <= pointSize) {
      console.log("Point clicked at index:", i);
      setActiveAnchor(i);
      }
    
  }
  setDragStart({ x, y });
  setSelectedElement("image");
  

  // console.log(points);

  return;
}
    
    setSelectedElement(null);
  };


  const handleMouseMove = (e) => {
    if (!isDragging && !isImageDragging) return;

   

    const canvas = e.target.getBoundingClientRect();
    const x = e.clientX - canvas.left;
    const y = e.clientY - canvas.top;
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    const updateScale = (activeAnchor, dx, dy) => {
      setXscale((prevXscale) => {
        let newXscale = prevXscale;
        //this one was fun to figure out
        switch (activeAnchor) {
          case 0: // Top-left
          {
            setImagePosition((prevImagePosition) => ({
              x: prevImagePosition.x + dx,
              y: prevImagePosition.y - dy,
            }));
            newXscale -= dx * 0.003;
            break;
          }
    
          case 2: // Bottom-left
          {
            setImagePosition((prevImagePosition) => ({
              x: prevImagePosition.x + dx,
              y: prevImagePosition.y,
            }));
            newXscale -= dx * 0.003;
            break;
          }
    
          case 5: // Left-middle
          {
            setImagePosition((prevImagePosition) => ({
              x: prevImagePosition.x + dx,
              y: prevImagePosition.y,
            }));
            newXscale -= dx * 0.003;
            break;
          }
    
          case 1: // Top-right
          {
            setImagePosition((prevImagePosition) => ({
              x: prevImagePosition.x,
              y: prevImagePosition.y - dy,
            }));
            newXscale += dx * 0.002;
            break;
          }
    
          case 3: // Bottom-right
          {
            newXscale += dx * 0.002;
            break;
          }
    
          case 7: // Right-middle
          {
            newXscale += dx * 0.002;
            break;
          }
    
          default:
            break;
        }
    
        return newXscale;
      });
    
      setYscale((prevYscale) => {
        let newYscale = prevYscale;
    
        switch (activeAnchor) {
          case 0: // Top-left
          {
            newYscale -= dy * 0.003;
            break;
          }
    
          case 1: // Top-right
          {
            newYscale -= dy * 0.003;
            break;
          }
    
          case 4: // Top-middle
          {
            setImagePosition((prevImagePosition) => ({
              x: prevImagePosition.x,
              y: prevImagePosition.y - dy,
            }));
            newYscale -= dy * 0.003;
            break;
          }
    
          case 2: // Bottom-left
          {
            newYscale += dy * 0.003;
            break;
          }
    
          case 3: // Bottom-right
          {
            newYscale += dy * 0.003;
            break;
          }
    
          case 6: // Bottom-middle
          {
            newYscale += dy * 0.003;
            break;
          }
    
          default:
            break;
        }
    
        return newYscale;
      });
    };
    
    if (isDragging) {
      setPosition((prevPosition) => ({
        x: prevPosition.x + deltaX,
        y: prevPosition.y + deltaY,
      }));
    }

    if (isImageDragging&&activeAnchor==null) {
      setImagePosition((prevPosition) => ({
        x: prevPosition.x + deltaX,
        y: prevPosition.y - deltaY,
      }));
    }
    if (isImageDragging&&activeAnchor!==null) { 

      updateScale(activeAnchor, deltaX, deltaY);
    }

    setDragStart({ x, y });
  };
  

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsImageDragging(false);
    setActiveAnchor(null);
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
        img.width * ratio*xscale,
        img.height * ratio*yscale
      );
      if (selectedElement === "image") {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#00bcd4";
        const imageX = centerShift_x + imagePosition.x;
        const imageY = centerShift_y - imagePosition.y;
        const imageWidth = img.width * ratio*xscale;
        const imageHeight = img.height * ratio*yscale;
        ctx.strokeRect(imageX, imageY, imageWidth, imageHeight);
    
        const pointSize = 6; 
    
        const points = [
            { x: imageX, y: imageY }, // Top-left
            { x: imageX + imageWidth, y: imageY }, // Top-right
            { x: imageX, y: imageY + imageHeight }, // Bottom-left
            { x: imageX + imageWidth, y: imageY + imageHeight }, // Bottom-right
            { x: imageX + imageWidth / 2, y: imageY }, // Top-middle
            { x: imageX, y: imageY + imageHeight / 2 }, // Left-middle
            { x: imageX + imageWidth / 2, y: imageY + imageHeight }, // Bottom-middle
            { x: imageX + imageWidth, y: imageY + imageHeight / 2 }, // Right-middle
        ];

        setPoints(points);
      



        
    
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2);
            ctx.fillStyle = "#00bcd4";
            ctx.fill();
            ctx.closePath();
        });
        
    }
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
        if (selectedElement === "text") {
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#00bcd4";
        
          //all that math for a text selection box 
          const maxWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
          const lineHeight = fontSize * 1.3; 
          const boxHeight = (lines.length * lineHeight);
      
          const padding = fontSize * 0.3;
      
          const totalHeight = boxHeight + padding * 2 + ((lines.length*spaceSize)/2 - fontSize);
      
          const yOffset = -(boxHeight / 2 + padding);
      
          ctx.strokeRect(
              -maxWidth / 2 - padding,  
              yOffset,                  
              maxWidth + 2 * padding,  
              totalHeight+((lines.length-1)*fontSize)           
          );
      }
      
      
      
        ctx.restore();
      }
    }
  };

  const handleTouchStart = (e) => {
    // Prevent the default touch action
    const touch = e.touches[0];
    handleMouseDown({
      clientX: touch.clientX,
      clientY: touch.clientY,
      target: e.target,
    });
  };

  const handleTouchMove = (e) => {
    // Prevent the default touch action
    const touch = e.touches[0];
    handleMouseMove({
      clientX: touch.clientX,
      clientY: touch.clientY,
      target: e.target,
    });
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const importDataCallback = (data) => {
    if (data.imageUrl) {
      setImageUrl(data.imageUrl);
      img.src = data.imageUrl;
    } else {
      setImageUrl(null);
      setCharacter(data.character);
      img.src = "/img/" + characters[data.character].img;
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
      console.log(data.textColor);
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

  const getDominantColor = (imageObject) => {
    const context = document.createElement("canvas").getContext("2d");
    context.drawImage(imageObject, 0, 0, 1, 1);
    const i = context.getImageData(0, 0, 1, 1).data;

    const HEX =
      "#" +
      ((1 << 24) + (i[0] << 16) + (i[1] << 8) + i[2]).toString(16).slice(1);
    return HEX;
  };

const accentHex = (hex) => {
    let r = 255 - parseInt(hex.substring(1, 3), 16);
    let g = 255 - parseInt(hex.substring(3, 5), 16);
    let b = 255 - parseInt(hex.substring(5, 7), 16);

    const toHex = (c) => c.toString(16).padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        img.src = reader.result;
        // Find the most dominant color in the image
        const imageObject = new Image();
        imageObject.src = reader.result;
        imageObject.onload = () => {
          const dom = getDominantColor(imageObject);
          console.log(dom);
          setTextColor(accentHex(dom));
        };
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
        "image/png": b64toBlob(canvas.toDataURL().split(",")[1]),
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
              <Canvas
                draw={draw}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  cursor: isDragging || isImageDragging ? "grabbing" : "grab",
                  touchAction: "none",
                }}
              />
              <Slider
                className="slider-horizontal"
                value={position.x}
                onChange={(e, v) => setPosition({ ...position, x: v })}
                min={0}
                max={400}
                step={1}
                track={false}
                color="primary"
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
                  color="primary"
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
            color="primary"
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
            color="primary"
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
                color="primary"
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

            <div style={{ paddingBottom: "10px" }}>
              <label>Text Color:</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                style={{ marginLeft: "20px" }}
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
              style={{ marginTop: "5px" }}
            />
          </div>

          <div className="picker" style={{ marginTop: "7px" }}>
            <Picker setCharacter={setCharacter} />
          </div>

          <div className="horizontal">
            <Button
              variant="contained"
              color="secondary"
              component="label"
              style={{ marginTop: "7px" }}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
            </Button>
          </div>
          <div className="horizontal">
            <div style={{ paddingTop: "-10px" }}>
              <h3> Reset Positions </h3>

              <div className="buttons" style={{ marginTop: "7px" }}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ marginTop: "7px" }}
                      onClick={resetTextposition}
                    >
                      Text
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ marginTop: "7px" }}
                      onClick={resetImageposition}
                    >
                      Image
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div className="buttons">
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button color="secondary" onClick={copy}>
                    Copy
                  </Button>
                </Grid>
                <Grid item>
                  <Button color="secondary" onClick={download}>
                    Download
                  </Button>
                </Grid>
              </Grid>
            </div>
            <Grid item>
              <Button color="secondary" onClick={exportVals}>
                Export as JSON
              </Button>
            </Grid>
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
