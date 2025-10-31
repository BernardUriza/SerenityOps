#!/usr/bin/env python3
"""
Delete Unused Default Labels from SerenityOps Board
Part of Comprehensive Board Audit Remediation - Sprint W43
"""

import json
import sys
from trello import TrelloClient

def load_config():
    """Load Trello configuration"""
    with open('/Users/bernardurizaorozco/.trello_config.json', 'r') as f:
        return json.load(f)

def cleanup_unused_labels(client, board_id, dry_run=True):
    """Delete unused default labels from the board"""

    # Label IDs from audit report (unused labels)
    unused_label_ids = [
        '68fbec1e012f378e62fd9f94',  # [unnamed red]
        '68fbec1e012f378e62fd9f95',  # [unnamed purple]
        '68fbec1e012f378e62fd9f93',  # [unnamed orange]
        '68fbec1e012f378e62fd9f92',  # [unnamed yellow]
        '68fbec1e012f378e62fd9f91',  # [unnamed green]
        '68fbec1e012f378e62fd9f96',  # [unnamed blue]
    ]

    print("🗑️  Cleaning up unused default labels...\n")

    if dry_run:
        print("⚠️  DRY RUN MODE - No labels will be deleted")
        print("    Run with --execute to actually delete labels\n")

    try:
        board = client.get_board(board_id)
        labels = board.get_labels()

        # Build label ID to label object mapping
        label_map = {label.id: label for label in labels}

        deleted_count = 0
        skipped_count = 0

        for label_id in unused_label_ids:
            if label_id not in label_map:
                print(f"⏭️  Label {label_id} not found (already deleted?)")
                skipped_count += 1
                continue

            label = label_map[label_id]
            label_name = label.name if label.name else f"[unnamed {label.color}]"

            # Safety check: verify label is unused
            # Note: py-trello doesn't expose card count per label easily,
            # so we rely on the audit report being accurate

            if dry_run:
                print(f"🔍 Would delete: {label_name} (color: {label.color}, ID: {label_id})")
            else:
                try:
                    label.delete()
                    print(f"✅ Deleted: {label_name} (color: {label.color})")
                    deleted_count += 1
                except Exception as e:
                    print(f"❌ Failed to delete {label_name}: {e}")
                    skipped_count += 1

        if dry_run:
            print(f"\n📊 Summary (DRY RUN):")
            print(f"   Would delete: {len(unused_label_ids) - skipped_count} label(s)")
            print(f"   Already gone: {skipped_count} label(s)")
        else:
            print(f"\n📊 Summary:")
            print(f"   Deleted: {deleted_count} label(s)")
            print(f"   Skipped: {skipped_count} label(s)")

        return deleted_count if not dry_run else 0

    except Exception as e:
        print(f"❌ Error cleaning up labels: {e}")
        return 0

def main():
    # Parse command line arguments
    dry_run = True
    if len(sys.argv) > 1 and sys.argv[1] == '--execute':
        dry_run = False

    # Load configuration
    config = load_config()
    client = TrelloClient(
        api_key=config['api_key'],
        token=config['token']
    )

    # Board ID for SerenityOps
    board_id = '68fbec1e012f378e62fd9f5a'

    print("=" * 80)
    print("🗑️  UNUSED LABEL CLEANUP - SerenityOps Board")
    print("=" * 80)
    print()

    deleted = cleanup_unused_labels(client, board_id, dry_run=dry_run)

    if dry_run:
        print("\n💡 To execute the deletion, run:")
        print("   python3 scripts/cleanup_unused_labels.py --execute")
        return 0
    elif deleted > 0:
        print("\n✅ Labels cleaned up successfully!")
        print("\n💡 Run 'trello label-audit' to verify")
        return 0
    else:
        print("\n⚠️  No labels were deleted")
        return 1

if __name__ == '__main__':
    sys.exit(main())
