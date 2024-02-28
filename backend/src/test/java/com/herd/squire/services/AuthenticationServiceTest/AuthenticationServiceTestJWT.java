package com.herd.squire.services.AuthenticationServiceTest;

import com.herd.squire.services.AuthenticationService;
import com.herd.squire.utilities.AuthenticationFilter;
import com.herd.squire.utilities.SquireProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PowerMockIgnore;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import static org.junit.Assert.*;

@RunWith(PowerMockRunner.class)
@PrepareForTest({AuthenticationService.class, AuthenticationFilter.class})
@PowerMockIgnore({"javax.crypto.*" })
public class AuthenticationServiceTestJWT {
    @Before
    public void setUp() throws Exception {
        SquireProperties.setTesting(true);
        PowerMockito.mockStatic(AuthenticationFilter.class);
    }

    /**************** Get JWT ***************/

    @Test
    public void getJwtSuccess() {
        String userId = "1";
        String jwt = AuthenticationService.getJWT(userId);
        assertNotNull(jwt);
        assertTrue(jwt.length() > 0);
    }

    /**************** Refresh JWT ***************/

    @Test
    public void refreshJWTSuccess() {
        String userId = "1";
        String jwt = AuthenticationService.getJWT(userId);
        Mockito.when(AuthenticationFilter.getToken(Mockito.any())).thenReturn(jwt);

        String refreshedJwt = AuthenticationService.refreshJWT(null);
        assertNotNull(refreshedJwt);
        assertTrue(refreshedJwt.length() > 0);
    }

    /**************** Is Valid ***************/

    @Test
    public void valid() {
        String userId = "1";
        String jwt = AuthenticationService.getJWT(userId);

        boolean valid = AuthenticationService.isValid(jwt);
        assertTrue(valid);
    }

    @Test
    public void invalid() {
        String userId = "1";
        String jwt = AuthenticationService.getJWT(userId);

        boolean valid = AuthenticationService.isValid(jwt + "changed");
        assertFalse(valid);
    }

    @Test
    public void expired() {
        String userId = "1";
        String jwt = AuthenticationService.getJWT(userId);

        PowerMockito.mockStatic(System.class);
        Mockito.when(System.currentTimeMillis()).thenReturn(Long.MAX_VALUE);
        boolean valid = AuthenticationService.isValid(jwt);
        assertFalse(valid);
    }

    /**************** Get User Id ***************/

    @Test
    public void getUserIdSuccess() {
        String userId = "1";
        String jwt = AuthenticationService.getJWT(userId);
        Mockito.when(AuthenticationFilter.getToken(Mockito.any())).thenReturn(jwt);

        try {
            int actualUserId = AuthenticationService.getUserId(null, userId);
            assertEquals(userId, String.valueOf(actualUserId));
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void getUserIdNotAuthorized() {
        String userId = "1";
        String jwt = AuthenticationService.getJWT(userId);
        Mockito.when(AuthenticationFilter.getToken(Mockito.any())).thenReturn(jwt);

        try {
            AuthenticationService.getUserId(null, userId + "1");
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Not allowed to update the specified user", message);
        }
    }

    /**************** Authorized To Modify ***************/

    @Test
    public void authorizedToModify() {
        String userId = "1";
        String jwt = AuthenticationService.getJWT(userId);
        Mockito.when(AuthenticationFilter.getToken(Mockito.any())).thenReturn(jwt);

        try {
            AuthenticationService.authorizedToModify(null, userId);
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void notAuthorizedToModify() {
        String userId = "1";
        String jwt = AuthenticationService.getJWT(userId);
        Mockito.when(AuthenticationFilter.getToken(Mockito.any())).thenReturn(jwt);

        try {
            AuthenticationService.authorizedToModify(null, userId + "1");
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Not allowed to update the specified user", message);
        }
    }
}
