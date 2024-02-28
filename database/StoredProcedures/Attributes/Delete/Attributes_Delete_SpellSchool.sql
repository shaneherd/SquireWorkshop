DROP PROCEDURE IF EXISTS Attributes_Delete_SpellSchool;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_SpellSchool(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE spellSchoolId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO spellSchoolId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF spellSchoolId IS NOT NULL THEN
        UPDATE spells s JOIN powers p ON s.power_id = p.id SET spell_school_id = NULL WHERE spell_school_id = spellSchoolId AND p.user_id = userId; # this should throw an exception if a match is found
        CALL Attributes_Delete_Common(spellSchoolId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE s FROM spell_schools s JOIN attributes a ON a.id = s.attribute_id WHERE attribute_id = spellSchoolId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = spellSchoolId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = spellSchoolId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Attributes_Delete_SpellSchool(265, 1, 0);
