## Instructions :bird:
- run localhost via `python3 -m http.server`, then goto http://localhost:8000/web/index.html
- open http://localhost:8000/web/index.html in browser

## Tasks :wrench:
- [ ] update headers of genomes.csv
- [ ] can upload (multiple) CM search output file
- [x] take strand orientation in account (+ above, - below)
- [x] thin black line, align left
- [ ] tooltip: monospace,
- [x] be able to select hits
- [ ] add overview of cm's which are clickable (so that all hits of that cm are displayed in the graphic)
- [ ] output: identifier + sequence hit
- [x] control menu on the left: scrollbar for evalues, bitscores, 
- [ ] upload meme output, poster with graphic for presentation, additional cmout
- [ ] extend draggable region

## Notes :scroll:
- `InfernalUtils3.py`, `RNAUtils3.py` are Python3 compatible
- `imports.py` puts Vienna RNA package on path if not already on path
- attributes for CmsearchHit in Userguide.pdf page 60
- CmsearchOut.hits is a list of CmsearchHit instances

## Data flow :ocean:
- [x] fancy.cmout -> json | `funcs.fancy_cmout_to_json`
- [x] json -> main.js
- [x] genomes -> main.js

## User flow :raising_hand:
- user uploads multiple cmsearch files
- script that merges cmsearch files (get UTR, CDS lengths from tab file)
- turn to json
- json to d3 svg