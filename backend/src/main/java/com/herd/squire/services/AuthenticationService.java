package com.herd.squire.services;

import com.herd.squire.models.user.User;
import com.herd.squire.models.user.UserRole;
import com.herd.squire.utilities.AuthenticationFilter;
import com.herd.squire.utilities.SquireProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.RandomStringUtils;

import javax.crypto.spec.SecretKeySpec;
import javax.ws.rs.core.HttpHeaders;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.regex.Pattern;

public class AuthenticationService {
    private static final int SALT_LENGTH = 10;
    private static final String SHA_TYPE = "SHA-256";
    private static final int JWT_EXPIRATION = 3600000; // 60 minutes
    public static final int LOCKOUT_LOGIN_THRESHOLD = 5;

    protected AuthenticationService() {
    }

    /************* Authentication *************/

    public static User authenticate(String username, String password) throws Exception {
        User user = UserService.getUser(username);
        if (user == null) {
            throw new Exception("Invalid Username or Password");
        }
        if (user.isLocked()) {
            throw new Exception("Account locked");
        }
        byte[] salt = getSalt(user.getSalt());
        String passwordHash = getSecurePassword(password, salt);
        if (!passwordHash.equals(user.getPassword())) {
            UserService.failedLogin(username);

            if (user.getNumFailedLogins() + 1 >= LOCKOUT_LOGIN_THRESHOLD) {
                lockAccount(user);
                throw new Exception("Account locked");
            }

            throw new Exception("Invalid Username or Password");
        }
        return user;
    }

    private static void lockAccount(User user) throws Exception {
        byte[] salt = getSalt(user.getSalt());
        String unlockToken = getToken(user.getEmail(), salt);
        UserService.lockAccount(user.getUsername());
        UserService.createUserUnlockAccount(user.getUsername(), unlockToken);
        EmailService.sendAccountLockedEmail(user.getEmail(), unlockToken);
    }

    public static String unlockAccount(String unlockToken) throws Exception {
        String username = UserService.getUsernameByUnlockToken(unlockToken);
        if (username.equals("")) {
            throw new Exception("Invalid Token");
        }
        User user = UserService.getUser(username);
        if (user == null) {
            throw new Exception("Failed to find user");
        }
        byte[] salt = getSalt(user.getSalt());
        String expectedUnlockToken = getToken(user.getEmail(), salt);
        if (!expectedUnlockToken.equals(unlockToken)) {
            throw new Exception("Invalid Token");
        }
        UserService.unlockAccount(username);
        UserService.deleteUnlockToken(unlockToken);
        return username;
    }

    /************* Create User *************/

    public static int createUser(String username, String password, String email) throws Exception {
        String allowSignup = SquireProperties.getProperty("allowSignup");
        if (allowSignup != null && allowSignup.equals("false")) {
            throw new Exception("Sign up is disabled.");
        }

        validatePassword(password);
        validateUsername(username);
        String randomSalt = RandomStringUtils.random(SALT_LENGTH, true, true);
        byte[] salt = getSalt(randomSalt);
        String passwordHash = getSecurePassword(password, salt);
        int id = UserService.createUser(username, passwordHash, randomSalt, email);
        if (id == -1) {
            throw new Exception("Failed to create user");
        }

        return id;
    }

    /************* Email *************/

    public static void changeEmail(int userId, String password, String email) throws Exception {
        User user = UserService.getUser(userId);
        if (user == null) {
            throw new Exception("Invalid user");
        }
        try {
            user = authenticate(user.getUsername(), password);
        } catch (Exception e) {
            throw new Exception("Invalid Password");
        }
        UserService.changeEmail(userId, email);
    }

    protected static String getToken(String email, String salt) {
        return getToken(email, getSalt(salt));
    }

    protected static String getToken(String email, byte[] salt) {
        if (email == null) {
            return "";
        }
        String token = getSecurePassword(email, salt);
        if (token.length() > 45) {
            return token.substring(0, 45);
        }
        return token;
    }

