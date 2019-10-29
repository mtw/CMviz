# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

__author__ = "romanoch"
__date__ = "$Oct 11, 2016 4:34:16 PM$"

import RNA, math
import sys

if __name__ == "__main__":
    print "Not meant as executable!"
    sys.exit()

#Set model details
md = RNA.md()
md.dangles = 2
md.noLonelyPairs = 0
md.temperature = 37.0


def ProbMFE(seq):
    fc = RNA.fold_compound(seq, md)
    mfe_str, mfe_en = fc.mfe()
    pf_str, pf_en = fc.pf()

    prob = Z_from_G(mfe_en - pf_en)
    return prob

def ProbStruc(seq, struc):
    fc = RNA.fold_compound(seq, md)
    struc_en = fc.eval_structure(struc)
    pf_str, pf_en = fc.pf()

    prob = Z_from_G(struc_en - pf_en)
    return prob

def ProbSubstruc(seq, constr_struc):
    fc = RNA.fold_compound(seq, md)
    pf_unc_str, pf_unc_en = fc.pf()

    fc.hc_add_from_db(constr_struc, RNA.CONSTRAINT_DB_DEFAULT | RNA.CONSTRAINT_DB_ENFORCE_BP)
    pf_const_str, pf_const_en = fc.pf()

    prob = Z_from_G(pf_const_en - pf_unc_en)
    return prob

def G_from_Z(Z):
    return - ((37.0 + 273.15)*1.98717)/1000.0 * math.log(Z)

def Z_from_G(G):
    return math.exp(- (G/ (((37.0 + 273.15)*1.98717)/1000.0)))


def SCI_CmHit(hit):
    '''Calculate SCI for instance of CmHit'''
    fc1 = RNA.fold_compound(hit.alignment.raw_seqs[0])
    fc2 = RNA.fold_compound(hit.alignment.raw_seqs[1])
    fc3 = RNA.fold_compound(hit.alignment.aln_seqs)
    try:
        return fc3.mfe()[1]/((fc1.mfe()[1]+fc2.mfe()[1])/2)
    except ZeroDivisionError:
        return 0

def SCI_nocov_CmHit(hit):
    '''Calculate SCI without Covariation Energy,for instance of CmHit'''
    fc1 = RNA.fold_compound(hit.alignment.raw_seqs[0])
    fc2 = RNA.fold_compound(hit.alignment.raw_seqs[1])
    fc_aln = RNA.fold_compound(hit.alignment.aln_seqs)

    ss_cons, e_cons = fc_aln.mfe() #Alifold consensus structure/energy
    e_nocovar = fc_aln.eval_structure(ss_cons) #Alifold consensus structure without covariance contribution
    #e_covar = fc_aln.eval_covar_structure(ss_cons) #Covariance contribution in kcal/mol (positive or negative possible?)
    try:
        return e_nocovar/((fc1.mfe()[1]+fc2.mfe()[1])/2)
    except ZeroDivisionError:
        return 0

def SCI_constrained_CmHit(hit, ss):
    '''Calculate SCI with hard-constraints'''
    raise NotImplementedError
    fc1 = RNA.fold_compound(hit.alignment.raw_seqs[0])
    fc2 = RNA.fold_compound(hit.alignment.raw_seqs[1])
    fc3 = RNA.fold_compound(hit.alignment.aln_seqs)

    ss_cons, e_cons = fc3.mfe()
    e_covar = fc3.eval_covar_structure(ss_cons)
    return (e_cons + e_covar)/((fc1.mfe()[1]+fc2.mfe()[1])/2)

def SCI(seq1,seq2,aln):
    '''SCI for 2 sequences'''
    fc1 = RNA.fold_compound(seq1)
    fc2 = RNA.fold_compound(seq2)
    fc3 = RNA.fold_compound(aln)
    try:
        return fc3.mfe()[1]/((fc1.mfe()[1]+fc2.mfe()[1])/2)
    except ZeroDivisionError:
        return 0


def RemoveNoncanonical(seq, ss):
    basepairs = [('A','U'),('U','A'), ('G','U'),('U','G'), ('G','C'),('C','G')]

    ss_list = ParseSS(ss) #list of basepairs
    ss_clean = list(ss) #copy (to be sure)
    for i,j in ss_list:
        if (seq[i],seq[j]) not in basepairs:
            ss_clean[i] = '.'
            ss_clean[j] = '.'
        else:
            pass
    return ''.join(ss_clean)



def ParseSS(ss):
    """
    Parses a secondary structure denoted by a well parenthesized expression.
    Args:
        ss (string): Vienna-formatted secondary structure.
    Returns:
        list: Set of base-pairs in secondary structures.
    """
    p = []
    res = []
    for i,c in enumerate(ss):
        if c == "(":
            p.append(i)
        elif  c == ")":
            try:
                j = p.pop()
                res.append((j,i))
            except IndexError as ERR:
                print ss
                raise ERR

    if len(p) != 0:
        raise ValueError('Unbalanced brackets found')
    return set(res)

def ParseSSunbalanced(ss):
    """Parse a secondary structure denoted by dotbracket-notation.
    Args:
        ss (string): dot-bracket ss structure.
    Returns:
        list: Set of unbalanced base-pairs in secondary structure.
    """
    p = []
    res = []
    unbal = []

    for i,c in enumerate(ss):
        if c == "(":
            p.append(i)
        elif  c == ")":
            try:
                j = p.pop()
                res.append((j,i))
            except IndexError:
                unbal.append(i)

    if len(p) != 0: #'Leftover' residues
        for i in p:
            unbal.append(i)

    return set(unbal)

def Db2pair(ss):
    '''DotBracket-string to pair-table'''
    p = []
    res = []
    for i,c in enumerate(ss):
        if c == "(":
            p.append(i)
        elif  c == ")":
            try:
                j = p.pop()
                res.append((j,i))
            except IndexError as ERR:
                print ss
                raise ERR

    if len(p) != 0:
        raise ValueError('Unbalanced brackets found')

    #Fill Pair Table
    pair_table = [-1] * len(ss)
    for bp in res:
        if bp[0] > bp[1]:
            raise ValueError
        else:
            pair_table[bp[0]] = bp[1]
            pair_table[bp[1]] = bp[0]

    return pair_table

def Pair2db(pair_table):
    '''Pair Table to DotBracket string'''
    db = ['.'] * len(pair_table)
    for i,j in enumerate(pair_table):
        if i > j:
            continue
        else:
            db[i] = '('
            db[j] = ')'
    return db

##Stefans Code
#md = RNA.md()
#md.dangles = 2
#md.noLonelyPairs = 0
#md.temperature = 24.0
#
#fc = RNA.fold_compound(seq, md)
#
##probability of a certain full structure:
#energy = fc.eval_structure(structure)
#Probability = Z_from_G(EnergyOfStruct - PartitionFunctionEnergy)
#
##probability of a substructure:
#fc = RNA.fold_compound(seq, md)
#fc.hc_add_from_db(constr_struct)
#struct, energy = bfc.pf()
#
#Probability = Z_from_G(ConstraintFoldPartitionFunction - PartitionFunctionEnergy)
#
#def G_from_Z(Z):
#    return - ((37.0 + 273.15)*1.98717)/1000.0 * math.log(Z)
#
#def Z_from_G(G):
#    return math.exp(- (G/ (((37.0 + 273.15)*1.98717)/1000.0)))


#fc.hc_add_from_db(remove_cuts(constraint), RNA.CONSTRAINT_DB_DEFAULT | RNA.CONSTRAINT_DB_ENFORCE_BP)
