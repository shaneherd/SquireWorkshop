DROP PROCEDURE IF EXISTS CreatureItems_AddSpell;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_AddSpell(
    IN creatureItemId INT UNSIGNED,
    IN spellId INT UNSIGNED
)
BEGIN
    DECLARE spellLevel SMALLINT UNSIGNED;

    SET spellLevel = (SELECT level FROM spells WHERE power_id = spellId);

    INSERT INTO creature_item_spells (creature_item_id, spell_id, stored_level, charges, allow_casting_at_higher_level, charges_per_level_above_stored_level, max_level, remove_on_casting, override_spell_attack_calculation, spell_attack_modifier, spell_save_dc) VALUES
    (creatureItemId, spellId, spellLevel, 0, 0, 0, spellLevel, 0, 0, 0, 0);

END;;

DELIMITER ;

# CALL CreatureItems_AddSpell(1, 2, 1, 0, null, null, 1, 0);
