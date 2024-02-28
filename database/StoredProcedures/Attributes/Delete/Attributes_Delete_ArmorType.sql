DROP PROCEDURE IF EXISTS Attributes_Delete_ArmorType;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_ArmorType(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE armorTypeId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO armorTypeId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF armorTypeId IS NOT NULL THEN
        UPDATE armors a JOIN items i ON i.id = a.item_id SET armor_type_id = NULL WHERE armor_type_id = armorTypeId AND user_id = userId; # This should throw an exception if a match is found
        CALL Attributes_Delete_Common(armorTypeId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE t FROM armor_types t JOIN attributes a ON a.id = t.attribute_id WHERE attribute_id = armorTypeId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = armorTypeId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = armorTypeId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Attributes_Delete_Ability(265, 1, 0);
