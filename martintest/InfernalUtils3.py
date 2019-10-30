__author__ = "romanoch"
__date__ = "$Nov 27, 2015 5:30:51 PM$"

import re
from RNAUtils3 import ParseSS, Db2pair, Pair2db, ParseSSunbalanced, RemoveNoncanonical
from math import log10

class CmsearchHit:
    '''Data Container Class for Output of INFERNAL's Cmsearch/Cmscan'''
    def __init__(self, **kwargs):
        self.rank           = None
        self.inc            = None
        self.evalue         = None
        self.bitscore       = None
        self.bias           = None
        self.mdl            = None #cm/hmm
        self.cm_start       = None #1-indexed
        self.cm_end         = None
        self.mdl_alntype    = None #../[]/.] etc.
        self.seq_start      = None
        self.seq_end        = None
        self.strand         = None # minus means reverse complement btw
        self.seq_alntype   = None
        self.acc        = None
        self.gc         = None
        self.trunc      = None
        self.seq        = None #accession of sequence that was searched
        self.cm         = None #cm name
        self.alignment  = None #CmAln object
        self.uid        = None

        #Insert kwargs
        for arg in kwargs:
            if arg not in self.__dict__:
                raise ValueError('Unknown Arg: ' + str(arg))
            else:
                self.__dict__[arg] = kwargs[arg]

    def __repr__(self):
        return '\t'.join([self.cm, self.seq, str(self.seq_start), str(self.seq_end), str(self.evalue)])

    def as_bed(self):
        bed = []
        bed.append(self.seq)
        bed.append(str(self.seq_start-1))
        bed.append(str(self.seq_end))
        bed.append(self.cm)
        bed.append(str(int(-1*log10(self.evalue))))
        bed.append(self.strand)
        # return bed
        return '\t'.join(bed)

    def as_bed_unique(self):
        bed = []
        bed.append(self.seq)
        bed.append(str(self.seq_start-1))
        bed.append(str(self.seq_end))
        bed.append(self.uid)
        bed.append(str(int(-1*log10(self.evalue))))
        bed.append(self.strand)
        # return bed
        return '\t'.join(bed)

    def validate(self):
        '''Check object for unassigned attributes'''
        for attr in self.__dict__.keys():
            if self.__dict__[attr] is None:
                raise ValueError('Attribute not set: ' + str(attr))
        return True

