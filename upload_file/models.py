# written by Matthias Schmal
# classes and functions to parse input files and save them on the filesystem


from .transformers.InfernalUtils3 import CmsearchOut
import random
import string
import csv
import os
import pandas as pd

from django.conf import settings

# global variable to specify working directory, specifically where files are
# stored

WORKING_DIR = os.path.join(settings.BASE_DIR, "uploads") + '/'  # file serving


# Generate a random string of 16 characters consisting of letters and digits

def generate_random_string(x=16):
    return "".join(
        [random.choice(string.ascii_letters + string.digits) for n in range(x)]
    )

# Extracts relevant information of INFERNAL-tool output into a csv-file

def cmout_to_csv(ipath, opath, ident):
    # Definition of relevant information attributes
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
    # put all data cooresponding to a hit into a list and every of those lists
    # into another list
    rows = [[getattr(hit, attr) for attr in attrs] for hit in results.hits]
    attrs.append("identity")
    # append an additional attribute "ident" to the end of each hit, to trace,
    # from which file which hit stems from
    for row in rows:
        row.append(str(ident))
    # write each hit into a comma separated row
    with open(opath, "a+", encoding="utf8") as file:
        writer = csv.writer(file)
        if ident == 0:
            writer.writerow(attrs)
        writer.writerows(rows)


# This function is used to merge multiple INFERNAL output files into 1 csv file
# Additionally the csv file is named with the unique identifier to access the
# file later on
def save_cmout(files, identifier):
    i = 0
    for file in files:
        with open(WORKING_DIR + file._name, "wb+") as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        cmout_to_csv(WORKING_DIR + file._name,
                     WORKING_DIR + identifier + ".csv", i)
        i += 1
        os.remove(WORKING_DIR + file._name)
    return


# This function is used to save the file, containing the information of the
# length of the sequences. Additionally this file gets the same unique
# identifer as the corresponding csv-file
def save_lengths(files, identifier):
    for file in files:
        with open(WORKING_DIR + file._name, "wb+") as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        os.rename(WORKING_DIR + file._name,
                  WORKING_DIR + identifier + ".genomes")
    return
