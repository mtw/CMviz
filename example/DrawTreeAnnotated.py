#!/usr/bin/env python

import sys
import argparse
import DrawUtils
import pprint
from GeneralUtils import ParseGenomesTab, ParseBedtoolsCluster, ParseBed, ParseLineages
from ete3 import Tree, TreeStyle, NodeStyle, random_color, TextFace, SeqMotifFace
from collections import Counter


p = argparse.ArgumentParser(description='Visualize Newick tree using ETE', formatter_class=argparse.ArgumentDefaultsHelpFormatter)
p.add_argument('-t', '--tree', help='Tree file (NEWICK)', required=True)
p.add_argument('-u', '--ultrametric', help='Ultrametric Tree view', action='store_true', default='false')
p.add_argument('-c', '--circular', help='If set, circular Angle (in degrees) for circular Representation', default=False)
p.add_argument('--pdf', help='Render tree as PDF', default=False)
p.add_argument('--svg', help='Render tree as SVG', default=False)
p.add_argument('--color', help='Color according to virus taxonomy (provide .genomes.tab file)', action='store_true')
p.add_argument('--genomes', help='genomes.tab file', default=None)
p.add_argument('--shownodes', help='Render internal leaf nodes', default=False, action='store_true')
p.add_argument('--showall', help='Render leaves without utrs', default=False, action='store_true')
input_args = p.add_mutually_exclusive_group(required=False)
input_args.add_argument('--bedfile', help='Elements (BED-format)', default=None)
input_args.add_argument('--clusters', help='Elements (BedTools cluster output)', default=None)
input_args.add_argument('--intersect', help='Elements (BedTools intersect output)')
p.add_argument('--elem_cutoff', help='Evalue cutoff for elements', default=None) #Remove this
p.add_argument('--scale', help='Show branch scale', action='store_true')
p.add_argument('--styfile', help='Styfile for virus drawing', default='./VirStyle.tsv')
p.add_argument('--treestyle', help='Styfile for tree drawing', default='./DrawStyle.tsv')
p.add_argument('--lineages', help='Lineage file (.tsv), call leaves by their lineage, not Virus name', default=None)
args = p.parse_args()

def main():
    tree = Tree(args.tree)
    #pprint.pprint(args)
    #raise Exception('done here')

    if args.ultrametric is True:
        tree = Ultrametric(tree)

    if args.circular is False:
        style = TreeStyle()
        style.show_leaf_name = False
        style.draw_guiding_lines = True
    else:
        style = Treestyle_circular(args.circular)

    #Color according to virus groups
    if args.color:
        if args.styfile == None:
            raise ValueError('Must provide stylefile')
            styfile = './VirStyle.tsv'
        else:
            styfile = args.styfile
        tree = ColorByVirusgroup(tree, args.genomes, styfile)
    #Draw Sequence annotation
    if args.bedfile:
        beds = ParseBed(args.bedfile, args.elem_cutoff)
        #pprint.pprint(beds);
        #raise Exception('done parsing beds')

        if not args.showall:
            tree = DeleteNoUtr(tree)
        tree = AnnotateTree(tree, beds, args.elem_cutoff)
    elif args.clusters:
        clusters, clusters_seq = ParseBedtoolsCluster(args.clusters)
        beds = []
        for cluster_id in clusters:
            beds.append(clusters[cluster_id][0]) #Append top hit
        tree = AnnotateTree(tree, beds, args.elem_cutoff)

    #Enable/Disable scale
    if args.scale:
        style.show_scale = True
    else:
        style.show_scale = False

    #Set
    if not args.shownodes:
        default_leaf_size = 2
        for t in tree.traverse():
            t.img_style['size'] = 1
        #Set leaf node sizes to standard value
        for t in tree:
            t.img_style['size'] = default_leaf_size

    if args.pdf:
        tree.render(args.pdf + '.pdf', tree_style=style)
        #tree.render(args.pdf + '.pdf', tree_style=style, units='in', h=11.4, w=8.1) #A4 = 11.69 * 8.27 in

    if args.svg:
        tree.render(args.svg + '.svg', tree_style=style)

    tree.show(tree_style=style)

