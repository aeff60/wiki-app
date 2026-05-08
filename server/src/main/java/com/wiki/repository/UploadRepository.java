package com.wiki.repository;

import com.wiki.entity.Upload;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UploadRepository extends JpaRepository<Upload, UUID> {
}
