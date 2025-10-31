#!/usr/bin/env python3
"""
Script to assign members to Trello cards
Part of Board Health Audit Remediation - Sprint W43
"""

import json
import sys
from trello import TrelloClient

def load_config():
    """Load Trello configuration"""
    with open('/Users/bernardurizaorozco/.trello_config.json', 'r') as f:
        return json.load(f)

def assign_member_to_card(client, card_id, member_id):
    """Assign a member to a card"""
    try:
        card = client.get_card(card_id)
        card.assign(member_id)
        print(f"✅ Assigned member to card: {card.name}")
        return True
    except Exception as e:
        print(f"❌ Error assigning member to card {card_id}: {e}")
        return False

def get_board_members(client, board_id):
    """Get all members of a board"""
    try:
        board = client.get_board(board_id)
        members = board.get_members()
        print("\n📋 Board Members:")
        for member in members:
            print(f"   {member.full_name} (ID: {member.id})")
        return members
    except Exception as e:
        print(f"❌ Error getting board members: {e}")
        return []

def main():
    # Load configuration
    config = load_config()
    client = TrelloClient(
        api_key=config['api_key'],
        token=config['token']
    )

    # Board ID for SerenityOps
    board_id = '68fbec1e012f378e62fd9f5a'

    # Get board members
    members = get_board_members(client, board_id)

    if not members:
        print("❌ No members found on board")
        return 1

    # Use the first member (should be Bernard Uriza)
    member_id = members[0].id
    print(f"\n🎯 Will assign cards to: {members[0].full_name} ({member_id})\n")

    # Cards to assign (from audit report)
    orphaned_cards = [
        '68fbfcf420a8bd37a9caa7b8',  # SO-INFRA-FEAT-002: Deployment Badge & Logs
        '68fbfcf5dcf4160b11eb24a4',  # SO-OPP-FEAT-002: Opportunities Viewer CMS
        '68fbfcf599bee83a83de604b',  # SO-UI-FEAT-002: Serenity UI Mac Framework
        '68fbfd6e908cfa2f32ba7e66',  # SO-CVE-FEAT-002: CV Template Architecture
        '68fd6d474005bb9fd2b0334f',  # SO-QA-CHT-003: End-to-End Chat Validation
    ]

    print("🔧 Assigning members to orphaned cards...\n")

    success_count = 0
    for card_id in orphaned_cards:
        if assign_member_to_card(client, card_id, member_id):
            success_count += 1

    print(f"\n📊 Summary: {success_count}/{len(orphaned_cards)} cards assigned successfully")

    return 0 if success_count == len(orphaned_cards) else 1

if __name__ == '__main__':
    sys.exit(main())
