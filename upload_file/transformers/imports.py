import sys
import os



paths_RNA = (
    r'M:\projects-active\uniW19\ue-software-dev-backup\ViennaRNA-2.4.14\interfaces\Python3', # Win
    r'/mnt/m/projects-active/uniW19/ue-software-dev-backup/ViennaRNA-2.4.14/interfaces/Python3', # Linux
)



for path_RNA in paths_RNA:
    sys.path.append(path_RNA)

import RNA