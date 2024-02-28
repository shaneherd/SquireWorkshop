DROP PROCEDURE IF EXISTS Monsters_Delete;

DELIMITER ;;
CREATE PROCEDURE Monsters_Delete(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE monsterId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE battleMonsterId INT UNSIGNED;
    DECLARE encounterCreatureId INT UNSIGNED;
    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT battle_monster_id, encounter_creature_id
                            FROM temp_creatures ;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creatures
    (
        battle_monster_id INT UNSIGNED NOT NULL,
        encounter_creature_id INT UNSIGNED NOT NULL
    );

    SELECT id, user_id = userId
    INTO monsterId, isOwner
    FROM monsters
    WHERE user_id IN (0, userId) AND id = creatureId AND user_id;

    IF monsterId IS NOT NULL THEN
        DELETE mf FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id JOIN monster_features mf ON mf.monster_power_id = mp.id WHERE m.id = creatureId AND m.user_id = userId;
        DELETE mad FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id JOIN monster_actions ma ON ma.monster_power_id = mp.id JOIN monster_action_damages mad ON mad.monster_action_id = ma.monster_power_id WHERE m.id = creatureId AND m.user_id = userId;
        DELETE ma FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id JOIN monster_actions ma ON ma.monster_power_id = mp.id WHERE m.id = creatureId AND m.user_id = userId;
        DELETE ml FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id JOIN monster_power_limited_uses ml ON ml.monster_power_id = mp.id WHERE m.id = creatureId AND m.user_id = userId;
        DELETE mp FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id WHERE m.id = creatureId AND m.user_id = userId;

        DELETE s FROM monsters m JOIN encounter_monster_groups g ON g.monster_id = m.id AND m.id = creatureId JOIN encounter_monsters s ON s.encounter_monster_group_id = g.id JOIN encounters e ON g.encounter_id = e.id WHERE e.user_id = userId;
        DELETE g FROM monsters m JOIN encounter_monster_groups g ON g.monster_id = m.id AND m.id = creatureId JOIN encounters e ON g.encounter_id = e.id WHERE e.user_id = userId;

        # delete battle creatures
        INSERT INTO temp_creatures (battle_monster_id, encounter_creature_id)
        SELECT bm.creature_id, ec.id
        FROM battle_monsters bm
            JOIN creatures c ON c.id = bm.creature_id
            JOIN encounter_creatures ec ON ec.creature_id = c.id
        WHERE c.user_id = userId AND bm.monster_id = monsterId;

        OPEN curs;
        WHILE more_rows DO
                FETCH curs INTO battleMonsterId, encounterCreatureId;
                IF more_rows THEN
                    CALL Creatures_Delete_BattleMonster(battleMonsterId, userId);
                    DELETE FROM encounter_creatures WHERE id = encounterCreatureId;
                END IF;
            END WHILE;
        CLOSE curs;

        IF isOwner THEN
            DELETE mpp FROM monster_powers_public mpp JOIN monster_powers mp ON mp.id = mpp.monster_power_id JOIN monsters m ON m.id = mp.monster_id WHERE m.id = creatureId;
            DELETE mpp FROM monster_powers_private mpp JOIN monster_powers mp ON mp.id = mpp.monster_power_id JOIN monsters m ON m.id = mp.monster_id WHERE m.id = creatureId;
            DELETE FROM monsters_public WHERE monster_id = creatureId;
            DELETE FROM monsters_private WHERE monster_id = creatureId;
            UPDATE monsters SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = creatureId;

            DELETE ms FROM monster_speeds ms JOIN monsters m ON ms.monster_id = m.id WHERE id = monsterId AND m.user_id = userId;
            DELETE mdm FROM monster_damage_modifiers mdm JOIN monsters m ON mdm.monster_id = m.id WHERE id = monsterId AND m.user_id = userId;
            DELETE ms FROM monster_senses ms JOIN monsters m ON ms.monster_id = m.id WHERE id = monsterId AND m.user_id = userId;
            DELETE mci FROM monster_condition_immunities mci JOIN monsters m ON mci.monster_id = m.id WHERE id = monsterId AND m.user_id = userId;
            DELETE map FROM monster_attribute_profs map JOIN monsters m ON map.monster_id = m.id WHERE id = monsterId AND m.user_id = userId;
            DELETE mip FROM monster_item_profs mip JOIN monsters m ON mip.monster_id = m.id WHERE id = monsterId AND m.user_id = userId;
            DELETE mss FROM monster_spell_slots mss JOIN monsters m ON mss.monster_id = m.id WHERE id = monsterId AND m.user_id = userId;
            DELETE mas FROM monster_ability_scores mas JOIN monsters m ON mas.monster_id = m.id WHERE id = monsterId AND m.user_id = userId;
            DELETE ms FROM monster_spells ms JOIN monsters m ON ms.monster_id = m.id WHERE id = monsterId AND m.user_id = userId;
            DELETE mis FROM monster_innate_spells mis JOIN monsters m ON mis.monster_id = m.id WHERE id = monsterId AND m.user_id = userId;
            DELETE mi FROM monster_items mi JOIN monsters m ON mi.monster_id = m.id WHERE id = monsterId AND m.user_id = userId;
            DELETE FROM monsters WHERE user_id = userId AND id = monsterId;
        ELSE
            DELETE FROM monsters_shared WHERE user_id = userId AND monster_id = monsterId;
        END IF;
    END IF;

    COMMIT;

    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
    SELECT 1 AS result;
END;;

DELIMITER ;

