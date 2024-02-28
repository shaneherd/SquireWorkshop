DROP PROCEDURE IF EXISTS Spells_GetCharacteristics;

DELIMITER ;;
CREATE PROCEDURE Spells_GetCharacteristics(
    IN spellId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT c.id, c.name, c.sid, c.user_id = userId AS is_author, cs.user_id = userId AS config_is_author
    FROM characteristic_spell_configurations cs
        JOIN spells s ON cs.spell_id = s.power_id
        JOIN powers p ON s.power_id = p.id
        JOIN characteristics c ON c.id = cs.characteristic_id
    WHERE cs.spell_id = spellId
        AND (cs.user_id = userId OR cs.user_id = p.user_id)
    ORDER BY p.name;
END;;

DELIMITER ;

# CALL Characteristics_SpellConfigurations(2, 1);

