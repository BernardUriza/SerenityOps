#!/usr/bin/env python3
"""
Rename lists to match Free Intelligence template
"""
import json
from pathlib import Path
from trello import TrelloClient

# Load config from trello-cli config file
CONFIG_FILE = Path.home() / '.trello_config.json'

if not CONFIG_FILE.exists():
    print("❌ Configuration file not found.")
    print("   Run 'trello config' to set up API credentials.")
    exit(1)

with open(CONFIG_FILE) as f:
    config = json.load(f)

# Initialize Trello client
client = TrelloClient(
    api_key=config['api_key'],
    token=config['token']
)

# SerenityOps board ID
BOARD_ID = "68fbec1e012f378e62fd9f5a"

# List renames: (list_id, current_name, new_name)
renames = [
    ("68fbfc154ad4f542a5066b64", "🗂 BACKLOG", "📥 Backlog"),
    ("68fbfc1c4366501816ad7f4a", "⚙️ IN PROGRESS", "⚙️ In Progress"),
    ("68fd638e45ae497d4a753bf7", "📚 Governance & Strategy", "📚 Philosophy & Architecture"),
]

print("=" * 80)
print("📝 RENAME LISTS TO FREE INTELLIGENCE TEMPLATE")
print("=" * 80)

success_count = 0
for list_id, old_name, new_name in renames:
    try:
        trello_list = client.get_list(list_id)
        trello_list.set_name(new_name)
        print(f"✅ Renamed: '{old_name}' → '{new_name}'")
        success_count += 1
    except Exception as e:
        print(f"❌ Failed to rename '{old_name}': {e}")

print("\n" + "=" * 80)
print(f"✅ Successfully renamed {success_count}/{len(renames)} lists")
print("=" * 80)