    public static String verifyUserEmail(String verifyToken) throws Exception {
        String username = UserService.getUsernameByVerifyToken(verifyToken);
        if (username.equals("")) {
            throw new Exception("Invalid Token");
        }
        User user = UserService.getUser(username);
        if (user == null) {
            throw new Exception("Failed to find user");
        }
        byte[] salt = getSalt(user.getSalt());
        String expectedVerifyToken = getToken(user.getEmail(), salt);
        if (!expectedVerifyToken.equals(verifyToken)) {
            throw new Exception("Invalid Token");
        }
        UserService.emailVerified(username);
        UserService.deleteVerifyToken(verifyToken);
        return username;
    }

    /************* Password Management *************/

    public static void changePassword(String username, String originalPassword, String newPassword) throws Exception {
        User user;
        try {
            user = authenticate(username, originalPassword);
        } catch (Exception e) {
            throw new Exception("Invalid Password");
        }
        validatePassword(newPassword);
        byte[] salt = getSalt(user.getSalt());
        String passwordHash = getSecurePassword(newPassword, salt);
        UserService.changePassword(username, passwordHash);
    }

    public static void forgotUsername(String email) throws Exception {
        User user = UserService.getUserByEmail(email);
        if (user == null) {
            throw new Exception("Invalid email");
        }
        String username = user.getUsername();
        EmailService.sendForgotUsernameEmail(email, username);
    }

    public static void forgotPassword(String email) throws Exception {
        User user = UserService.getUserByEmail(email);
        if (user == null) {
            throw new Exception("Invalid email");
        }
        String resetToken = getToken(email, user.getSalt());
        UserService.createResetPasswordRequest(user.getUsername(), resetToken);
        EmailService.sendForgotPasswordEmail(email, resetToken);
    }

    public static String resetPassword(String resetToken, String newPassword) throws Exception {
        validatePassword(newPassword);
        String username = UserService.getUsernameByResetToken(resetToken);
        if (username.equals("")) {
            throw new Exception("Invalid Token");
        }
        User user = UserService.getUser(username);
        if (user == null) {
            throw new Exception("Failed to find user");
        }
        if (user.isLocked()) {
            throw new Exception("Account locked");
        }
        byte[] salt = getSalt(user.getSalt());
        String expectedVerifyToken = getToken(user.getEmail(), salt);
        if (!expectedVerifyToken.equals(resetToken)) {
            throw new Exception("Invalid Token");
        }
        String passwordHash = getSecurePassword(newPassword, salt);
        UserService.changePassword(username, passwordHash);
        UserService.deleteResetToken(resetToken);
        return username;
    }

    private static byte[] getSalt(String saltString) {
        return Base64.encodeBase64(saltString.getBytes());
    }

    public static String getSecurePassword(String passwordToHash, String saltString) {
        byte[] salt = getSalt(saltString);
        return getSecurePassword(passwordToHash, salt);
    }

