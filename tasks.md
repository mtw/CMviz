<!-- ## Instructions :bird:
- run localhost `python3 -m http.server`
- http://localhost:8000/web/index.html -->

# Tasks
- [ ] what to do with line lenghts?
- [ ] fix RNA import
- [ ] 1! cmout to json
- [ ] 3! cookies, uploading files, redirecting to viz
- [ ] wiki documentation, tutorial
- [ ] stress test!
- [ ] add README.md
- [ ] make favicon
- [ ] make logo

## questions
- [ ] include *[] in FASTA output?

## frontend
- [x] slider exponential change for evalue
- [x] fix selection of UTRs (numbers change)
- [x] evalue and bitscore make limits depend on max and min of the data
- [x] re-layout for sliders
- [x] add + -
- [x] FASTA, penultimate line (remove gaps), identifier, position (separator |)
- [x] style viz buttons on hover
- [x] redesign slider
- [ ] make dragging utr independent

## frontend - landing page
- [ ] dependencies, dummy example, mini tutorial

### frontend - consider
- [ ] compressed layout
- [ ] length selection slider
- [ ] how to correctly regulate visibility of toolbar
- [ ] add alignment to clipboard
- [ ] using scales instead of xtovalue functions
- [ ] knobbed slider
- [ ] use gradients for rect fill
- [ ] continuous sliders on both sides
- [ ] add buttons to configure visualization style
- [ ] add show/hide diminished


## backend
- [ ] upload multiple files (https://docs.djangoproject.com/en/3.0/topics/http/file-uploads/)
- [ ] genomes.tab sanity check length 10k

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