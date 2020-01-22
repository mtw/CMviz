from .InfernalUtils3 import CmsearchOut
import json
import pandas as pd


def fancy_cmout_to_json(ipath, opath):
    """Get .json from .fancy.cmout"""

    # ipath = f"example/{ifile}"
    # ofile = ifile.replace(".fancy.cmout", ".json")
    # opath = f"output/{ofile}"

    attrs = (
        "rank",
        "inc",
        "evalue",
        "bitscore",
        "bias",
        "mdl",
        "cm_start",
        "cm_end",
        "mdl_alntype",
        "seq_start",
        "seq_end",
        "strand",
        "seq_alntype",
        "acc",
        "gc",
        "trunc",
        "seq",
        "cm",
        "alignment",
        "uid",
    )

    results = CmsearchOut(ipath)
    L = [{k: getattr(hit, k) for k in attrs} for hit in results.hits]
    for d in L:
        d['alignment'] = str(d['alignment'])

    with open(opath, "w", encoding="utf8") as f:
        json.dump(L, f, indent=4)


def visualize_cmhits(ifile):
    ipath = f"output/{ifile}"

    with open(ipath, "r", encoding="utf8") as f:
        j = json.load(f)

    # print(j)


def genomes_tab_to_csv(ifile, ofile):
    with open(ifile, "r") as f:
        records = [line.strip().split("\t") for line in f.readlines()]
        df = pd.DataFrame.from_records(records)
        df.to_csv(ofile, sep=",", index=False, header=False)
