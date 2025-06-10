# The purpose of this scrip ist to randomize the structured data in the dataset.jsonl 
#
#
#

import json 
import random


INPUT_FILE = "dataset.jsonl"
TRAIN_FILE = "train.jsonl"
VALID_FILE = "valid.jsonl"
SPLIT_PERCENTAGE = 0.8

#Read Source File
with open(INPUT_FILE, "r") as f:
    lines = f.readlines()
   
# Shuffle Lines
random.shuffle(lines)

# Identify split border
split_idx = int(len(lines) * SPLIT_PERCENTAGE)

# Set train and valid lines
train_lines = lines[:split_idx]
valid_lines = lines[split_idx:]

# Write down to files
with open(TRAIN_FILE, "a") as f:
    f.writelines(train_lines)

with open(VALID_FILE, "a") as f:
    f.writelines(valid_lines)


print(f"The dataset was split into {len(train_lines)} train lines and {len(valid_lines)} Validation lines!")