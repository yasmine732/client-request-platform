package com.stb.clientrequest.service;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class PasswordService {

    private static final String ALGORITHM =
            "PBKDF2WithHmacSHA256";

    private static final int ITERATIONS =
            120_000;

    private static final int KEY_LENGTH =
            256;

    private static final int SALT_LENGTH =
            16;

    private final SecureRandom secureRandom =
            new SecureRandom();

    public String hashPassword(
            String password
    ) {
        byte[] salt =
                new byte[SALT_LENGTH];

        secureRandom.nextBytes(salt);

        byte[] hash =
                generateHash(
                        password,
                        salt,
                        ITERATIONS
                );

        return "pbkdf2"
                + "$"
                + ITERATIONS
                + "$"
                + Base64.getEncoder()
                        .encodeToString(salt)
                + "$"
                + Base64.getEncoder()
                        .encodeToString(hash);
    }

    public boolean matches(
            String rawPassword,
            String encodedPassword
    ) {
        if (
                rawPassword == null
                || encodedPassword == null
                || encodedPassword.isBlank()
        ) {
            return false;
        }

        String[] parts =
                encodedPassword.split("\\$");

        if (
                parts.length != 4
                || !"pbkdf2".equals(parts[0])
        ) {
            return false;
        }

        try {
            int iterations =
                    Integer.parseInt(parts[1]);

            byte[] salt =
                    Base64.getDecoder()
                            .decode(parts[2]);

            byte[] expectedHash =
                    Base64.getDecoder()
                            .decode(parts[3]);

            byte[] actualHash =
                    generateHash(
                            rawPassword,
                            salt,
                            iterations
                    );

            return MessageDigest.isEqual(
                    expectedHash,
                    actualHash
            );

        } catch (IllegalArgumentException exception) {
            return false;
        }
    }

    private byte[] generateHash(
            String password,
            byte[] salt,
            int iterations
    ) {
        PBEKeySpec specification =
                new PBEKeySpec(
                        password.toCharArray(),
                        salt,
                        iterations,
                        KEY_LENGTH
                );

        try {
            SecretKeyFactory factory =
                    SecretKeyFactory.getInstance(
                            ALGORITHM
                    );

            return factory
                    .generateSecret(specification)
                    .getEncoded();

        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException(
                    "Impossible de sécuriser le mot de passe",
                    exception
            );

        } finally {
            specification.clearPassword();
        }
    }
}