DROP PROCEDURE IF EXISTS Creatures_Create_Companion;

DELIMITER ;;
CREATE PROCEDURE Creatures_Create_Companion(
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
    IN includeCharacterSkills BIT,

    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE creatureId INT UNSIGNED;

#     DECLARE EXIT HANDLER FOR SQLEXCEPTION
#     BEGIN
#         ROLLBACK;
#         SELECT -1 AS creature_id;
#     END;

#     START TRANSACTION;
    
    INSERT INTO creatures (name, creature_type_id, user_id)
    VALUES (creatureName, 5, userId);

    SET creatureId = (SELECT LAST_INSERT_ID());

    INSERT INTO companions (creature_id, monster_id, companion_type_id, max_hp, roll_over_damage, ac_include_characters_prof,
                            ac_misc, saving_throws_include_characters_prof, saving_throws_misc,
                            skill_checks_include_characters_prof, skill_checks_misc, attack_include_characters_prof,
                            attack_misc, damage_include_characters_prof, damage_misc, include_character_saves, include_character_skills)
    VALUES (creatureId, monsterId, companionTypeId, maxHp, rollOverDamage, acIncludeCharactersProf,
            acMisc, savingThrowsIncludeCharactersProf, savingThrowsMisc,
            skillChecksIncludeCharactersProf, skillChecksMisc, attackIncludeCharactersProf,
            attackMisc, damageIncludeCharactersProf, damageMisc, includeCharacterSaves, includeCharacterSkills);

#     COMMIT;

    SELECT creatureId AS creature_id;
END;;

DELIMITER ;

# CALL Creatures_Create_Character('test', 'test_description', 1, 'tst', 1);
