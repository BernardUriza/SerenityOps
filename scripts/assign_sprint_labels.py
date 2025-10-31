#!/usr/bin/env python3
"""
Assign Sprint Labels to Cards Based on Due Dates
Part of Comprehensive Board Audit Remediation - Sprint W43
"""

import json
import sys
from datetime import datetime
from trello import TrelloClient

def load_config():
    """Load Trello configuration"""
    with open('/Users/bernardurizaorozco/.trello_config.json', 'r') as f:
        return json.load(f)

def get_sprint_label_for_due_date(due_date_str):
    """Determine which sprint label to use based on due date"""
    if not due_date_str:
        return None

    # Parse due date (Trello format: 2025-11-01T17:00:00.000Z)
    due_date = datetime.fromisoformat(due_date_str.replace('Z', '+00:00'))

    # Sprint W43: Oct 25 - Nov 1, 2025
    # Sprint W44: Nov 4 - Nov 10, 2025
    # Sprint W45: Nov 11+, 2025
    if (due_date.month == 10 and due_date.day >= 25) or (due_date.month == 11 and due_date.day <= 1):
        return "Sprint-W43"
    elif due_date.month == 11 and due_date.day >= 3 and due_date.day <= 10:
        return "Sprint-W44"
    elif due_date.month == 11 and due_date.day >= 11:
        return "Sprint-W45"
    else:
        return None

def assign_sprint_labels(client, board_id):
    """Assign sprint labels to cards based on their due dates"""

    # Cards that need sprint labels (from audit report)
    card_ids = [
        # In Progress (4 cards)
        '68fbfcf420a8bd37a9caa7b8',  # SO-INFRA-FEAT-002
        '68fbfcf5dcf4160b11eb24a4',  # SO-OPP-FEAT-002
        '68fbfcf599bee83a83de604b',  # SO-UI-FEAT-002
        '68fbfd6e908cfa2f32ba7e66',  # SO-CVE-FEAT-002
        # Ready (6 cards)
        '68fbfcf0650e8370b7301b93',  # SO-OPP-FEAT-001
        '68fbfcf22f23d2cd20f8905a',  # SO-INFRA-FEAT-001
        '68fbfd6e9ba0d684b3c87fea',  # SO-CVE-FEAT-003
        '68fd86b81d314743e4aae299',  # SO-OPP-DATA-001
        '68fd87776cdf828c533daba6',  # SO-OPP-FIX-001
        '68fd8787b3a86c57e76cdc9f',  # SO-OPP-DATA-002
        # Testing (1 card)
        '68fd6d474005bb9fd2b0334f',  # SO-QA-CHT-003
    ]

    print("🏷️  Assigning sprint labels based on due dates...\n")

    try:
        board = client.get_board(board_id)
        labels = board.get_labels()

        # Build label name to label object mapping
        label_map = {label.name: label for label in labels}

        success_count = 0
        skipped_count = 0
        error_count = 0

        for card_id in card_ids:
            try:
                card = client.get_card(card_id)

                # Get due date
                due_date = card.due

                if not due_date:
                    print(f"⚠️  {card.name[:50]}... - No due date, skipping")
                    skipped_count += 1
                    continue

                # Determine sprint label
                sprint_label_name = get_sprint_label_for_due_date(due_date)

                if not sprint_label_name:
                    print(f"⚠️  {card.name[:50]}... - Due date outside sprint range, skipping")
                    skipped_count += 1
                    continue

                # Check if label exists
                if sprint_label_name not in label_map:
                    print(f"❌ {card.name[:50]}... - Label '{sprint_label_name}' not found on board")
                    error_count += 1
                    continue

                # Check if card already has this label
                card_label_names = [label.name for label in card.labels]
                if sprint_label_name in card_label_names:
                    print(f"⏭️  {card.name[:50]}... - Already has {sprint_label_name}")
                    skipped_count += 1
                    continue

                # Add label to card
                label = label_map[sprint_label_name]
                card.add_label(label)
                print(f"✅ {card.name[:50]}... → {sprint_label_name}")
                success_count += 1

            except Exception as e:
                print(f"❌ Error processing card {card_id}: {e}")
                error_count += 1

        print(f"\n📊 Summary:")
        print(f"   Labeled:  {success_count} card(s)")
        print(f"   Skipped:  {skipped_count} card(s)")
        print(f"   Errors:   {error_count} card(s)")

        return success_count

    except Exception as e:
        print(f"❌ Error assigning labels: {e}")
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
    print("🏷️  SPRINT LABEL ASSIGNMENT - SerenityOps Board")
    print("=" * 80)
    print()

    assigned = assign_sprint_labels(client, board_id)

    if assigned > 0:
        print("\n✅ Sprint labels assigned successfully!")
        print("\n💡 Run 'trello sprint-audit' to verify labels")
        return 0
    else:
        print("\n⚠️  No labels were assigned")
        return 1

if __name__ == '__main__':
    sys.exit(main())
