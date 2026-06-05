# -*- coding: utf-8 -*-
import os
import xlrd

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
wb = xlrd.open_workbook(filepath, encoding_override='cp949')
sheet = wb.sheet_by_index(0)

def print_block(start, end):
    print(f"=== BLOCK {start} to {end} ===")
    for r in range(start, end + 1):
        row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
        # filter out empty values for readability
        non_empty = [f"Col {c}: {repr(val)}" for c, val in enumerate(row_vals) if val != ""]
        print(f"Row {r}: " + ", ".join(non_empty))

with open("scratch/inspect_blocks.txt", "w", encoding="utf-8") as f:
    def write_block(start, end):
        f.write(f"=== BLOCK {start} to {end} ===\n")
        for r in range(start, end + 1):
            row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
            non_empty = [f"Col {c}: {repr(val)}" for c, val in enumerate(row_vals) if val != ""]
            f.write(f"Row {r}: " + ", ".join(non_empty) + "\n")
            
    write_block(2915, 2935)
    write_block(3025, 3045)
