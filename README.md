# cmviz
Cmviz is an interactive online tool for visualization of the covariance model hits.

## Prerequisites
- .cmout file(s) produced by [Infernal](http://eddylab.org/infernal/)
- a custom .csv file with a header (_seqId_, _lenght_) and two columns containing:
    1. sequence id's of sequences that hits occur in
    2. lengths of those sequences

## Built with
- [Django](https://www.djangoproject.com/) 3.0.3 - Python web framework
- [D3.js](https://d3js.org/) v5 - JavaScript library for dynamic data visualization
