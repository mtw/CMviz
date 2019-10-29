def ParseBedtoolsCluster(filename):
    '''
    clusters: dictionary that holds the bed-strings for each cluster (sorted by evalue)
    clusters_sequences: dictionary that holds the clusters(bed-strings) for each sequence (sorted by evalue)
    '''
    clusters = {}
    clusters_sequences = {}
    with open(filename, 'r') as BEDCLUSTER:
        for line in BEDCLUSTER:
            line = line.rstrip()
            seq, start, end, name, score, strand, clusterid = line.split('\t')

            clu = {'seq' : seq, 'start' : start, 'end' : end,
                'name' : name, 'score' : int(score),
                'strand' : strand, 'clusterid' : clusterid}
            if clusterid in clusters:
                clusters[clusterid].append(clu)
            else:
                clusters[clusterid] = [clu]

    #Group by Sequence
    for clu_id in clusters:
        cluster = clusters[clu_id]
        clu_sequence_id = cluster[0]['seq']
        if clu_sequence_id in clusters_sequences:
            clusters_sequences[clu_sequence_id].append(cluster)
        else:
            clusters_sequences[clu_sequence_id] = [cluster]

    #Sort by evalue (highest first)
    for clu in clusters:
        clusters[clu].sort(key=lambda bed: bed['score'], reverse=True)
    for seq in clusters_sequences:
        for cluster in clusters_sequences[seq]:
            cluster.sort(key=lambda bed: bed['score'], reverse=True)

    return clusters, clusters_sequences


def ParseBed(filename, cutoff=None):
    '''Parse BED-file format'''
    bed_hits = []
    with open(filename, 'r') as BED:
        for line in BED:
            if line[0] == '#':
                continue
            line = line.rstrip()
            try:
                seq, start, end, name, score, strand = line.split()
            except ValueError:
                content = line.split()
                seq = content[0]
                start = content[1]
                end = content[2]
                name = content[3]
                score = content[4]
                strand = content[5]
                misc = content[6:]

            if cutoff and int(score) < int(cutoff):
                continue
            else:
                bed_hits.append(
                    {'seq' : seq,
                    'start' : int(start),
                    'end'   : int(end),
                    'name'  : name,
                    'score' : int(score),
                    'strand': strand}
                    )
    return bed_hits


def ParseGenomesTab(filename):
    viruses = {}

    with open(filename, 'r') as TABFILE:
        for line in TABFILE:
            line = line.rstrip()
            if line == '':
                continue
            line_content = line.split('\t')
            if len(line_content) != 17:
                raise ValueError('Misformated line in genomes.tab:\n' + line)
            accession_id = line_content[0]
            viruses[accession_id] = {
                'accid' : line_content[0],          # MH310082.1
                'taxid' : line_content[1],          # 11060
                'vircode' : line_content[2],        # 4.1.2.1
                'virtax' : line_content[3],         # MBFV/DENVG/DENV2
                'virgroup' : line_content[4],       # ISFV
                'virsubgroup' : line_content[5],    # cISFVG
                'virspecies' : line_content[6],     # CFAV
                'utr5_len' : line_content[7],       # 84
                'cds_len'   : line_content[8],      # 10176
                'utr_len'   : int(line_content[9]), # 1234
                'virname' : line_content[10]      # Cell fusing agent virus
                }

    return viruses

def ParseBedtoolsIntersect(filename):
    '''bedtools intersect -loj -f 0.9 -r ....
    q&d as f
    '''
    hits = []
    with open(filename, 'r') as BEDFILE:
        for line in BEDFILE:
            line = line.rstrip()
            content = line.split('\t')

            #Left: original hit, right overlapping hit
            bed1 = '\t'.join(content[:6])
            seq1, start1, end1, name1, score1, strand1 = content[:6]
            hit1 = {
                'seq' : seq1,
                'start' : int(start1),
                'end'   : int(end1),
                'name'  : name1,
                'score' : int(score1),
                'strand': strand1,
                'as_string' : bed1}

            bed2 = '\t'.join(content[6:])
            seq2, start2, end2, name2, score2, strand2 = content[6:]
            hit2 = {
                'seq' : seq2,
                'start' : int(start2),
                'end'   : int(end2),
                'name'  : name2,
                'score' : int(score2),
                'strand': strand2,
                'as_string' : bed2}

            hits.append((hit1, hit2))
    return hits

def ParseLineages(filename):
    '''Parse CHIKV-lineage file (.tsv/csv)
    '''
    lin_by_accid = {}
    lin_by_vircode = {}

    with open(filename, 'r') as LIN:
        for l in LIN:
            l = l.rstrip()
            accid, vircode, lineage = l.split()

            lin_by_accid[accid] = lineage
            lin_by_vircode[vircode] = lineage

    return lin_by_accid, lin_by_vircode
