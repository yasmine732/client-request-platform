package com.stb.clientrequest.service;

import com.stb.clientrequest.dto.LoginResponse;
import com.stb.clientrequest.enums.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class JwtService {

    private final JsonMapper jsonMapper;

    private final String secret;

    private final long expirationSeconds;

    public JwtService(
            JsonMapper jsonMapper,
            @Value("${clientflow.jwt.secret}")
            String secret,
            @Value("${clientflow.jwt.expiration-seconds:28800}")
            long expirationSeconds
    ) {
        this.jsonMapper = jsonMapper;
        this.secret = secret;
        this.expirationSeconds = expirationSeconds;
    }

    /*
     * GENERATION DU JWT
     */
    public String generateToken(
            LoginResponse user
    ) {

        try {

            long now =
                    Instant.now()
                            .getEpochSecond();

            long expiration =
                    now + expirationSeconds;

            Map<String, Object> header =
                    new LinkedHashMap<>();

            header.put(
                    "alg",
                    "HS256"
            );

            header.put(
                    "typ",
                    "JWT"
            );

            Map<String, Object> payload =
                    new LinkedHashMap<>();

            payload.put(
                    "userId",
                    user.userId()
            );

            payload.put(
                    "clientId",
                    user.clientId()
            );

            payload.put(
                    "nom",
                    user.nom()
            );

            payload.put(
                    "prenom",
                    user.prenom()
            );

            payload.put(
                    "email",
                    user.email()
            );

            payload.put(
                    "role",
                    user.role().name()
            );

            payload.put(
                    "iat",
                    now
            );

            payload.put(
                    "exp",
                    expiration
            );

            String encodedHeader =
                    encodeJson(header);

            String encodedPayload =
                    encodeJson(payload);

            String content =
                    encodedHeader
                            + "."
                            + encodedPayload;

            String signature =
                    sign(content);

            return content
                    + "."
                    + signature;

        } catch (Exception exception) {

            throw new IllegalStateException(
                    "Impossible de générer le jeton JWT",
                    exception
            );
        }
    }

    /*
     * VALIDATION DU JWT
     */
    public LoginResponse validateToken(
            String token
    ) {

        try {

            if (
                    token == null ||
                    token.isBlank()
            ) {

                throw new IllegalArgumentException(
                        "Jeton absent"
                );
            }

            String[] parts =
                    token.split("\\.");

            if (parts.length != 3) {

                throw new IllegalArgumentException(
                        "Jeton invalide"
                );
            }

            String content =
                    parts[0]
                            + "."
                            + parts[1];

            String expectedSignature =
                    sign(content);

            boolean signatureValide =
                    MessageDigest.isEqual(
                            expectedSignature
                                    .getBytes(
                                            StandardCharsets.UTF_8
                                    ),
                            parts[2]
                                    .getBytes(
                                            StandardCharsets.UTF_8
                                    )
                    );

            if (!signatureValide) {

                throw new IllegalArgumentException(
                        "Signature JWT invalide"
                );
            }

            byte[] payloadBytes =
                    Base64
                            .getUrlDecoder()
                            .decode(
                                    parts[1]
                            );

            Map<String, Object> payload =
                    jsonMapper.readValue(
                            payloadBytes,
                            new TypeReference<
                                    Map<String, Object>
                                    >() {
                            }
                    );

            long expiration =
                    ((Number) payload.get("exp"))
                            .longValue();

            long maintenant =
                    Instant.now()
                            .getEpochSecond();

            if (
                    expiration <
                    maintenant
            ) {

                throw new IllegalArgumentException(
                        "Jeton JWT expiré"
                );
            }

            Long userId =
                    getLong(
                            payload.get("userId")
                    );

            Long clientId =
                    getLong(
                            payload.get("clientId")
                    );

            String nom =
                    getString(
                            payload.get("nom")
                    );

            String prenom =
                    getString(
                            payload.get("prenom")
                    );

            String email =
                    getString(
                            payload.get("email")
                    );

            Role role =
                    Role.valueOf(
                            getString(
                                    payload.get("role")
                            )
                    );

            return new LoginResponse(
                    userId,
                    clientId,
                    nom,
                    prenom,
                    email,
                    role,
                    "Session active"
            );

        } catch (Exception exception) {

            throw new IllegalArgumentException(
                    "Jeton JWT invalide ou expiré",
                    exception
            );
        }
    }

    /*
     * ENCODAGE JSON -> BASE64 URL
     */
    private String encodeJson(
            Map<String, Object> data
    ) throws Exception {

        byte[] json =
                jsonMapper.writeValueAsBytes(
                        data
                );

        return Base64
                .getUrlEncoder()
                .withoutPadding()
                .encodeToString(json);
    }

    /*
     * SIGNATURE HMAC SHA-256
     */
    private String sign(
            String content
    ) throws Exception {

        Mac mac =
                Mac.getInstance(
                        "HmacSHA256"
                );

        SecretKeySpec key =
                new SecretKeySpec(
                        secret.getBytes(
                                StandardCharsets.UTF_8
                        ),
                        "HmacSHA256"
                );

        mac.init(key);

        byte[] signature =
                mac.doFinal(
                        content.getBytes(
                                StandardCharsets.UTF_8
                        )
                );

        return Base64
                .getUrlEncoder()
                .withoutPadding()
                .encodeToString(
                        signature
                );
    }

    private Long getLong(
            Object value
    ) {

        if (value == null) {
            return null;
        }

        return ((Number) value)
                .longValue();
    }

    private String getString(
            Object value
    ) {

        if (value == null) {
            return null;
        }

        return value.toString();
    }
}