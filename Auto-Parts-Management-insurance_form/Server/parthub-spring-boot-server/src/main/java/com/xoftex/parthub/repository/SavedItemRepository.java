package com.xoftex.parthub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.SavedItem;

@Repository
public interface SavedItemRepository extends JpaRepository<SavedItem, Long> {

  List<SavedItem> findByUserId(long userId);

  long countByUserId(long user);

  Optional<SavedItem> findByUserIdAndAutopartId(long userId, long autopartId);

  List<SavedItem> findByAutopartId(long autopartId);

}
