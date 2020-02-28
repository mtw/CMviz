# written by Matthias Schmal
# classes and functions to parse input files and save them on the filesystem


from .transformers.InfernalUtils3 import CmsearchOut
import random
import string
import csv
import os
import pandas as pd

# global variable to specify working directory, specifically where files are
# stored

WORKING_DIR = "/media/"
# WORKING_DIR = "viz/static/media/"


def generate_random_string(x=16):
    return "".join(
        [random.choice(string.ascii_letters + string.digits) for n in range(x)]
    )


def cmout_to_csv(ipath, opath, ident):
    attrs = [
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
    ]
    results = CmsearchOut(ipath)
    rows = [[getattr(hit, attr) for attr in attrs] for hit in results.hits]
    attrs.append("identity")
    for row in rows:
        row.append(str(ident))
    with open(opath, "a+", encoding="utf8") as file:
        writer = csv.writer(file)
        writer.writerow(attrs)
        writer.writerows(rows)


def save_cmout(files, identifier):
    i = 0
    for file in files:
        with open(WORKING_DIR + file._name, "wb+") as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        cmout_to_csv(WORKING_DIR + file._name, WORKING_DIR + identifier + ".csv", i)
        i += 1
        os.remove(WORKING_DIR + file._name)
    return


# def save_genomes(files, identifier):
#     for file in files:
#         with open(WORKING_DIR + file._name, "wb+") as destination:
#             for chunk in file.chunks():
#                 destination.write(chunk)
#         with open(WORKING_DIR + file._name, "r") as destination:
#             records = [line.strip().split("\t") for line in destination.readlines()]
#             df = pd.DataFrame.from_records(records)
#             df_tmp = pd.DataFrame([["0", "1"]], columns=[0, 1])
#             df = df_tmp.append(df[[0, 7]].rename({7: 1}, axis=1))
#             df.to_csv(
#                 WORKING_DIR + identifier + ".genomes",
#                 sep=",",
#                 index=False,
#                 header=False,
#             )
#         os.remove(WORKING_DIR + file._name)
#     return


def save_lengths(files, identifier):
    for file in files:
        with open(WORKING_DIR + file._name, "wb+") as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        os.rename(WORKING_DIR + file._name, WORKING_DIR + identifier + ".genomes")
    return
