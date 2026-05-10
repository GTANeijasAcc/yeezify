#!/usr/bin/env python3
import os
import sys

# Define backend structure
backend_path = r"C:\Users\Caleb\yeezify\yeezify\backend"
directories = [
    "",
    "middleware",
    "routes", 
    "services",
    "controllers",
    "models",
    "utils",
    "config"
]

# Create directories
for d in directories:
    full_path = os.path.join(backend_path, d) if d else backend_path
    os.makedirs(full_path, exist_ok=True)
    if d:
        print(f"✓ Created: {d}")
    else:
        print(f"✓ Created: backend")

print(f"\n✓ Backend directory structure created at: {backend_path}")
print("\nDirectory listing:")
for root, dirs, files in os.walk(backend_path):
    level = root.replace(backend_path, '').count(os.sep)
    indent = ' ' * 2 * level
    print(f'{indent}{os.path.basename(root)}/')
    sub_indent = ' ' * 2 * (level + 1)
    for d in dirs:
        print(f'{sub_indent}{d}/')