class CmAln:
    '''Class for storing & querying a seq/cm alignment'''

    def __init__(self, nc, cs, cm_cols, query_cols, score, pp, coor_cm, coor_query):
        '''Ugly init'''
        self.nc_cols = nc
        self.cs_cols = cs
        self.cm_cols = cm_cols
        self.query_cols = query_cols
        self.score_cols = score
        self.pp_cols = pp
        self.cm_coord = coor_cm         #cm-coordinates
        self.query_coord = coor_query   #genomic coordinates
        #Extract insertions
        self.insertions = self._FindLocalEnds()
        #Sequences w/o local end insertions/deletions
        self.aln_seqs = self._GetAlnSeqs() # tuple(cm_cols, seq_cols)
        self.raw_seqs = self._GetRawSeqs() # tuple(cm_cols, seq_cols)
        #Consensus structure
        self.ss_clean = self._GetConsensusClean() #w/o unbalanced/noncanonical
        #Misc Parameters
        self.cm_coverage = len(self.raw_seqs[0]) / float((self.cm_coord[1] - self.cm_coord[0]) +1)
        self.query_coverage = len(self.raw_seqs[0]) / float((self.query_coord[1] - self.query_coord[0]) +1)
        self.comp_muts = (self.score_cols.count(':') / 2)

    def __getitem__(self, index):
        '''Future method for accessing aln columns'''
        raise NotImplementedError

    def __repr__(self):
        as_string = '\n'.join([self.nc_cols, self.cs_cols, self.cm_cols, self.score_cols, self.query_cols, self.pp_cols])
        return as_string

    def __len__(self):
        '''Get Alignment length without local end insertions/deletions
        Returns positions of inserts in string + length'''
        return len(self.aln_seqs[0])

    def _FindLocalEnds(self):
        '''Parse Local Ends from Cm/Query alignment
        Returns: List of tuples, one tuple for each LE
            structure: (start index, end index, length in cm, length in query)
            e.g. (50,56,5,7) means that a local end was parsed at string
            positions 50-56, which has the size of 5 in the CM and 7 in the query
            sequence.
        '''
        rgx = r'\*\[\s*(\d+)\]\*'
        rgx_5p = r'^\<\[\s*(\d+)\]\*' #5' end alignment
        rgx_3p = r'\*\[\s*(\d+)\]\>$' #3' end alignment
        inserts = []

        cm_indels = []
        for match in re.finditer(rgx, self.cm_cols):
            cm_indels.append((match.start(), match.end(), match.group(1)))

        query_indels = []
        for match in re.finditer(rgx, self.query_cols):
            query_indels.append((match.start(), match.end(), match.group(1)))

        #5'/3' end indels (cm)
        match = re.match(rgx_5p, self.cm_cols)
        if match:
            cm_indels.append((match.start(), match.end(), int(match.group(1))))
        match = re.match(rgx_3p, self.cm_cols)
        if match:
            cm_indels.append((match.start(), match.end(), int(match.group(1))))
        #5'/3' end indels (query)
        match = re.match(rgx_5p, self.query_cols)
        if match:
            query_indels.append((match.start(), match.end(), int(match.group(1))))
        match = re.match(rgx_3p, self.query_cols)
        if match:
            query_indels.append((match.start(), match.end(), int(match.group(1))))

        if len(cm_indels) != len(query_indels):
            raise ValueError('Unequal number of indels!', cm_cols, query_cols)

        for cm, query in zip(cm_indels, query_indels):
            if cm[0] != query[0]:
                raise ValueError('Indel positions not overlapping in aln!')
            elif cm[1] != query[1]:
                raise ValueError('Indel positions not overlapping in aln!')
            else:
                inserts.append((cm[0], cm[1], int(cm[2]), int(query[2])))
        return inserts

    def _GetAlnSeqs(self):
        '''Get pairwise alignment without any special annotations - Replace
        local ends, swap CM gap characters (.) with dashes (-), convert all
        lower case residues to upper case
        '''
        rgx = r'[\<\*]\[\s*\d+\][\>\*]' #Matches local ends
        cm_cols = re.sub(rgx, '', self.cm_cols)
        seq_cols = re.sub(rgx, '', self.query_cols)
        cm_cols = cm_cols.replace('.', '-') # Gaps in CM are indicated with '.'
        return (cm_cols.upper(), seq_cols.upper())

    def _GetRawSeqs(self):
        '''Get sequences without insertions, gaps and in upper case'''
        cm_seq = re.sub(r'[^A-Z]', '', self.aln_seqs[0].upper())
        query_seq = re.sub(r'[^A-Z]', '', self.aln_seqs[1].upper())
        return (cm_seq, query_seq)

    def _GetConsensusClean(self):
        '''Consensus Structures for CM/Query sequences,
            without basepairs where no partner is known (cm/query),
            without other unbalanced brackets (cm/query), and without
            non-canonical basepairs (query only).
            NC basepairs are either annotated ('v') or found by this function
        Returns:
            tuple:
                ss_clean: consensus structure as modeled by the cm, with unbalanced
                    brackets removed from the string (caused by truncated hits)

                query_no_nc: consensus structure modeled by the CM, mapped on the
                    query sequence. In order to achieve a valid (e.g. RNAfold-constraint-foldable)
                    sequence-structure pair is returned where the following is
                    removed: (i) unbalanced brackets, (ii) non-canonical base pairs.
            IMPORTANT: In both cases local ends remain as pseudo-unpaired patches
                    ('~') in the string!
        '''
        ss_clean = list(self.cs_cols)
        ss_no_noncan = list(self.cs_cols)

        if len(self.nc_cols) != len(self.cs_cols):
            raise ValueError('NC cols != CS cols')

        for i in range(len(self.nc_cols)):
            if self.nc_cols[i] == '?':
                ss_clean[i] = '.'
                ss_no_noncan[i] = '.'
            elif self.nc_cols[i] == 'v':
                ss_no_noncan[i] = '.'
        tmp_cm = WussToVienna(''.join(ss_clean))
        unbalanced_cm = ParseSSunbalanced(tmp_cm)
        tmp_query = WussToVienna(''.join(ss_no_noncan))
        unbalanced_query = ParseSSunbalanced(tmp_query)

        for i in unbalanced_cm:
            ss_clean[i] = '.'
        for i in unbalanced_query:
            ss_no_noncan[i] = '.'

        tmp_db = WussToVienna(''.join(ss_no_noncan))
        #Remove NC basepairs from query that were not annotated by Infernal..
        query_no_nc = RemoveNoncanonical(self.query_cols, tmp_db)
        # cm_no_nc = RemoveNoncanonical(''.join(ss_clean), self.alignment.aln_seqs[0])
        #Convert into dot-bracket notation (~ remains nevertheless since its no base but missing information)
        ss_clean_db = WussToVienna(''.join(ss_clean))

        return (ss_clean_db, query_no_nc)

    def Gappyness(self, decimals=2):
        '''Calculate the fraction of gaps in the query sequence'''
        length = len(self.aln_seqs[1])
        gaps = self.aln_seqs[1].count('-')
        return round((float(gaps) / length), decimals)

    def ConservedBps(self, decimals=2):
        '''Calculate fraction of basepairs conserved in the query, respective to cm structure'''
        br_cm = WussToVienna(self.ss_clean[0]).count('(')
        br_clean = self.ss_clean[1].count('(')
        return round((float(br_clean) / br_cm), decimals)

    def SeqConservation(self):
        '''Calculate fraction of cm/query sequence conservation
        Returns: tuple - (length, cons, comp, nomatch)
        '''
        cons = 0
        comp = 0
        nomatch = 0
        length = len(self.cs_cols)

        for i, nt in enumerate(self.cs_cols):
            if nt == '~': #Local ends
                length -= 1
                continue
            elif self.score_cols[i] == ':':
                comp += 1
            elif self.score_cols[i] == '+':
                comp += 1
            elif self.score_cols[i] == ' ':
                nomatch += 1
            else:
                cons += 1

        return (length, cons, comp, nomatch)

    def SeqConservationSS(self):
        '''Calculate Sequence conservation at Paired positions
        Returns: tuple - (total_states, match_states, mismatch_states, comp_states)
        '''
        bp_states = 0
        bp_matches = 0
        bp_mismatches = 0
        bp_comp = 0

        for i, nt in enumerate(WussToVienna(self.ss_clean[0])): #'cleaned' consensus structure
            if nt == '~': #local end
                continue

            elif nt == '.':
                continue

            elif nt == '(' or nt == ')':
                bp_states += 1
                if self.score_cols[i] == ' ':
                    bp_mismatches += 1
                elif self.score_cols[i] == ':':
                    bp_comp += 1
                else:
                    bp_matches += 1

            else:
                raise ValueError('Encountered unknown base symbol: ' + str(nt))

        return (bp_states, bp_matches, bp_mismatches, bp_comp)

    def SeqConservationUnpaired(self):
        '''Calculate Sequence conservation at unpaired positions
        Returns: tuple - (total_states, match_states, mismatch_states, comp_states)
        '''
        up_states = 0
        up_matches = 0
        up_mismatches = 0
        up_comp = 0

        for i, nt in enumerate(WussToVienna(self.ss_clean[0])): #'cleaned' consensus structure
            if nt == '~': #local end
                continue

            elif nt == '(' or nt == ')': #paired state
                continue

            elif nt == '.': #unpaired state
                up_states += 1
                if self.score_cols[i] == ' ':
                    up_mismatches += 1
                elif self.score_cols[i] == '+':
                    up_comp += 1
                else:
                    up_matches += 1

            else:
                raise ValueError('Encountered unknown base symbol: ' + str(nt))

        return (up_states, up_matches, up_mismatches, up_comp)


