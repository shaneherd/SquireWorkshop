package com.herd.squire.services.powers;

import org.junit.Test;

import java.io.IOException;

public class SpellApiServiceTest {

    @Test
    public void readApiFile() throws IOException {
        new SpellApiService().readApiFile();
    }
}