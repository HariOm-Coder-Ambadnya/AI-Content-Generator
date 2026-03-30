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

    @PostConstruct
    public void initialize() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            InputStream serviceAccount;
            
            // Try as a file path first (standard for production/Docker mounts)
            java.io.File file = new java.io.File(serviceAccountPath);
            if (file.exists()) {
                serviceAccount = new java.io.FileInputStream(file);
            } else {
                // Fall back to Classpath (standard for local dev)
                try {
                    serviceAccount = new ClassPathResource(serviceAccountPath).getInputStream();
                } catch (IOException e) {
                    throw new IOException("Firebase service account file not found: " + serviceAccountPath);
                }
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            FirebaseApp.initializeApp(options);
        }
    }
}