class CmsearchOut:
    '''Builder/Container object for Cmsearch Stdout
    TODO: Fix problem of missing PP lines!
    TODO: This will not work with --hmmonly searches (since there is no NC line). fixing will require some more hacking
    '''
    import re
    def __init__(self, filename):
        self.hits = self._ParseHitAlns(filename)
        self.hits_dic = { h.uid : h for h in self.hits }

    def __getitem__(self, index):
        return self.hits[index]

    def __len__(self):
        return len(self.hits)

    def __iter__(self):
        for hit in self.hits:
            yield hit

    def _ParseHitAlns(self, filename):
        '''Parse the (potentially wrapped alignment blocks into one coherent block)'''
        rgx_header = re.compile(r'^>>\s+([a-zA-Z0-9_\.]+)\s+(.*)\s*$') # line with all the results
        rgx_stats = re.compile(r'^\s+\(\d+\)')
        rgx_cols = re.compile(r'^\s*([^\s]+)\s+(\d+)\s+(.+)\s+(\d+)\s*$')
        rgx_cs = re.compile(r'^(\s+)([^\s]+)\s+CS\s*$')
        rgx_pp = re.compile(r'^\s+([^\s]+)\s+PP\s*$')
        #Special cases: can have whitespace at beginning or end (solve by offset)
        rgx_nc =  re.compile(r'.+NC\s*$') #this rgx is just for identification of the NC line

        hits = []
        for aln in self._ParseCmsearchStdout(filename):
            #Init object
            cm_hit = CmsearchHit()

            #Collector variables
            offset = None
            cm_start = None
            cm_end = None
            query_start = None
            query_end = None

            nc = ''
            cs = ''
            cm_cols = ''
            score = ''
            query_cols = ''
            pp = ''

            #iterate over all lines
            aln_iter = iter(aln)
            for line in aln_iter:
                nc_match = rgx_nc.match(line)
                header_match = rgx_header.match(line)
                stats_match = rgx_stats.match(line)

                if header_match:
                    query_name = header_match.group(1)
                    query_description = header_match.group(2)

                elif stats_match:
                    rank, inc, evalue, bit, bias, mdl, mdl_start, mdl_end, mdl_alntype, seq_start, seq_end, strand, seq_alntype, acc, trunc, gc = line.split()
                    test = line
                    #Insert data into object
                    cm_hit.rank         = int(re.split(r'\((\d+)\)',rank)[1])
                    cm_hit.evalue       = float(evalue)
                    cm_hit.bitscore     = float(bit)
                    cm_hit.bias         = float(bias)
                    cm_hit.mdl          = mdl
                    cm_hit.cm_start     = int(mdl_start)
                    cm_hit.cm_end       = int(mdl_end)
                    cm_hit.mdl_alntype  = mdl_alntype
                    cm_hit.strand       = strand
                    cm_hit.seq_alntype  = seq_alntype
                    cm_hit.acc          = float(acc)
                    cm_hit.gc           = float(gc)
                    #Handle some data specially
                    #inc (bool)
                    if inc == '!':
                        cm_hit.inc = True
                    else:
                        cm_hit.inc = False
                    #trunc (false if not)
                    if trunc != 'no':
                        cm_hit.trunc = trunc
                    else:
                        cm_hit.trunc = False
                    #Sequence coordinates (start < end)
                    if int(seq_start) < int(seq_end):
                        cm_hit.seq_start = int(seq_start)
                        cm_hit.seq_end  = int(seq_end)
                    else:
                        cm_hit.seq_start = int(seq_end)
                        cm_hit.seq_end  = int(seq_start)

                elif nc_match:
                    #fetch lines (ugly, but so is the format)
                    nc_line = line
                    cs_line = next(aln_iter)
                    cm_line = next(aln_iter)
                    score_line = next(aln_iter)
                    query_line = next(aln_iter)
                    try: #in some cases the PP line is not annotated... quick workaround
                        #TODO - this will not work if the aln is wrapped around multiple lines
                        pp_line = next(aln_iter)
                    except StopIteration:
                        # leading_spaces = len(cm_line) - len(cs_line.strip(' '))
                        pp_line = ' ' + ('0' * (len(cs_line.lstrip(' '))-3)) + ' PP' #very Q&D workaround
                        # print cs_line
                        # print pp_line
                    #process lines
                    ##consensus structure
                    consensus_match = rgx_cs.match(cs_line)
                    offset = len(consensus_match.group(1)) #trailing whitespace tells us about the offset
                    alen = len(consensus_match.group(2))
                    cs += consensus_match.group(2)

                    #cm columns
                    cm_cols_match = rgx_cols.match(cm_line)
                    cm_id = cm_cols_match.group(1)
                    if cm_start is None:
                        cm_start = cm_cols_match.group(2)
                    cm_cols += cm_cols_match.group(3)[:alen]
                    cm_end = cm_cols_match.group(4)

                    #query columns
                    query_cols_match = rgx_cols.match(query_line)
                    query_id = query_cols_match.group(1)
                    if query_start is None:
                        query_start = query_cols_match.group(2)
                    query_cols += query_cols_match.group(3)[:alen]
                    query_end = query_cols_match.group(4)

                    #Posterior Probability encoding
                    pp_match = rgx_pp.match(pp_line)
                    pp += pp_match.group(1)
                        # try:
                    # except AttributeError:
                        # print cm_hit.mdl, cm_hit.rank, cm_hit.acc, cm_hit.mdl_alntype
                        # print cm_hit.alignment
                        # print test
                        # assert False

                    #NC line (use offset)
                    nc += nc_line[offset:(offset+alen)] #check indexing

                    #CM score line
                    score += score_line[offset:]
                else:
                    # print 'Omitted line:', line
                    pass
            #Final pass: add cm & sequence query name
            cm_hit.cm = str(cm_id)
            cm_hit.seq = str(query_id)

            #Build Alignment object
            coor_cm = (cm_hit.cm_start, cm_hit.cm_end)
            coor_query = (cm_hit.seq_start, cm_hit.seq_end)
            cm_hit.alignment = CmAln(nc, cs, cm_cols, query_cols, score, pp, coor_cm, coor_query)
            cm_hit.uid = cm_hit.cm + ':' + cm_hit.seq + ':' + str(cm_hit.rank)
            assert cm_hit.validate() #is the assertion necessary? (raises error anyways)
            hits.append(cm_hit)
        return hits

    def _ParseCmsearchStdout(self, filename):
        '''Parse raw file, return generator with lines of each hit+aln'''
        rgx_header = re.compile(r'^>>\s+([a-zA-Z0-9_\.]+)\s+(.*)\s*$')
        end_cm = 'Internal CM pipeline statistics summary:'
        end_hmm = 'Internal HMM-only pipeline statistics summary: (run for model(s) with zero basepairs)'

        with open(filename, 'r') as CMSEARCH:
            alignment_lines = None

            #Cycle through all lines
            for l in CMSEARCH:
                l = l.rstrip('\n')
                #Skip empty lines & misc. cmsearch information
                if l == '':
                    continue
                elif l[0] == '#':
                    continue
                elif l == end_cm or l == end_hmm: #end of section
                    if alignment_lines is None:
                        continue
                    else:
                        yield alignment_lines
                        alignment_lines = None #For concatenated files

                #New alignment found, append all further lines to list and yield if finished
                header = rgx_header.match(l)
                if header:
                    if alignment_lines is None:
                        alignment_lines = []
                        alignment_lines.append(l)
                    else:
                        yield alignment_lines
                        alignment_lines = [l]
                elif alignment_lines is None: #exclude stuff before aln section
                    continue
                else:
                    alignment_lines.append(l)


