DROP PROCEDURE IF EXISTS Attributes_Create_CasterType;

DELIMITER ;;
CREATE PROCEDURE Attributes_Create_CasterType(
    IN attributeName VARCHAR(45),
    IN attributeDescription VARCHAR(1000),
    IN multiclassWeight TINYINT UNSIGNED,
    IN roundUp BIT,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE attributeId INT UNSIGNED;

#     DECLARE EXIT HANDLER FOR SQLEXCEPTION
#     BEGIN
#         ROLLBACK;
#         SELECT -1 AS attribute_id;
#     END;

#     START TRANSACTION;

    INSERT INTO `attributes` (`name`, `description`, `attribute_type_id`, `user_id`)
    VALUES (attributeName, attributeDescription, 3, userId);

    SET attributeId = (SELECT LAST_INSERT_ID());

    INSERT INTO caster_types (attribute_id, multiclass_weight, round_up)
    VALUES (attributeId, multiclassWeight, roundUp);

#     COMMIT;

    SELECT attributeId AS attribute_id;
END;;

DELIMITER ;

# CALL Attributes_Create_CasterType('test', 'test_description', 1, 'tst', 1);