def DeleteNoUtr(tree):
    '''Delete Leaves without UTRs'''
    virs = ParseGenomesTab(args.genomes) #HACK, uses global variable
    utr_data = {virs[v]['accid'] : virs[v]['utr_len'] for v in virs}

    #Iterate over all leafs (=viruses)
    for n in tree:
        # print n.name
        name_splt = n.name.split('_')
        accid = '_'.join(name_splt[1:])
        n.accid = accid
        print (accid) #DEBUG
        print (n.vircode)

        if accid == None:
            continue
        if utr_data[accid] == 0:
            print ('Remove Node without UTR:', n.name)
            n.delete()
    return tree

def AnnotateTree(tree, beds, cutoff):
    #Load Annotation
    virs = ParseGenomesTab(args.genomes) #HACK, uses global variable
    virs_by_accid = {virs[v]['accid'] : virs[v] for v in virs}
    virs_by_vircode = {virs[v]['vircode'] : virs[v] for v in virs}
    utr_data = {virs[v]['accid'] : virs[v]['utr_len'] for v in virs}

    #Unify virus names in tree
    for n in tree:
        print (n.name)
        name_splt = n.name.split('_')

        #Ok here follows a nasty hack: sometimes a leafs name is CHIKV_ACCID, in some cases its just ACCID.. querying the length of a split string is a workaround and should be replaced by a more general and robust method on handling leaf names
        if len(name_splt) == 1 and 'NC' not in name_splt:
            uid = name_splt[0]
        elif len(name_splt) > 1 and 'NC' in name_splt: #refseq entry present (NC_ABCDEFG1234)
            refs_idx = name_splt.index('NC')
            uid = name_splt[refs_idx] + '_' + name_splt[refs_idx + 1]
        elif len(name_splt) > 1: #just works in case the ACCID is the second entry
            uid = '_'.join(name_splt[1:])

        if uid in virs_by_accid:
            n.accid = uid
            n.vircode = virs_by_accid[uid]['vircode']
        elif uid in virs_by_vircode:
            n.vircode = uid
            n.accid = virs_by_vircode[uid]['accid']
        else:
            n.vircode = None
            n.accid = None
            # raise ValueError('Could not find annotation for Tree node:' + n.name)

    #Collect all hits for each virus
    viruses_hits = {}
    for bed in beds:
        name_splt = bed['seq'].split('_')
        uid = '_'.join(name_splt[1:])
        if uid in virs_by_accid:
            accid = uid
            vircode = virs_by_accid[uid]['vircode']
        elif uid in virs_by_vircode:
            vircode = uid
            accid = virs_by_vircode[uid]['accid']

        if accid not in viruses_hits:
            viruses_hits[accid] = [bed]
        else:
            viruses_hits[accid].append(bed)

    #Collect all unique element names
    elements = []
    for b in beds:
        if b['name'] not in elements:
            elements.append(b['name'])

    if args.treestyle == None:
        raise ValueError('No Stylefile provided')
        stylefile = '/scr/romulus/romanoch/Diss/DATA/fv-project/fv-data/scripts/DrawStyle.tsv'
    else:
        stylefile = args.treestyle
    #Load pre-defined element styles
    element_styles = DrawUtils.LoadStyles(stylefile)
    #Create random styles
    # random_styles = DrawUtils.CreateStylesFromElements(elements)

    #Iterate over all leafs (=viruses)
    for n in tree:
        name_splt = n.name.split('_')
        accid = n.accid

        #Add Faces
        if accid == None:
            #No data available for this virus, add placeholder SeqFace
            f = TextFace('N/A', fsize=6, fstyle='italic')
            f.background.color='white'
            n.add_face(f, column=1, position='aligned')

        elif accid not in viruses_hits and utr_data[accid] == 0:
            #No data available for this virus, add placeholder SeqFace
            f = TextFace('N/A', fsize=6, fstyle='italic')
            f.background.color='white'
            n.add_face(f, column=1, position='aligned')

        elif accid not in viruses_hits:
            #No hits in this virus - Load utr, print empty sequence
            # seq = utr_data[accid]['seq']
            seq = '-' * utr_data[accid]
            seqface = SeqMotifFace(seq=seq, gapcolor='black', seq_format='-')
            seqface.background.color='white'
            n.add_face(seqface, 1, 'aligned')
        else:
            #UTR is there, hits are there - print annotation
            all_hits = viruses_hits[accid]
            #filter out non-chen hits
            chen_hits = ['1A','1B','1C','1D','2A','2B','2C','2D','Y1','Y2','Z1','Z2','2a']
            hits = filter(lambda h: h['name'] not in chen_hits, all_hits)

            motifs = DrawUtils.ComposeMotifs(hits, element_styles)
            seq = '-' * utr_data[accid]
            seqface = SeqMotifFace(seq=seq, motifs=motifs, seq_format='-', gapcolor='black')
            seqface.background.color='white'
            n.add_face(seqface, 1, 'aligned')
            #
            # bla = SeqMotifFace(seq=seq)
            # n.add_face(bla, 1, 'aligned')
            #
            # #Add chen hits as separate entity to same node (they pile up automatically)
            # hits = filter(lambda h: h['name'] in chen_hits, all_hits)
            # motifs = DrawUtils.ComposeMotifs(hits, element_styles)
            # seq = '-' * utr_data[accid]
            # seqface = SeqMotifFace(seq=seq, motifs=motifs, seq_format='-', gapcolor='black')
            # seqface.background.color='white'
            # n.add_face(seqface, 1, 'aligned')


    utr_counter = Counter()
    for v in virs:
        if virs[v]['utr_len'] > 0:
            utr_counter[virs[v]['virspecies']] += 1

    #Write Summary for TeX file (TODO make separate part)
    virlist = []
    for n in tree:
        if n.accid == None:
            print (n)
            continue
        virdic = virs_by_accid[n.accid]
        #Group, Accession, Acronym, Name, UTR length
        virlist.append([virdic['virgroup'], virdic['accid'], virdic['virspecies'], virdic['virname'], str(utr_data[n.accid]), str(utr_counter[virdic['virspecies']])])
        # print n.accid, n.vircode
    virlist.sort(key=lambda x: (x[0], x[2]))

    for i in virlist:
        # print '\t'.join(i)
        print(' & '.join(i) + ' \\\\')
    return tree


