from .InfernalUtils3 import CmsearchOut
import json


def fancy_cmout_to_json(ifile):
    """Get .json from .fancy.cmout"""

    ipath = f"example/{ifile}"
    ofile = ifile.replace(".fancy.cmout", ".json")
    opath = f"output/{ofile}"

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
        # 'alignment',
        "uid",
    )

    results = CmsearchOut(ipath)
    # L = {hit.rank: {k: getattr(hit, k) for k in attrs} for hit in results.hits}
    L = [{k: getattr(hit, k) for k in attrs} for hit in results.hits]

    with open(opath, "w", encoding="utf8") as f:
        json.dump(L, f, indent=4)


def visualize_cmhits(ifile):
    ipath = f"output/{ifile}"

    with open(ipath, "r", encoding="utf8") as f:
        j = json.load(f)

    # print(j)

