DROP PROCEDURE IF EXISTS Attributes_Delete_CasterType;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_CasterType(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE casterTypeId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO casterTypeId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF casterTypeId IS NOT NULL THEN
        UPDATE classes cl JOIN characteristics c ON c.id = cl.characteristic_id SET spellcaster_type_id = NULL WHERE spellcaster_type_id = casterTypeId AND user_id = userId;
        UPDATE monsters m SET caster_type_id = NULL WHERE caster_type_id = casterTypeId AND user_id = userId;
        CALL Attributes_Delete_Common(casterTypeId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE ss FROM caster_type_spell_slots ss JOIN attributes a ON a.id = ss.caster_type_id WHERE caster_type_id = casterTypeId AND user_id = userId;
            DELETE ct FROM caster_types ct JOIN attributes a ON a.id = ct.attribute_id WHERE attribute_id = casterTypeId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = casterTypeId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = casterTypeId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Attributes_Delete_CasterType(265, 1, 0);