def Ultrametric(tree, leaf_size=4):
    Tree.convert_to_ultrametric(tree)
    #Set all node sizes to 0 (distorts ultrametric view)
    for t in tree.traverse():
        t.img_style['size'] = 0
    #Set leaf node sizes to standard value
    for t in tree:
        t.img_style['size'] = leaf_size
    return tree


def Treestyle_circular(degree):
    style_circ = TreeStyle()
    style_circ.draw_guiding_lines = True
    style_circ.show_leaf_name = False
    style_circ.mode = "c"
    style_circ.arc_start = -90 # 0 degrees = 3 o'clock
    style_circ.arc_span = degree
    return style_circ


def ColorByVirusgroup(tree, genomes_file, virus_stylefile=None):
    global args
    virus_info = ParseGenomesTab(genomes_file)
    #pprint.pprint(virus_info);
    #raise Exception('done parsing genomes.tab')
    #Swap Virus name for lineage if present
    if args.lineages:
        lineage_by_accid, lineage_by_vircode = ParseLineages(args.lineages)
    else:
        lineage_by_accid = {}
        lineage_by_vircode = {}

    groups = []
    # this is pretty inefficient since we loop over all genome.tab entries
    for virname in virus_info:
        if virus_info[virname]['virgroup'] in groups:
            pass
        else:
            groups.append(virus_info[virname]['virgroup'])

    #Create Styles
    groupstyles = {}
    groupcolors = {}
    #Create a Default Style
    default_style = NodeStyle()
    default_style['bgcolor'] = 'Beige'
    groupstyles['default'] = default_style
    groupcolors['default'] = 'Beige'

    #Create custom styles
    if virus_stylefile == None:
        colors = random_color(num=len(groups), h=0.1, seed=345124234) #create n colors
        for i, g in enumerate(groups):
            sty = NodeStyle()
            sty['bgcolor'] = colors[i]
            groupstyles[g] = sty
            groupcolors[g] = colors[i]

    else:
        colors = DrawUtils.ParseVirusStyles(virus_stylefile)
        #pprint.pprint(colors)
        #raise Exception('done parsing colors')
        for g in groups:
            sty = NodeStyle()
            sty['bgcolor'] = colors[g]
            groupstyles[g] = sty
            groupcolors[g] = colors[g]

    #Iterate over tree
    for n in tree:
        # accid = n.name
        print ("n.name", n.name)
        n.img_style['size'] = 0
        name_splt = n.name.split('_')
        accid = '_'.join(name_splt[1:])
        pprint.pprint(accid);
        #Set content of Textface (Virus name or lineage)
        if name_splt[-1] in lineage_by_vircode:
            vir = lineage_by_vircode[name_splt[-1]]
            print ('bvl')
        else:
            vir = name_splt[0]




        if accid not in virus_info:
            print ('Fallback to Default style: ' + str(accid) + '/' + str(n.name))
            f = TextFace(vir, fgcolor='black')
            f.background.color='white'
            n.add_face(f,column=0, position='aligned')
        else:
            virgroup = virus_info[accid]['virgroup']
            virsubgroup = virus_info[accid]['virsubgroup']
            #If subgroup is set: override virus group
            if virsubgroup in groupcolors:
                vircolor = groupcolors[virsubgroup]
            elif virgroup in groupcolors:
                vircolor = groupcolors[virgroup]
            else:
                print ('No color style set for: ' + virgroup)

            f = TextFace(vir, fgcolor=vircolor, fsize=10)
            f.background.color='white'
            n.add_face(f,column=0, position='aligned')

    return tree
    #Old function:
    # for n in tree:
    #     name_splt = n.name.split('_')
    #     accid = '_'.join(name_splt[1:])
    #     if accid not in virus_info:
    #         n.set_style(groupstyles['default'])
    #     else:
    #         virgroup = virus_info[accid]['virgroup']
    #         style = groupstyles[virgroup]
    #         n.set_style(style)
    #
    # for n in tree:
    #     name_splt = n.name.split('_')
    #     accid = '_'.join(name_splt[1:])
    #     if accid not in virus_info:
    #         f = TextFace('Other')
    #         f.background.color='white'
    #         n.add_face(f,column=0, position='aligned')
    #     else:
    #         virgroup = virus_info[accid]['virgroup']
    #         virsubgroup = virus_info[accid]['virsubgroup']
    #         f = TextFace(virgroup + '/' + virsubgroup)
    #         f.background.color='white'
    #         n.add_face(f,column=0, position='aligned')
    #         # n.add_face(TextFace(virsubgroup),column=1, position='aligned')
    #
    # return tree


