DROP PROCEDURE IF EXISTS Attributes_InUse;

DELIMITER ;;
CREATE PROCEDURE Attributes_InUse(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE attributeTypeId TINYINT UNSIGNED;
    SET attributeTypeId = (SELECT attribute_type_id FROM attributes WHERE id = attributeId);

    IF attributeTypeId = 1 THEN
        CALL Attributes_InUse_Ability(attributeId, userId);
    ELSEIF attributeTypeId = 2 THEN
        CALL Attributes_InUse_ArmorType(attributeId, userId);
    ELSEIF attributeTypeId = 3 THEN
        CALL Attributes_InUse_CasterType(attributeId, userId);
    ELSEIF attributeTypeId = 4 THEN
        CALL Attributes_InUse_Condition(attributeId, userId);
    ELSEIF attributeTypeId = 5 THEN
        CALL Attributes_InUse_DamageType(attributeId, userId);
    ELSEIF attributeTypeId = 6 THEN
        CALL Attributes_InUse_Language(attributeId, userId);
    ELSEIF attributeTypeId = 7 THEN
        CALL Attributes_InUse_CharacterLevel(attributeId, userId);
    ELSEIF attributeTypeId = 8 THEN
        CALL Attributes_InUse_Skill(attributeId, userId);
    ELSEIF attributeTypeId = 9 THEN
        CALL Attributes_InUse_ToolCategory(attributeId, userId);
    ELSEIF attributeTypeId = 10 THEN
        CALL Attributes_InUse_WeaponProperty(attributeId, userId);
    ELSEIF attributeTypeId = 11 THEN
        CALL Attributes_InUse_WeaponType(attributeId, userId);
    ELSEIF attributeTypeId = 12 THEN
        CALL Attributes_InUse_AreaOfEffect(attributeId, userId);
    ELSEIF attributeTypeId = 13 THEN
        CALL Attributes_InUse_SpellSchool(attributeId, userId);
    ELSEIF attributeTypeId = 14 THEN
        CALL Attributes_InUse_Alignment(attributeId, userId);
    ELSEIF attributeTypeId = 15 THEN
        CALL Attributes_InUse_DeityCategory(attributeId, userId);
    ELSEIF attributeTypeId = 16 THEN
        CALL Attributes_InUse_Deity(attributeId, userId);
#     ELSEIF attributeTypeId = 17 THEN
#         CALL Attributes_InUse_Misc(attributeId, userId);
#     ELSEIF attributeTypeId = 18 THEN
#         CALL Attributes_InUse_Characteristic(attributeId, userId);
    END IF;
END;;

DELIMITER ;

CALL Attributes_InUse(249, 1);
