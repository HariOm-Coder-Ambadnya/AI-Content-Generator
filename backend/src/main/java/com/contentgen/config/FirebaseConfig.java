package com.contentgen.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.service-account-path:firebase-service-account.json}")
    private String serviceAccountPath;

    @Value("${firebase.service-account-json:}")
    private String serviceAccountJson;

    @PostConstruct
    public void initialize() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            InputStream serviceAccount = null;

            // 1. Try JSON string from environment first (most flexible for cloud platforms)
            if (serviceAccountJson != null && !serviceAccountJson.trim().isEmpty()) {
                System.out.println("Firebase service account: Loading from FIREBASE_SERVICE_ACCOUNT_JSON environment variable.");
                serviceAccount = new java.io.ByteArrayInputStream(serviceAccountJson.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            } else {
                // 2. Try as a file path (standard for Docker mounts or local filesystem)
                java.io.File file = new java.io.File(serviceAccountPath);
                if (file.exists()) {
                    System.out.println("Firebase service account: Loading from file path: " + serviceAccountPath);
                    serviceAccount = new java.io.FileInputStream(file);
                } else {
                    // 3. Fall back to Classpath (standard for local dev)
                    System.out.println("Firebase service account: Attempting to load from classpath: " + serviceAccountPath);
                    try {
                        serviceAccount = new ClassPathResource(serviceAccountPath).getInputStream();
                    } catch (IOException e) {
                        throw new IOException("Firebase service account not found! Checked: " +
                                "environment string (empty), file path (" + file.getAbsolutePath() + "), and classpath.");
                    }
                }
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            FirebaseApp.initializeApp(options);
            System.out.println("Firebase initialized successfully.");
        }
    }
}
