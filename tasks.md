<!-- ## Instructions :bird:
- run localhost `python3 -m http.server`
- http://localhost:8000/web/index.html -->

# Tasks
- [ ] what to do with line lenghts?
- [ ] 3! cookies, uploading files, redirecting to viz
- [ ] wiki documentation, tutorial
- [ ] add README.md
- [ ] add dependencies in documentation
- [ ] make favicon
- [ ] make logo
- [ ] extract svg: global and local
- [ ] compressed layout
- [ ] friday screenshot abstract paper
- [ ] update genomes.csv to include the prefix for sequences

## questions
- [x] include *[] in FASTA output? NO
- [ ] check in Infernal if the trunc notation always starts with *[

## frontend
- [ ] upper case for fasta download
- [ ] add dimming cursor
- [ ] add clicking mode (selection, dimming, help)
- [ ] add opacity control to sausages
- [ ] restyle sausages
- [ ] add help tooltip
- [ ] add bottom shadow when scrolling possible
- [ ] hoverCircle evalue positioning is incorrect!

## frontend - consider
- [ ] collapsing
- [ ] control sausage link count
- [ ] length selection slider
- [ ] how to correctly regulate visibility of toolbar
- [ ] add alignment to clipboard
- [ ] knobbed slider
- [ ] add buttons to configure visualization style
- [ ] add show/hide diminished
- [ ] consider sorting the sequence groups by a criterion

## backend
- [ ] Apache web servers
- [ ] dont save intermediate file, only the final csv
- [ ] enable choosing files

## backend
- [ ] upload multiple files (https://docs.djangoproject.com/en/3.0/topics/http/file-uploads/)
- [ ] genomes.tab sanity check length 10k

# presentation
- cmout issue, motivation
- demonstration
- uml diagrams of feature logic
- github repo screenshot
- publication abstract screenshot

# Notes
- `InfernalUtils3.py`, `RNAUtils3.py` are Python3 compatible
- `imports.py` puts Vienna RNA package on path if not already on path
- attributes for CmsearchHit in Userguide.pdf page 60
- CmsearchOut.hits is a list of CmsearchHit instances

<!-- ## Data flow :ocean:
- [x] fancy.cmout -> json | `funcs.fancy_cmout_to_json`
- [x] json -> main.js
- [x] genomes -> main.js -->

<!-- ## User flow :raising_hand:
- user uploads multiple cmsearch files
- script that merges cmsearch files (get UTR, CDS lengths from tab file)
- turn to json
- json to d3 svg -->

## presentation
- ensure readability | font size 18px
- when presenting software compare with alternatives
- give use cases


## data types from cmout
### discrete
- inc | true or false
- mdl | cm or hmm
- strand | + or -
- mdl_alntype
- seq_alntype
- trunc | 5' or 3' or 5'3'

### continuous
- evalue
- bitscore
- bias
- cm_start
- cm_end
- seq_start
- seq_end
- acc
- gc

### identifiers
- rank
- seq
- cm

### other
- alignment