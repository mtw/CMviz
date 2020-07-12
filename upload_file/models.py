# written by Matthias Schmal
# classes and functions to parse input files and save them on the filesystem


from .transformers.InfernalUtils3 import CmsearchOut
import random
import string
import csv
import os
import pandas as pd

from django.conf import settings

# path to folder containing uploaded files
WORKING_DIR = os.path.join(settings.BASE_DIR, "uploads") + "/"


def generate_random_string(x=16):
    """Generate a random string of 16 characters consisting of letters and digits"""
    return "".join(
        [random.choice(string.ascii_letters + string.digits) for n in range(x)]
    )


def cmout_to_csv(ipath, opath, ident):
    """Extract relevant information of INFERNAL-tool output into a csv-file"""

    # definition of relevant information attributes
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

    # load cmout file into CmsearchOut class
    results = CmsearchOut(ipath)

    # put all data cooresponding to a hit into a list and every of those lists into another list
    rows = [[getattr(hit, attr) for attr in attrs] for hit in results.hits]

    # append an additional attribute "ident" to the end of each hit, to trace,  from which file which hit stems from
    attrs.append("identity")

    # write each hit into a comma separated row
    for row in rows:
        row.append(str(ident))

    # write data
    with open(opath, "a+", encoding="utf8") as file:
        writer = csv.writer(file)
        if ident == 0:
            writer.writerow(attrs)
        writer.writerows(rows)


def save_cmout(files, identifier):
    """
    Merges multiple INFERNAL output files into one .csv file.
    The .csv file is named with the unique identifier to access the file later on.
    """
    i = 0
    for file in files:
        with open(WORKING_DIR + file._name, "wb+") as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        cmout_to_csv(WORKING_DIR + file._name, WORKING_DIR + identifier + ".csv", i)
        i += 1
        os.remove(WORKING_DIR + file._name)
    return


def save_lengths(files, identifier):
    """Save file containing the information of the length of the sequences.
    This file gets the same unique identifier as the corresponding .csv file.
    """
    for file in files:
        with open(WORKING_DIR + file._name, "wb+") as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        os.rename(WORKING_DIR + file._name, WORKING_DIR + identifier + ".genomes")
    return
