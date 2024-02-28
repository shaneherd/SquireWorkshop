package com.herd.squire.services.items;

import org.junit.Test;

import java.io.IOException;

public class MagicalItemApiServiceTest {
    @Test
    public void readApiFile() throws IOException {
        new MagicalItemApiService().processMagicalItems();
    }
}