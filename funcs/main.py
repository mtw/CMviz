# from funcs import fancy_cmout_to_json, visualize_cmhits, genomes_tab_to_csv
from funcs import transform_cmouts
# from .funcs import funcs

if __name__ == "__main__":

    idir = '../example/cmouts'
    odir = '../backend/viz/static/data'

    transform_cmouts(idir, odir, 'csv')

    # ifile = 'all_DENVG_3UTR.DB2'
    # file_type = 'csv'

    # ipath = 'example/all_dISFVG.DB__all_dISFVG_3UTR.20190905.fancy.cmout'
    # ipath = f'{idir}/{ifile}.cmout'
    # opath = f'{odir}/{ifile}.{file_type}'

    # fancy_cmout_to_json(ipath, opath, file_type)



    # visualize_cmhits(json_file)

    # genomes_tab_to_csv('example/Flavivirus_ALL_20190905.full.gb.genomes.tab','genomes.csv')