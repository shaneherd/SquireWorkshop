DROP PROCEDURE IF EXISTS Creatures_Update_Companion;

DELIMITER ;;
CREATE PROCEDURE Creatures_Update_Companion(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,

    IN creatureName VARCHAR(150),
    IN companionTypeId TINYINT UNSIGNED,
    IN monsterId INT UNSIGNED,
    IN maxHp SMALLINT UNSIGNED,
    IN rollOverDamage BIT,
    IN acIncludeCharactersProf BIT,
    IN acMisc SMALLINT,
    IN savingThrowsIncludeCharactersProf BIT,
    IN savingThrowsMisc SMALLINT,
    IN skillChecksIncludeCharactersProf BIT,
    IN skillChecksMisc SMALLINT,
    IN attackIncludeCharactersProf BIT,
    IN attackMisc SMALLINT,
    IN damageIncludeCharactersProf BIT,
    IN damageMisc SMALLINT,
    IN includeCharacterSaves BIT,
    IN includeCharacterSkills BIT
)
BEGIN
    DECLARE valid BIT;

#     DECLARE EXIT HANDLER FOR SQLEXCEPTION
#     BEGIN
#         ROLLBACK;
#         SELECT 0 AS valid_request;
#     END;

#     START TRANSACTION;

    SET valid = (SELECT user_id FROM creatures WHERE id = creatureId) = userId;

    IF valid THEN
        UPDATE creatures
        SET name = creatureName
        WHERE user_id = userId AND id = creatureId;
        
        UPDATE companions
        SET monster_id = monsterId, companion_type_id = companionTypeId, max_hp = maxHp, roll_over_damage = rollOverDamage,
            ac_include_characters_prof = acIncludeCharactersProf, ac_misc = acMisc,
            saving_throws_include_characters_prof = savingThrowsIncludeCharactersProf, saving_throws_misc = savingThrowsMisc,
            skill_checks_include_characters_prof = skillChecksIncludeCharactersProf, skill_checks_misc = skillChecksMisc,
            attack_include_characters_prof = attackIncludeCharactersProf, attack_misc = attackMisc,
            damage_include_characters_prof = damageIncludeCharactersProf, damage_misc = damageMisc,
            include_character_saves = includeCharacterSaves, include_character_skills = includeCharacterSkills
        WHERE creature_id = creatureId;
    END IF;

#     COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL Creatures_Update_Character(265, 1, 'test-chanaaaged', 'test-changed-desc', 'ab');
