DROP VIEW IF EXISTS matching_creature_items;

CREATE VIEW matching_creature_items AS
SELECT ci.id AS ci_id, ci.container_id AS ci_container_id, ci.creature_item_state_id AS ci_creature_item_state_id, ci2.id AS ci2_id, ci2.container_id AS ci2_container_id, ci2.creature_item_state_id AS ci2_creature_item_state_id
FROM creature_items ci
    JOIN creature_items ci2 ON
    ci.id != ci2.id
    AND ci.creature_id = ci2.creature_id
    AND ci.item_id = ci2.item_id
    AND ci2.equipped_slot_id IS NULL
#     AND ((ci.equipped_slot_id IS NULL AND ci2.equipped_slot_id IS NULL) OR ci.equipped_slot_id = ci2.equipped_slot_id)
#     AND ci2.dropped = ci.dropped
    AND ci.expanded = ci2.expanded
    AND ci.poisoned = ci2.poisoned
    AND ci.silvered = ci2.silvered
    AND ci.full = ci2.full
    AND ci.attuned = ci2.attuned
#     AND ci.charges = ci2.charges
    AND ci.cursed = ci2.cursed
    AND ((ci.magic_item_type_id IS NULL AND ci2.magic_item_type_id IS NULL) OR ci.magic_item_type_id = ci2.magic_item_type_id)
    AND ((ci.notes IS NULL AND ci2.notes IS NULL) OR ci.notes = ci2.notes);
