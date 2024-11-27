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
import getConfiguration from "./utils/config";
import log from "./utils/log";
import Importer from "./components/ImportData";
import { bannerViewed, setBannerViewed } from "./utils/banner";
import { useLocation, useSearchParams } from "react-router-dom";


const { ClipboardItem } = window;

function App() {
  const [config, setConfig] = useState(null);
  const [bannerView, setBannerView] = useState(bannerViewed());

  const [run, setRun] = useState(false);

  // after 3 seconds, set run to true
  useEffect(() => {
    setTimeout(() => {
      setRun(true);
    }, 3000);
  }, []);

  // using this to trigger the useEffect because lazy to think of a better way
  const [rand, setRand] = useState(0);
  useEffect(() => {
    try {
      const data = async () => {
        const res = await getConfiguration();
        setConfig(res);
      };
      data();
    } catch (error) {
      console.log(error);
    }
  }, [rand]);

  const [infoOpen, setInfoOpen] = useState(false);

  const handleClickOpen = () => {
    setInfoOpen(true);
  };

  const handleClose = () => {
    setInfoOpen(false);
  };

  const [character, setCharacter] = useState(49);
  const [scale, setScale] = useState(85);
  const [text, setText] = useState(characters[character].defaultText.text);
  const [position, setPosition] = useState({
    x: characters[character].defaultText.x + 50,
    y: characters[character].defaultText.y + 60,
  });
  const [fontSize, setFontSize] = useState(characters[character].defaultText.s);
  const [spaceSize, setSpaceSize] = useState(1);
  const [rotate, setRotate] = useState(characters[character].defaultText.r);
  const [curve, setCurve] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [importerOpen, setImporterOpen] = useState(false);
  const img = new Image();

  // Get Parameters from URL
  const location = window.location;
  useEffect(() => {
    console.log(location);
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
      setLoaded(false);
    }, 20);
    
  }, [location]);

  useEffect(() => {
    if (!run) return;
    setText(characters[character].defaultText.text);
    setPosition({
      x: characters[character].defaultText.x + 50,
      y: characters[character].defaultText.y + 60,
    });
    setRotate(characters[character].defaultText.r);
    setFontSize(characters[character].defaultText.s);
    setLoaded(false);
  }, [character]);

  img.src = "/img/" + characters[character].img;

  img.onload = () => {
    setLoaded(true);
  };

  let angle = (Math.PI * text.length) / 7;

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
        centerShift_x,
        centerShift_y,
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
      ctx.fillStyle = characters[character].color;
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

  const download = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    const link = document.createElement("a");
    link.download = `${characters[character].name.replace(
      " ",
      "_"
    )}_sticker.png`;
    link.href = canvas.toDataURL();
    link.click();
    await log(characters[character].id, characters[character].name, "download");
    setRand(rand + 1);
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
    await log(characters[character].id, characters[character].name, "copy");
    setRand(rand + 1);
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
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${characters[character].name.replace(" ", "_")}_data.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <Info open={infoOpen} handleClose={handleClose} config={config} />
      <div className="header">
        <h1 onClick={() => (window.location.href = "/")}>
          Project Sekai Sticker Maker
        </h1>
      </div>
      <div className="container">
        <div className="vertical">
          <div className="horizontal">
            <div className="canvas">
              <Canvas draw={draw} />
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
            />
          </div>
          <div className="horizontal">
            <div className="picker">
              <Picker setCharacter={setCharacter} />
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
      {importerOpen && <Importer />}
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