def ParseTbloutGeneric(filename):
    '''Parse the Output of cmscan/cmscan --tblout in a generic fashion (e.g. Dictionary
    names correspond to the column names)
    Args:
        filename(string)
    Returns:
        query_summmary(dic) - Dictionary{QueryName : [List of CMscan Hits as dics]}
    '''
    hits = []
    with open(filename) as DP:
        for line in DP:
            line = line.rstrip('\n')

            if line[0] == '#':
                continue

            else:
                data = line.split()
                if len(data) < 17:
                    print (len(data))
                    print ('LINE: ' + line)
                    raise ValueError('Invalid Data')
                dic = {'target_name': data[0],
                'target_accession': data[1],
                'query_name': data[2],
                'query_accession': data[3],
                'mdl': data[4],
                'mdl_from': data[5],
                'mdl_to': data[6],
                'seq_from': data[7],
                'seq_to': data[8],
                'strand': data[9],
                'trunc': data[10],
                'pass': data[11],
                'gc': data[12],
                'bias': data[13],
                'score': data[14],
                'evalue': data[15],
                'inc': data[16]}

                #hits.append(dic)
                yield dic
    # return hits

def ParseTblout(filename):
    '''Parse the Output of cmscan --tblout
    Args:
        filename(string)
    Returns:
        query_summmary(dic) - Dictionary{QueryName : [List of CMscan Hits as dics]}
    '''
    raise NotImplementedError('This function is deprecated and not yet updated')
    hits = []
    with open(filename) as DP:
        for line in DP:
            line = line.rstrip('\n')

            if line[0] == '#':
                continue

            else:
                data = line.split()
                if len(data) < 17:
                    print (len(data))
                    print ('LINE: ' + line)
                    raise ValueError('Invalid Data')
                dic = {'tgt_name': data[0],
                'tgt_accession': data[1],
                'mdl_name': data[2],
                'mdl_accession': data[3],
                'mdl_type': data[4],
                'mdl_from': data[5],
                'mdl_to': data[6],
                'from': data[7],
                'to': data[8],
                'strand': data[9],
                'trunc': data[10],
                'pass': data[11],
                'gc': data[12],
                'bias': data[13],
                'score': data[14],
                'evalue': data[15],
                'inc': data[16]}

                hits.append(dic)
    return hits

