DROP PROCEDURE IF EXISTS Characteristics_Get_Background;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Get_Background(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE backgroundId INT UNSIGNED;

    SET backgroundId = (SELECT id FROM characteristics WHERE user_id = userID AND id = characteristicId UNION SELECT characteristic_id FROM characteristics_shared WHERE user_id = userId AND characteristic_id = characteristicId);
    IF backgroundId IS NULL THEN
        SET backgroundId = (SELECT characteristic_id FROM characteristics_public WHERE characteristic_id = characteristicId);
    END IF;
    IF backgroundId IS NULL THEN
        SET backgroundId = (SELECT characteristic_id FROM characteristics_private WHERE user_id = userId AND characteristic_id = characteristicId);
    END IF;

    SELECT c.id, c.name, c.sid, c.parent_characteristic_id, c.num_abilities, c.num_languages, c.num_saving_throws,
           c.num_skills, c.num_tools, c.spellcasting_ability_id, b.description, b.starting_gold,
           c.user_id = userId AS is_author, c.version
    FROM characteristics c
        JOIN backgrounds b on c.id = b.characteristic_id AND c.id = backgroundId;

    IF backgroundId IS NOT NULL THEN
        CALL Characteristics_ProfsAndModifiers(backgroundId);
        CALL Characteristics_SpellConfigurations(backgroundId, userId);
        CALL Characteristics_StartingEquipment(backgroundId, 0, userId);
        CALL Characteristics_DamageModifiers(backgroundId, userId);
        CALL Characteristics_ConditionImmunities(backgroundId, userId);
        CALL Characteristics_Senses(backgroundId);

        # Traits
        SELECT id, background_trait_type_id, description
        FROM background_traits
        WHERE background_id = backgroundId;

        # Sub-backgrounds
        SELECT s.id
        FROM characteristics c
            JOIN characteristics s ON s.parent_characteristic_id = c.id AND (s.user_id = c.user_id OR s.user_id IN (0, userId))
        WHERE s.parent_characteristic_id = backgroundId;
    END IF;
END;;

DELIMITER ;

# CALL Characteristics_Get_Background(1, 1);