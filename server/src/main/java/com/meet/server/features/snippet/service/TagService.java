package com.meet.server.features.snippet.service;

import com.meet.server.features.snippet.model.Tag;
import com.meet.server.features.snippet.repository.TagRepository;
import com.meet.server.features.user.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
@Slf4j
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    public Tag findOrCreate(String name) {
        String normalizedName = name.toLowerCase(Locale.ROOT);
        return tagRepository.findByName(normalizedName)
                .orElseGet(() -> tagRepository.save(new Tag(normalizedName)));
    }

    public List<String> getUserTags(User user) {
        return tagRepository.findUserTags(user.getId());
    }
}
