DROP PROCEDURE IF EXISTS Monsters_Get_InnateSpells;

DELIMITER ;;
CREATE PROCEDURE Monsters_Get_InnateSpells(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE monsterId INT UNSIGNED;

    SET monsterId = (SELECT id FROM monsters WHERE user_id = userID AND id = creatureId UNION SELECT monster_id FROM monsters_shared WHERE user_id = userId AND monster_id = creatureId);
    IF monsterId IS NULL THEN
        SET monsterId = (SELECT monster_id FROM monsters_public WHERE monster_id = creatureId);
    END IF;
    IF monsterId IS NULL THEN
        SET monsterId = (SELECT monster_id FROM monsters_private WHERE user_id = userId AND monster_id = creatureId);
    END IF;

    # Innate Spells
    SELECT p.id, p.name, p.sid, p.user_id = userId AS is_author, ms.user_id = userId AS config_is_author,
           ms.limited_use_type_id, ms.quantity, ms.ability_modifier_id, ms.dice_size_id, ms.slot
    FROM monster_innate_spells ms
        JOIN spells s ON ms.spell_id = s.power_id
        JOIN powers p ON s.power_id = p.id
        JOIN monsters m ON m.id = ms.monster_id
    WHERE ms.monster_id = monsterId AND (ms.user_id = userId OR ms.user_id = m.user_id);
END;;

DELIMITER ;
