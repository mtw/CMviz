from funcs.funcs import fancy_cmout_to_json, visualize_cmhits, genomes_tab_to_csv
# from .funcs import funcs

if __name__ == "__main__":
    ipath = 'example/all_dISFVG.DB__all_dISFVG_3UTR.20190905.fancy.cmout'
    ipath = 'example/largedata/all_DENVG_3UTR.DB1.cmout'
    opath = 'all_DENVG_3UTR.DB1.json'
    fancy_cmout_to_json(ipath, opath)

    # visualize_cmhits(json_file)

    # genomes_tab_to_csv('example/Flavivirus_ALL_20190905.full.gb.genomes.tab','genomes.csv')