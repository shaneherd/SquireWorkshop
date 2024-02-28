package com.herd.squire;

import com.herd.squire.rest.AuthenticationRestTest;
import com.herd.squire.rest.UserRestTest;
import com.herd.squire.services.AuthenticationServiceTest.AuthenticationServiceTest;
import com.herd.squire.services.TranslateServiceTest;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)

@Suite.SuiteClasses({
        AuthenticationServiceTest.class,
        TranslateServiceTest.class,
        AuthenticationRestTest.class,
        UserRestTest.class
})
public class UnitTestSuite {
}
