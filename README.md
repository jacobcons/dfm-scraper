# dfm-scraper

## What is this?

Web scraper I made, using playwright, to traverse and download resources from [drfrost.org](https://www.drfrost.org/courses.php?sid=2596) for a student that I tutor in maths after he requested I send him all files under the year 10 and 11 sections

## Usage

Just run `node index.js` without any args to download year 11 files to a downloads folder

```bash
Usage: index.js [-u url] [-d directory]

Options:
--help Show help [boolean]
--version Show version number [boolean]
-u, --url URL of the year to download files from
[string] [default: "https://www.drfrost.org/courses.php?coid=196"]
-d, --directory Directory to save downloads to
[string] [default: "./downloads"]
```
