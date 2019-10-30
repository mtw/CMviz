import InfernalUtils3

import json

# from collections import defaultdict


# CmsearchOut.hits[ CmsearchHit, CmsearchHit, CmsearchHit, ...]

# Userguide.pdf page 60
# CmsearchHit attributes
attrs = (
    'rank',
    'inc',
    'evalue',
    'bitscore',
    'bias',
    'mdl',
    'cm_start',
    'cm_end',
    'mdl_alntype',
    'seq_start',
    'seq_end',
    'strand',
    'seq_alntype',
    'acc',
    'gc',
    'trunc',
    'seq',
    'cm',
    # 'alignment',
    'uid',
)

def get_json(ifile,ofile):
    '''Get .json from .fancy.cmout'''
    results = InfernalUtils3.CmsearchOut(filename)

    L = {
        hit.rank:    
        {k:getattr(hit,k) for k in attrs}
        for hit in results.hits
    }
    # print(L)
    with open(ofile, 'w', encoding='utf-8') as f:
        json.dump(L, f, ensure_ascii=False, indent=4)


filename = 'all_dISFVG.DB__all_dISFVG_3UTR.20190905.fancy.cmout'
get_json(filename,'test.json')
