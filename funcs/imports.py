import sys

paths_RNA = (
    r'M:\uniW19\UE software dev\ViennaRNA-2.4.14\interfaces\Python3', # Win
    r'/mnt/m/uniW19/UE software dev/ViennaRNA-2.4.14/interfaces/Python3', # Linux
)
for path_RNA in paths_RNA:
    sys.path.append(path_RNA)

import RNA