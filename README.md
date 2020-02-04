## Instructions :bird:
- run localhost `python3 -m http.server`
- http://localhost:8000/web/index.html

## Tasks
- [ ] consider creating Tooltip using HTML and CSS
- [ ] consider making a general slider making function
- [ ] consider deleting infopanel data upon mouseout
- [ ] what to do with line lenghts?
- [ ] re-layout for sliders
- [ ] add alignment to clipboard
- [ ] evalue and bitscore make limits depend on max and min of the data
- [ ] fix RNA import

## Tasks(old) :wrench:
- [ ] update headers of genomes.csv
- [ ] can upload (multiple) CM search output file
- [x] take strand orientation in account (+ above, - below)
- [ ] thin black line, align left
- [ ] tooltip: monospace,
- [ ] be able to select hits
- [ ] add overview of cm's which are clickable (so that all hits of that cm are displayed in the graphic)
- [ ] output: identifier + sequence hit
- [ ] control menu on the left: scrollbar for evalues, bitscores, 
- [ ] upload meme output, poster with graphic for presentation, additional cmout

## Notes :scroll:
- `InfernalUtils3.py`, `RNAUtils3.py` are Python3 compatible
- `imports.py` puts Vienna RNA package on path if not already on path
- attributes for CmsearchHit in Userguide.pdf page 60
- CmsearchOut.hits is a list of CmsearchHit instances

<!-- ## Data flow :ocean:
- [x] fancy.cmout -> json | `funcs.fancy_cmout_to_json`
- [x] json -> main.js
- [x] genomes -> main.js -->

## User flow :raising_hand:
- user uploads multiple cmsearch files
- script that merges cmsearch files (get UTR, CDS lengths from tab file)
- turn to json
- json to d3 svg

## Presentation notes
- ensure readability | font size 18px
- when presenting software compare with alternatives
- give use cases