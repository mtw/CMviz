import csv
from InfernalUtils3 import CmsearchOut
import json
import pandas as pd
import os

attrs = (
    # "rank",
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


# def fancy_cmout_to_json(ipath, opath, file_type='json'):
#     """Get .json from .fancy.cmout"""

#     results = CmsearchOut(ipath)
#     L = [{k: getattr(hit, k) for k in attrs} for hit in results.hits]
#     for d in L:
#         d['alignment'] = str(d['alignment'])

#     file = open(opath, 'w', encoding='utf8')

#     if file_type == 'json':
#         json.dump(L, file, indent=4)

#     if file_type == 'csv':
#         writer = csv.writer(file)
#         writer.writerow(attrs)
#         for line in L:
#             writer.writerow([line[attr] for attr in attrs])

#     file.close()

def transform_cmouts(idir, odir, file_type):

    f = {
        'csv': cmout_to_csv,
        'json': cmout_to_json,
    }[file_type]

    filenames = os.listdir(idir)

    for filename in filenames:
        if filename.endswith('.cmout'):

            new_filename = filename[:-6] + '.' + file_type

            ipath = os.path.join(idir, filename)
            opath = os.path.join(odir, new_filename)
            f(ipath, opath)


def cmout_to_csv(ipath, opath):
    results = CmsearchOut(ipath)

    rows = [[getattr(hit, attr) for attr in attrs] for hit in results.hits]

    with open(opath, 'w', encoding='utf8') as file:

        writer = csv.writer(file)
        writer.writerow(attrs)
        writer.writerows(rows)


def cmout_to_json(ipath, opath):

    results = CmsearchOut(ipath)

    dicts = [{k: getattr(hit, k) for k in attrs} for hit in results.hits]

    for d in dicts:
        d['alignment'] = str(d['alignment'])

    with open(opath, 'w', encoding='utf8') as file:
        json.dump(dicts, file, indent=4)


def visualize_cmhits(ifile):
    ipath = f"output/{ifile}"

    with open(ipath, "r", encoding="utf8") as f:
        j = json.load(f)

    # print(j)


def genomes_tab_to_csv(ifile, ofile):
    with open(ifile, "r") as f:
        records = []
        for line in f.readlines():
            data = line.strip().split('\t')
            records.append([data[0], data[9]])

        df = pd.DataFrame.from_records(records)
        df.to_csv(ofile, sep=",", index=False)
