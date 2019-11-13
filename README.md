## Instructions

- run localhost via `python3 -m http.server`
- open http://localhost:8000/viz/index.html in browser

## Tasks
- [ ] update headers of genomes.csv


## Notes 
### :scroll: Code
-  `InfernalUtils3.py`, `RNAUtils3.py` are Python3 compatible
- `imports.py` puts Vienna RNA package on path if not already on path

### :package: Class structure
- attributes for CmsearchHit in Userguide.pdf page 60
- CmsearchOut.hits is a list of CmsearchHit instances

<!-- ### :floppy_disk: Files / File types
- .fancy.cmout
- Flavivirus_ALL_20190905.full.gb.genomes.tab -->

<!-- ### :deciduous_tree: Biology
-  -->

### Flow
- user uploads multiple cmsearch files
- script that merges cmsearch files (get UTR, CDS lengths from tab file)
- turn to json
- json to d3 svg

### Viz functionality
- lines (longest line determines scale, from tab file)
- "cm" attr determines color (none, 2, 3 -> shades)
- alignment on hover
- mark on selection
- rearranging seqs
- seq identifier on the left