package com.xoftex.parthub.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByUsername(String username);

  Optional<User> findByEmail(String email);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);

  
  List<User> findByCompanyIdOrderByFirstNameAsc(long companyId);

  int countByCompanyIdAndArchived(long companyId, boolean archived);

  int countByArchivedAndCompanyIdNot(boolean archived, long companyId);

  int countByCompanyIdNot(long companyId);


  int countByActivatedAndCompanyIdNot(boolean archived, long companyId);

  List<User> findByCompanyIdAndArchivedAndLastNameStartingWithIgnoreCase(long companyId, boolean archived,
      String lastName,
      Pageable withPage);

  int countByCompanyIdAndArchivedAndLastNameStartingWithIgnoreCase(long companyId, boolean archived,
      String lastName);

  List<User> findByLastNameAndCompanyIdAndArchived(String lastName, long companyId, boolean archived);

  long countByCompanyIdAndActivatedAndCreatedAtBetween(long companyId, boolean activated, Date from, Date to);

  long countByCompanyIdNotAndActivatedAndCreatedAtBetween(long companyId, boolean activated, Date from, Date to);

  long countByActivated(boolean activated);

  @Query(value = "SELECT UPPER(LEFT(last_name, 1)) AS last_name_first_letter, COUNT(*) AS letter_count FROM users WHERE part_market_only = 1 GROUP BY UPPER(LEFT(last_name, 1)) ORDER BY letter_count DESC, last_name_first_letter", nativeQuery = true)
  // @Query(value = "SELECT title as title, COUNT(*) as count FROM autoparts where
  // archived=0 GROUP BY title ORDER BY count DESC", nativeQuery = true)
  List<Object[]> reportLastNameCounts();

  Optional<User> findByVerificationCode(String uuid);

}
