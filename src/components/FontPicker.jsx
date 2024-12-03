import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, Select, InputLabel } from '@mui/material';

const fonts = [
    { name: "YurukaStd", url: "./fonts/YurukaStd.woff2", format: "woff2"},
    { name: 'Impact', url: null},
    { name: 'Arial', url: null },
    { name: "Noto Sans", url: "./fonts/NotoSansJP.ttf", format: "truetype" },
    { name: "Not Sans JP", url: './fonts/NotoSansJP.ttf', format: 'truetype' },
    { name: "Noto Sans KR", url: './fonts/NotoSansKR.ttf', format: 'truetype' },
];

const FontPicker = ({ mainSetter }) => {
    const [font, setFont] = useState(fonts[0]);

    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/fonts/YurukaStd.woff2';
    document.head.appendChild(link);
    
    useEffect(() => {
        let link;

        // add @font-face rule to the document
        if (font.url) {
            if (font.url.includes('https://fonts.googleapis.com')) {
                link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = font.url;
                document.head.appendChild(link);
                mainSetter(font.name);
                console.log(`Font ${font.name} loaded from Google Fonts`);
            } else {
                const str = `url(${font.url}) ${font.format ? `format('${font.format}')` : ''}`;
                console.log(str);
                const fontFace = new FontFace(font.name, str);
                fontFace.load().then((loadedFont) => {
                    document.fonts.add(loadedFont);
                    mainSetter(font.name);
                    console.log(`Font ${font.name} loaded`);
                });
            }
        } else {
            mainSetter(font.name);
        }

        return () => {
            if (link) {
                document.head.removeChild(link);
                console.log(`Font ${font.name} link removed`);
            }
        };
    }, [font, mainSetter]);

    return (
        <div>
        <FormControl style={{ width: '12rem', marginTop: '1rem' }}>
            <InputLabel id="font-picker-label">Font</InputLabel>
            <Select
                labelId="font-picker-label"
                value={font}
                onChange={(e) => setFont(e.target.value)}
                label="Font"
                style={{ height: '2.5rem' }} // Adjust the height as needed
            >
                {fonts.map((font, index) => (
                    <MenuItem key={index} value={font}>
                        {font.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        </div>
    );
};

export default FontPicker;