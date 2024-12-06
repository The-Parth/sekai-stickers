# Sticker Sources

## Current Sticker Sources

### Project Sekai
- Original stickers from [Reddit](https://www.reddit.com/r/ProjectSekai/comments/x1h4v1/after_an_ungodly_amount_of_time_i_finally_made/)
- Cropped images by [Modder4869](https://github.com/Modder4869)

### Arcaea
- Original stickers source idk lol, picked from [here](https://github.com/Rosemoe/arcaea-stickers)


## Contributing New Games and Stickers

Since we have multi-game support, you can create a pull request (PR) with your own game and stickers. All stickers should be placed in the `src/gamename` directory and provide a `{game}.json` file in the `src/` directory. The JSON file should contain the following structure:

```json
[
  {
    "id": 1,
    "name": "Sticker Name",
    "character": "Character Name",
    "img": "gamefolder_in_img/sticker.png",
    "color": "Text Color in Hex",
    "defaultText": {
      "text": "Default Text",
      "x": 148,
      "y": 58,
      "r": -2,
      "s": 47
    }
  }
]
```

Please make sure to respect the structure and provide the correct image path. Do not add the game to the picker. We will handle that part.


Please make sure to respect Koishi Komeiji in your PRs.

[![Koishi](https://cdn.discordapp.com/emojis/741004530212274234.webp?&animated=true&lossless=true)](https://touhou.fandom.com/wiki/Koishi_Komeiji)