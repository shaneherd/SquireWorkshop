DROP PROCEDURE IF EXISTS Attributes_Delete_WeaponType;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_WeaponType(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE weaponTypeId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO weaponTypeId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF weaponTypeId IS NOT NULL THEN
        UPDATE weapons w JOIN items i ON i.id = w.item_id SET weapon_type_id = NULL WHERE weapon_type_id = weaponTypeId AND i.user_id = userId; # this should throw an exception if a match is found
        CALL Attributes_Delete_Common(weaponTypeId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE wt FROM weapon_types wt JOIN attributes a ON a.id = wt.attribute_id WHERE attribute_id = weaponTypeId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = weaponTypeId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = weaponTypeId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Attributes_Delete_Ability(265, 1, 0);
