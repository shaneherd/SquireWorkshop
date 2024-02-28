DROP PROCEDURE IF EXISTS Attributes_Get_CasterType;

DELIMITER ;;
CREATE PROCEDURE Attributes_Get_CasterType(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE casterTypeId INT UNSIGNED;

    SET casterTypeId = (SELECT id FROM attributes WHERE user_id = userID AND id = attributeId UNION SELECT attribute_id FROM attributes_shared WHERE user_id = userId AND attribute_id = attributeId);
    IF casterTypeId IS NULL THEN
        SET casterTypeId = (SELECT attribute_id FROM attributes_public WHERE attribute_id = attributeId);
    END IF;
    IF casterTypeId IS NULL THEN
        SET casterTypeId = (SELECT attribute_id FROM attributes_private WHERE user_id = userId AND attribute_id = attributeId);
    END IF;
    IF casterTypeId IS NULL THEN
        SET casterTypeId = (SELECT a.id
                            FROM attributes a
                                     JOIN creatures c ON c.user_id = a.user_id AND a.id = attributeId
                                     JOIN campaign_characters cc ON cc.creature_id = c.id
                                     JOIN campaigns c2 ON cc.campaign_id = c2.id AND c2.user_id = userId
                            LIMIT 1);
    END IF;

    SELECT a.id, a.name, a.description, a.sid, ct.multiclass_weight, ct.round_up, a.user_id = userId AS is_author, a.version
    FROM attributes a
        JOIN caster_types ct ON a.id = ct.attribute_id AND a.id = casterTypeId;

    IF casterTypeId IS NOT NULL THEN
        SELECT c.id AS character_level_id, c.name AS character_level_name, c.sid AS character_level_sid, c.user_id = userId AS character_level_is_author,
               slot_1, slot_2, slot_3, slot_4, slot_5, slot_6, slot_7, slot_8, slot_9
        FROM attributes a
            JOIN caster_type_spell_slots ctss ON ctss.caster_type_id = a.id AND a.id = casterTypeId
            JOIN attributes c ON ctss.character_level_id = c.id;
    END IF;
END;;

DELIMITER ;

