# from funcs import fancy_cmout_to_json, visualize_cmhits, genomes_tab_to_csv
from funcs import transform_cmouts, genomes_tab_to_csv
# from .funcs import funcs

if __name__ == "__main__":

    idir = '../example/cmouts'
    odir = '../root/viz/static/data'

    # transform_cmouts(idir, odir, 'csv')

    genomes_tab_to_csv('example/genomes.tab','root/viz/static/data/genomes.csv')

    # visualize_cmhits(json_file)