def AlignLoci(outname, fasta, loci):
    '''align_loci - build a sequence alignment from several loci
    Args:
        outname - name of the outfile
        fasta(string) - File containing Sequences in FASTA-format
        loci - list of tuples (FASTA-header, from, to, inc)
    Returns:

    '''
    raise NotImplementedError
    from Bio import SeqIO

    records = {}
    FAin = open(fasta, "rU")
    for rec in SeqIO.parse(FAin, 'fasta'):
        records[rec.id] = rec

    FAout = open(outname, 'w')
    for i in loci:
        id, fr, to, inc = i
        seq = records[id]
        SeqIO.write(seq[int(fr):int(to)], FAout, 'fasta')

def WussToVienna(wuss):
    '''wuss2vienna - convert a WUSS Secondary Structure to Dot-Bracket Format
    Args:
        wuss(str): Secondary structure in WUSS format
    Returns:
        vienna(str): secondary structure in dot-bracket format
    Raises:
        atm - Nothing (TypeError: if wuss is not a string)
    '''
    import re

    vienna = wuss
    #Base pairs
    vienna = re.sub(r'[\[{<]', '(', vienna)
    vienna = re.sub(r'[\]}>]', ')', vienna)
    #Unpaired Bases
    vienna = re.sub(r'[:_\-,]', '.', vienna)
    #Insertions
    # vienna = re.sub(r'[\.~]', '', vienna)
    #Pseudoknots
    vienna = re.sub(r'[aA-zZ]', '.', vienna)

    return vienna

