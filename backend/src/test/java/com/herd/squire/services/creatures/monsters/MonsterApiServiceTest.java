package com.herd.squire.services.creatures.monsters;

import com.herd.squire.services.monsters.api.MonsterApiService;
import org.junit.Test;

public class MonsterApiServiceTest {
    @Test
    public void readApiFile() throws Exception {
        new MonsterApiService().readApiFile();
    }
}