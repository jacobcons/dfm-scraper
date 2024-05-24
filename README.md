# dfm-scraper
This web scraper, built with Playwright, automates the traversal and downloading of resources from [drfrost.org](https://www.drfrost.org/courses.php?sid=2596). I developed this tool to assist a student I tutor in mathematics, who requested access to all files under the Year 10 and 11 sections.

## Getting started

1. `npm i` - install npm packages
2. `node index.js` - download year 11 files to a downloads folder
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
