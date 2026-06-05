# -*- coding: utf-8 -*-
import sys

with open("scratch/pet_mentions.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

for line in lines:
    if "PetExplanation" in line:
        try:
            print(line.strip().encode('utf-8', errors='replace').decode('cp949', errors='replace'))
        except Exception:
            pass
