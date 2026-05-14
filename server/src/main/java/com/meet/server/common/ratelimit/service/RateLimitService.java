package com.meet.server.common.ratelimit.service;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RateLimitService {

    private static final long AUTHENTICATED_CAPACITY = 200;
    private static final long ANONYMOUS_CAPACITY = 30;
    private static final Duration WINDOW = Duration.ofMinutes(1);
    private final ProxyManager<String> proxyManager;

    public ConsumptionProbe tryConsume(String bucketKey, boolean isAuthenticated) {
        BucketConfiguration config = buildConfig(isAuthenticated);
        Bucket bucket = proxyManager.builder()
                .build(bucketKey, () -> config);
        return bucket.tryConsumeAndReturnRemaining(1);
    }

    private BucketConfiguration buildConfig(boolean isAuthenticated) {
        long capacity = isAuthenticated ? AUTHENTICATED_CAPACITY : ANONYMOUS_CAPACITY;
        return BucketConfiguration.builder()
                .addLimit(limit -> limit
                        .capacity(capacity)
                        .refillIntervally(capacity, WINDOW)
                )
                .build();
    }
}