    private static String getSecurePassword(String passwordToHash, byte[] salt) {
        String generatedPassword = "";
        try {
            MessageDigest md = MessageDigest.getInstance(SHA_TYPE);
            md.update(salt);
            byte[] bytes = md.digest(passwordToHash.getBytes());
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < bytes.length; i++) {
                sb.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));
            }
            generatedPassword = sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return generatedPassword;
    }

    protected static void validatePassword(String password) throws Exception {
        if (password == null || password.length() < 8) {
            throw new Exception("Must be at least 8 characters");
        }

        if (password.length() > 20) {
            throw new Exception("Must be at most 20 characters");
        }

        Pattern upper = Pattern.compile("[A-Z ]");
        if (!upper.matcher(password).find()) {
            throw new Exception("Must contain at least 1 in capital case");
        }

        Pattern lower = Pattern.compile("[a-z ]");
        if (!lower.matcher(password).find()) {
            throw new Exception("Must contain at least 1 in lower case");
        }

        Pattern digit = Pattern.compile("[0-9 ]");
        if (!digit.matcher(password).find()) {
            throw new Exception("Must contain at least 1 number");
        }
    }

    protected static void validateUsername(String username) throws Exception {
        if (username == null || username.length() < 5) {
            throw new Exception("Must be at least 5 characters");
        }

        if (username.length() > 20) {
            throw new Exception("Must be at most 20 characters");
        }

        if (username.toLowerCase().contains("squire") || username.toLowerCase().contains("admin")) {
            throw new Exception("Username already in use");
        }
    }

    /************* JWT *************/

    public static String getJWT(String id) {
        return getJWT(id, null);
    }

    public static String getJWT(User user) {
        return getJWT(user, null);
    }

    public static String getJWT(String id, String adminId) {
        try {
            User user = UserService.getUser(Integer.parseInt(id));
            return getJWT(user, adminId);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String getJWT(User user, String adminId) {
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

        String jwtSecret = SquireProperties.getProperty("jwtSecret");
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(jwtSecret);
        Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

        JwtBuilder builder = Jwts.builder()
                .setId(String.valueOf(user.getId()))
                .claim("userRole", user.getUserRole().toString())
                .claim("adminId", adminId)
                .signWith(signatureAlgorithm, signingKey);

        long nowMillis = System.currentTimeMillis();
        long expMillis = nowMillis + JWT_EXPIRATION;
        Date exp = new Date(expMillis);
        builder.setExpiration(exp);

        return builder.compact();
    }

    public static String refreshJWT(HttpHeaders headers) {
        String jwtSecret = SquireProperties.getProperty("jwtSecret");
        String jwt = AuthenticationFilter.getToken(headers);
        Claims claims = Jwts.parser()
                .setSigningKey(DatatypeConverter.parseBase64Binary(jwtSecret))
                .parseClaimsJws(jwt).getBody();
        String id = claims.getId();
        return getJWT(id);
    }

    public static boolean isValid(String jwt) {
        try {
            // verify the key is valid
            String jwtSecret = SquireProperties.getProperty("jwtSecret");
            Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(jwt);

            // verify the key isn't expired
            Claims claims = Jwts.parser()
                    .setSigningKey(DatatypeConverter.parseBase64Binary(jwtSecret))
                    .parseClaimsJws(jwt).getBody();
            Date expiration = claims.getExpiration();
            long nowMillis = System.currentTimeMillis();
            Date now = new Date(nowMillis);

            return now.getTime() < expiration.getTime();
        } catch (Exception e) {
            return false;
        }
    }

    private static Claims getClaims(HttpHeaders headers) {
        String jwtSecret = SquireProperties.getProperty("jwtSecret");
        String jwt = AuthenticationFilter.getToken(headers);

        return Jwts.parser()
                .setSigningKey(DatatypeConverter.parseBase64Binary(jwtSecret))
                .parseClaimsJws(jwt).getBody();
    }

    public static int getUserId(HttpHeaders headers) {
        Claims claims = getClaims(headers);
        String id = claims.getId();
        if (id == null || id.equals("")) {
            id = "-1";
        }
        return Integer.parseInt(id);
    }

    public static UserRole getUserRole(HttpHeaders headers) {
        Claims claims = getClaims(headers);
        String userRoleString = (String) claims.get("userRole");
        return UserRole.valueOf(userRoleString);
    }

    public static int getAdminId(HttpHeaders headers) {
        Claims claims = getClaims(headers);
        String id = (String) claims.get("adminId");
        if (id == null || id.equals("")) {
            id = "-1";
        }
        return Integer.parseInt(id);
    }

    public static int getUserId(HttpHeaders headers, String id) throws Exception {
        int userId = getUserId(headers);
        if (!String.valueOf(userId).equals(id)) {
            throw new Exception("Not allowed to update the specified user");
        }
        return userId;
    }

    public static void authorizedToModify(HttpHeaders httpHeaders, String id) throws Exception {
        getUserId(httpHeaders, id);
    }
}