def CleanStructure(ss_wuss, seq):
    '''Map consensus (cleaned) structure to CM/Query sequence'''
    #0 Remove unbalanced basepairs, noncanonical basepairs (already done)
    #0 Remove unbalanced basepairs
    #1a Remove Basepairs affected by inserts (. for CM, - for Query)
    #1b Remove positions coming from inserts
    #2 Remove Basepairs enclosing a loop < 3
    #3 Remove Basepairs that are lone
    #4 Repeat from step 3 #TODO

    if len(ss_wuss) != len(seq):
        raise ValueError('SS and Seq not equally long')

    #Get secondary structure in proper notation
    ss_db = WussToVienna(ss_wuss)
    pair_table = Db2pair(ss_db)
    bps = ParseSS(ss_db)

    #Remove BPs in Indels from both strings ('.' for CM, '-' for Query)
    gaps = set()
    for i,nt in enumerate(seq):
        if nt == '.' or nt == '-':
            gaps.add(i)
            #Remove Basepair in a gap
            if pair_table[i] != -1:
                j = pair_table[i]
                pair_table[j] = -1
                pair_table[i] = -1
            else:
                pair_table[i] = -1
    #Pairtable 2 string:
    ss_nogap = list(Pair2db(pair_table))
    for g in gaps:
        ss_nogap[g] = ''
    ss_nogap = ''.join(ss_nogap)
    pair_table_nogap = Db2pair(ss_nogap)

    #Short loops (<3)
    for i,partner_index in enumerate(pair_table_nogap):
        j = pair_table_nogap[i]
        if abs(j - i) <= 3:
            pair_table_nogap[j] = -1
            pair_table_nogap[i] = -1

    #Lone BPs
    for i,partner_index in enumerate(pair_table_nogap):
        #Handle first element separately
        if i == 0 and partner_index != -1:
            if pair_table[1] == -1:
                j = pair_table_nogap[i]
                pair_table_nogap[j] = -1
                pair_table_nogap[i] = -1
        #Handle last element separately
        elif i == len(pair_table_nogap)-1 and partner_index != -1:
            if pair_table_nogap[i-1] == -1:
                j = pair_table_nogap[i]
                pair_table_nogap[j] = -1
                pair_table_nogap[i] = -1
        #All other elements
        elif partner_index != -1:
            if pair_table_nogap[i-1] == -1 and pair_table_nogap[i+1] == -1:
                j = pair_table_nogap[i]
                pair_table_nogap[j] = -1
                pair_table_nogap[i] = -1
        else:
            continue

    return ''.join(Pair2db(pair_table_nogap))
