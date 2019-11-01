from funcs.funcs import fancy_cmout_to_json

if __name__ == "__main__":
    ifile = "all_dISFVG.DB__all_dISFVG_3UTR.20190905.fancy.cmout"
    ipath = f"example/{ifile}"
    
    ofile = ifile.replace(".fancy.cmout", ".json")
    opath = f"output/{ofile}"

    fancy_cmout_to_json(ipath, ofile)
