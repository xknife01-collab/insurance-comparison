import os

f_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_0.xls'
with open(f_path, 'rb') as f:
    data = f.read(4000)
    print(data)
