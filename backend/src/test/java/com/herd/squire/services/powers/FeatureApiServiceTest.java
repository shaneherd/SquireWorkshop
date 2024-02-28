package com.herd.squire.services.powers;

import org.junit.Test;

import java.io.IOException;

public class FeatureApiServiceTest {

    @Test
    public void readApiFile() throws IOException {
        new FeatureApiService().readApiFile();
    }
}