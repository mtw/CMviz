# from ete3 import random_color, NodeStyle
import ete3

if __name__ == '__main__':
    raise ValueError('Cannot execute a module')

def ParseVirusStyles(styfile):
    '''Parse the virus group/subgroup colors from genomes-tab'''
    styles = {}
    with open(styfile, 'r') as STY:
        for line in STY:
            line = line.rstrip()
            if line[0] == '#':
                continue
            elif line == '':
                continue
            else:
                virgroup, virsubgroup, color = line.split('\t')

            if virsubgroup == 'NA':
                styles[virgroup] = color
            else:
                styles[virsubgroup] = color
    return styles


def LoadStyles(styfile):
    styles = {}
    with open(styfile, 'r') as STY:
        for line in STY:
            line = line.rstrip()
            if line[0] == '#':
                continue
            elif line == '':
                continue
            else:
                print (line)
                name, shape, width, height, fgcolor, bgcolor, textsty, text = line.split('\t')

            if name in styles:
                raise KeyError('Duplicate Style found: ' + str(name))
            else:
                styles[name] = {
                    'name' : name,
                    'shape' : shape,
                    'width' : width,
                    'height' : height,
                    'fgcolor' : fgcolor,
                    'bgcolor' : bgcolor,
                    'text' : textsty + text   #Check this
                    # 'text'  : None
                    }

    if 'default' not in styles:
        styles['default'] = {
            'name' : 'default',
            'shape' : '[]',
            'width' : None,
            'height' : 10,
            'fgcolor' : 'black',
            'bgcolor' : 'white',
            'text' : 'arial|6|white|default'
            }
    else:
        raise KeyError('Duplicate Default style')
    return styles


def CreateStylesFromElements(elements):
    #Set Element 'styles'
    element_styles = {}
    element_colors = ete3.random_color(num=len(elements), h=0.1, seed=1337)
    for i, e in enumerate(elements):
        element_styles[e] = {
            'name' : e,
            'shape' : '[]',
            'width' : None,
            'height' : 10,
            'fgcolor' : 'black',
            'bgcolor' : element_colors[i],
            'text' : 'arial|6|white|' + e
            }
    return element_styles


def ComposeMotifs(bed_hits, styles):
    motifs = []
    for b in bed_hits:
        try:
            sty = styles[b['name']]
        except KeyError:
            print ('Style not found for element: ' + str(b['name']))
            sty = styles['default']
        mot = []
        mot.append(int(b['start']))
        mot.append(int(b['end']))
        mot.append(sty['shape'])
        mot.append(sty['width'])
        mot.append(int(sty['height']))
        mot.append(sty['fgcolor'])
        mot.append(sty['bgcolor'])
        mot.append(sty['text'])
        #Collect finished Seqface
        motifs.append(mot)
    return motifs


def ResolveOverlap(motifs):
    '''sort out overlapping motifs from a list of motifs'''
    raise NotImplementedError
    return motifs_clean

def GenerateNodestyles(names):
    '''Generate a list of NodeStyles, all with distinct colors
    Returns:
        styles: dictionary name->NodeStyle-object (ete3)
        colors: dictionary name->Color code (str)
    '''
    styles = {}
    colors = {}
    randcolors = random_color(num=len(names), h=0.1, seed=345124234) #create n colors
    for i, g in enumerate(names):
        sty = ete3.NodeStyle()
        sty['bgcolor'] = randcolors[i]
        styles[g] = sty
        colors[g] = randcolors[i]

    #Create a Default Style
    default_style = ete3.NodeStyle()
    default_style['bgcolor'] = 'Gray'
    styles['default'] = default_style
    colors['default'] = 'Gray'

    return styles, colors
