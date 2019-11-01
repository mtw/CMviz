from .InfernalUtils3 import CmsearchOut
import json


def fancy_cmout_to_json(ifile, ofile):
    """Get .json from .fancy.cmout"""

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

    results = CmsearchOut(ifile)

    L = {hit.rank: {k: getattr(hit, k) for k in attrs} for hit in results.hits}

    with open(ofile, "w", encoding="utf-8") as f:
        json.dump(L, f, ensure_ascii=False, indent=4)

    print("getting json finished")