# def ParseGenomesTab(filename):
#     viruses = {}
#
#     with open(filename, 'r') as TABFILE:
#         for line in TABFILE:
#             line = line.rstrip()
#             if line == '':
#                 continue
#             line_content = line.split('\t')
#             if len(line_content) != 17:
#                 raise ValueError('Misformated line in genomes.tab:\n' + line)
#             accession_id = line_content[0]
#             viruses[accession_id] = {
#                 'accid' : line_content[0],         # MH310082.1
#                 'vircode' : line_content[2],       # 4.1.2.1
#                 'virgroup' : line_content[4],      # ISFV
#                 'virsubgroup' : line_content[5],   # cISFVG
#                 'virspecies' : line_content[6],    # CFAV
#                 'utr_len'   : int(line_content[9]),     # 1234
#                 'virname' : line_content[10]      # Cell fusing agent virus
#                 }
#
#     return viruses


# def ParseBed(filename, cutoff=None):
#     bed_hits = []
#     with open(filename, 'r') as BED:
#         for line in BED:
#             line = line.rstrip()
#             uid, start, end, name, score, strand = line.split()
#             if cutoff and int(score) < int(cutoff):
#                 continue
#             elif strand == '-':
#                 continue
#             else:
#                 bed_hits.append(
#                     {'uid' : uid,
#                     'start' : int(start),
#                     'end'   : int(end),
#                     'name'  : name,
#                     'strand': strand}
#                     )
#     return bed_hits


def ParseUtrs(filename):
    '''Load all utrs with length'''
    raise NotImplementedError
    return utrs

if __name__ == '__main__':
    main()
