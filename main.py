from funcs.funcs import fancy_cmout_to_json, visualize_cmhits, genomes_tab_to_csv

if __name__ == "__main__":
    # fancy_file="all_dISFVG.DB__all_dISFVG_3UTR.20190905.fancy.cmout"
    # json_file="all_dISFVG.DB__all_dISFVG_3UTR.20190905.json"
    # fancy_cmout_to_json(fancy_file)

    # visualize_cmhits(json_file)

    genomes_tab_to_csv('example/Flavivirus_ALL_20190905.full.gb.genomes.tab','genomes.csv')