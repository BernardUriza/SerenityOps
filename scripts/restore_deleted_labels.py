#!/usr/bin/env python3
"""
Restore Accidentally Deleted Labels
Emergency recovery script
"""

import json
import sys
from trello import TrelloClient

def load_config():
    """Load Trello configuration"""
    with open('/Users/bernardurizaorozco/.trello_config.json', 'r') as f:
        return json.load(f)

def restore_labels(client, board_id):
    """Restore the accidentally deleted labels"""

    # Labels to restore (from audit report before deletion)
    labels_to_restore = [
        {"name": "P0", "color": "red"},
        {"name": "P1", "color": "yellow"},
        {"name": "Feature", "color": "green"},
        {"name": "AI", "color": "purple"},
        {"name": "L", "color": "orange"},
        {"name": "Sprint-W43", "color": "blue"},
    ]

    print("🔧 Restoring accidentally deleted labels...\n")

    try:
        board = client.get_board(board_id)
        existing_labels = board.get_labels()
        existing_names = [label.name for label in existing_labels]

        restored_count = 0
        skipped_count = 0

        for label_def in labels_to_restore:
            if label_def["name"] in existing_names:
                print(f"⏭️  Skipped: {label_def['name']} (already exists)")
                skipped_count += 1
            else:
                board.add_label(label_def["name"], label_def["color"])
                print(f"✅ Restored: {label_def['name']} ({label_def['color']})")
                restored_count += 1

        print(f"\n📊 Summary:")
        print(f"   Restored: {restored_count} label(s)")
        print(f"   Skipped: {skipped_count} label(s)")

        return restored_count

    except Exception as e:
        print(f"❌ Error restoring labels: {e}")
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
    print("🔧 LABEL RESTORATION - SerenityOps Board")
    print("=" * 80)
    print()

    restored = restore_labels(client, board_id)

    if restored > 0:
        print("\n✅ Labels restored successfully!")
        print("\n⚠️  WARNING: Cards that had these labels will need to be re-labeled manually")
        print("   Use 'trello add-label <card_id> <color> <label_name>' to re-apply")
        return 0
    else:
        print("\n⚠️  No labels were restored")
        return 1

if __name__ == '__main__':
    sys.exit(main())
