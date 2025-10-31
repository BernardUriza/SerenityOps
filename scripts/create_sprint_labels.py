#!/usr/bin/env python3
"""
Create Sprint Labels for SerenityOps Board
Part of Comprehensive Board Audit Remediation - Sprint W43
"""

import json
import sys
from trello import TrelloClient

def load_config():
    """Load Trello configuration"""
    with open('/Users/bernardurizaorozco/.trello_config.json', 'r') as f:
        return json.load(f)

def create_sprint_labels(client, board_id):
    """Create sprint labels for the board"""

    # Sprint labels to create
    sprint_labels = [
        {"name": "Sprint-W43", "color": "blue"},
        {"name": "Sprint-W44", "color": "green"},
        {"name": "Sprint-W45", "color": "orange"},
    ]

    print("🏷️  Creating sprint labels...\n")

    try:
        board = client.get_board(board_id)
        existing_labels = board.get_labels()
        existing_names = [label.name for label in existing_labels]

        created_count = 0
        skipped_count = 0

        for label_def in sprint_labels:
            if label_def["name"] in existing_names:
                print(f"⏭️  Skipped: {label_def['name']} (already exists)")
                skipped_count += 1
            else:
                board.add_label(label_def["name"], label_def["color"])
                print(f"✅ Created: {label_def['name']} ({label_def['color']})")
                created_count += 1

        print(f"\n📊 Summary:")
        print(f"   Created: {created_count} label(s)")
        print(f"   Skipped: {skipped_count} label(s)")

        return created_count

    except Exception as e:
        print(f"❌ Error creating labels: {e}")
        return 0

def main():
    # Load configuration
    config = load_config()
    client = TrelloClient(
        api_key=config['api_key'],
        token=config['token']
    )

    # Board ID for SerenityOps
    board_id = '68fbec1e012f378e62fd9f5a'

    print("=" * 80)
    print("🏷️  SPRINT LABEL CREATION - SerenityOps Board")
    print("=" * 80)
    print()

    created = create_sprint_labels(client, board_id)

    if created > 0:
        print("\n✅ Sprint labels created successfully!")
        print("\n💡 Next step: Run assign_sprint_labels.py to assign labels to cards")
        return 0
    elif created == 0:
        print("\n⚠️  No labels were created (all already exist)")
        return 0
    else:
        print("\n❌ Failed to create labels")
        return 1

if __name__ == '__main__':
    sys.exit(main())
