DROP PROCEDURE IF EXISTS Characteristics_SpellConfigurations;

DELIMITER ;;
CREATE PROCEDURE Characteristics_SpellConfigurations(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT p.id, p.name, p.sid, p.user_id = userId AS is_author, cs.level_gained, a.name as level_name, a.sid as level_sid, a.user_id = userId AS level_is_author, cs.always_prepared,
           cs.counts_towards_prepared_limit, cs.notes, cs.user_id = userId AS config_is_author
    FROM characteristic_spell_configurations cs
        JOIN spells s ON cs.spell_id = s.power_id
        JOIN powers p ON s.power_id = p.id
        LEFT JOIN attributes a ON cs.level_gained = a.id
        JOIN characteristics c ON c.id = cs.characteristic_id
    WHERE cs.characteristic_id = characteristicId
        AND (cs.user_id = userId OR cs.user_id = c.user_id)
    ORDER BY p.name;
END;;

DELIMITER ;

# CALL Characteristics_SpellConfigurations(2, 1);

