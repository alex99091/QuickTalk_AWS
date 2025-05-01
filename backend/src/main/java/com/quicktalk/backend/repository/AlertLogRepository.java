package com.quicktalk.backend.repository;

import com.quicktalk.backend.entity.AlertLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AlertLogRepository extends MongoRepository<AlertLog, String> {
}
