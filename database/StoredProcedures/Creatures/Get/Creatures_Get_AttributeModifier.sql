DROP PROCEDURE IF EXISTS Creatures_Get_AttributeModifier;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_AttributeModifier(
    IN creatureId INT UNSIGNED,
    IN abilityId INT UNSIGNED,
    IN attributeId SMALLINT UNSIGNED
)
BEGIN
    CALL Creatures_Get_AbilityScore(creatureId, abilityId);

    SELECT proficient, double_prof, half_prof, misc_modifier, round_up
    FROM creature_attribute_profs
        JOIN attributes a ON creature_attribute_profs.attribute_id = a.id
    WHERE creature_id = creatureId AND a.sid = attributeId;

    # todo - power modifiers
END;;

DELIMITER ;

