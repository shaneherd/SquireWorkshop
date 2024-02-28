package com.herd.squire.services.AuthenticationServiceTest;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)

@Suite.SuiteClasses({
        AuthenticationServiceTestAuthenticate.class,
        AuthenticationServiceTestUnlockAccount.class,
        AuthenticationServiceTestCreateUser.class,
        AuthenticationServiceTestEmail.class,
        AuthenticationServiceTestPassword.class,
        AuthenticationServiceTestJWT.class
})
public class AuthenticationServiceTest {
}