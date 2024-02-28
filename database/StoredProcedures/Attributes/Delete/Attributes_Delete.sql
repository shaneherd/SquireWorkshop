DROP PROCEDURE IF EXISTS Attributes_Delete;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE attributeTypeId TINYINT UNSIGNED;

    SET attributeTypeId = (SELECT attribute_type_id FROM attributes WHERE id = attributeId);

    IF attributeTypeId = 1 THEN
        CALL Attributes_Delete_Ability(attributeId, userId);
    ELSEIF attributeTypeId = 2 THEN
        CALL Attributes_Delete_ArmorType(attributeId, userId);
    ELSEIF attributeTypeId = 3 THEN
        CALL Attributes_Delete_CasterType(attributeId, userId);
    ELSEIF attributeTypeId = 4 THEN
        CALL Attributes_Delete_Condition(attributeId, userId);
    ELSEIF attributeTypeId = 5 THEN
        CALL Attributes_Delete_DamageType(attributeId, userId);
    ELSEIF attributeTypeId = 6 THEN
        CALL Attributes_Delete_Language(attributeId, userId);
    ELSEIF attributeTypeId = 7 THEN
        CALL Attributes_Delete_CharacterLevel(attributeId, userId);
    ELSEIF attributeTypeId = 8 THEN
        CALL Attributes_Delete_Skill(attributeId, userId);
    ELSEIF attributeTypeId = 9 THEN
        CALL Attributes_Delete_ToolCategory(attributeId, userId);
    ELSEIF attributeTypeId = 10 THEN
        CALL Attributes_Delete_WeaponProperty(attributeId, userId);
    ELSEIF attributeTypeId = 11 THEN
        CALL Attributes_Delete_WeaponType(attributeId, userId);
    ELSEIF attributeTypeId = 12 THEN
        CALL Attributes_Delete_AreaOfEffect(attributeId, userId);
    ELSEIF attributeTypeId = 13 THEN
        CALL Attributes_Delete_SpellSchool(attributeId, userId);
    ELSEIF attributeTypeId = 14 THEN
        CALL Attributes_Delete_Alignment(attributeId, userId);
    ELSEIF attributeTypeId = 15 THEN
        CALL Attributes_Delete_DeityCategory(attributeId, userId);
    ELSEIF attributeTypeId = 16 THEN
        CALL Attributes_Delete_Deity(attributeId, userId);
    END IF;
END;;

DELIMITER ;

# CALL Attributes_Delete(265, 1, 0, 0);
