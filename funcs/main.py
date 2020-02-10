from funcs import fancy_cmout_to_json, visualize_cmhits, genomes_tab_to_csv
# from .funcs import funcs

if __name__ == "__main__":

    idir = '../example/largedata'
    odir = '../backend/viz/static/data'

    # ipath = 'example/all_dISFVG.DB__all_dISFVG_3UTR.20190905.fancy.cmout'
    ipath = f'{idir}/all_DENVG_3UTR.3SL.cmout'
    opath = f'{odir}/all_DENVG_3UTR.3SL.json'



    fancy_cmout_to_json(ipath, opath)



    # visualize_cmhits(json_file)

    # genomes_tab_to_csv('example/Flavivirus_ALL_20190905.full.gb.genomes.tab','genomes.csv')