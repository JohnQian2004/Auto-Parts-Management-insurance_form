package com.xoftex.parthub.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Vehicle;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

        List<Vehicle> findByCustomerId(long id);
        // Optional<Vehicle> findByUserId(long userId);

        List<Vehicle> findByYearAndMakeAndModelAndColor(int year, String make, String model, String color);

        List<Vehicle> findByYearAndMakeAndModel(int year, String make, String model);

        List<Vehicle> findByYearAndMake(int year, String make);

        List<Vehicle> findByYear(int year);

        List<Vehicle> findByYearAndMakeAndModelAndColorAndCompanyIdAndArchived(int year, String make, String model,
                        String color,
                        long companyId, boolean archived);

        List<Vehicle> findByYearAndMakeAndModelAndCompanyIdAndArchived(int year, String make, String model,
                        long companyId,
                        boolean archived);

        List<Vehicle> findByYearAndMakeAndCompanyIdAndArchived(int year, String make, long companyId, boolean archived);

        List<Vehicle> findByYearAndCompanyIdAndArchived(int year, long companyId, boolean archived);

        List<Vehicle> findByCompanyIdAndArchived(long companyId, boolean archived, Pageable withPage);

        List<Vehicle> findByCompanyIdAndArchivedOrderBySequenceNumberAsc(long companyId, boolean archived,
                        Pageable withPage);

        List<Vehicle> findByCompanyIdAndArchived(long companyId, boolean archived);

        List<Vehicle> findByCompanyIdAndArchivedOrderBySequenceNumberAsc(long companyId, boolean archived);

        // @Query(value = "SELECT STATUS as status, COUNT(*) as count FROM vehicles
        // GROUP BY STATUS", nativeQuery = true)
        // List<Object[]> reportStatus();
        List<Vehicle> findByCompanyIdAndArchivedAndSpecialOrderBySequenceNumberAsc(long companyId, boolean archived,
                        boolean special);

        @Query(value = "SELECT STATUS as status, COUNT(*) as count FROM vehicles where archived=0 and company_id = :companyId GROUP BY STATUS ORDER BY count asc", nativeQuery = true)
        List<Object[]> reportStatus(@Param("companyId") long companyId);

        @Query(value = "SELECT STATUS as status, COUNT(*) as count FROM vehicles where archived=0 and special=1 and company_id = :companyId GROUP BY STATUS ORDER BY count asc", nativeQuery = true)
        List<Object[]> reportStatusSpecial(@Param("companyId") long companyId);

        @Query(value = "SELECT job_request_type as status, COUNT(*) as count FROM vehicles where archived=0 and company_id = :companyId GROUP BY job_request_type ORDER BY count asc", nativeQuery = true)
        List<Object[]> reportJobRequestType(@Param("companyId") long companyId);

        @Query(value = "SELECT job_request_type as status, COUNT(*) as count FROM vehicles where archived=0 and special=1 and company_id = :companyId GROUP BY job_request_type ORDER BY count asc", nativeQuery = true)
        List<Object[]> reportJobRequestTypeSpecial(@Param("companyId") long companyId);

        @Query(value = "SELECT assigned_to as status, COUNT(*) as count FROM vehicles where archived=0 and company_id = :companyId GROUP BY assigned_to ORDER BY count asc", nativeQuery = true)
        List<Object[]> reportAssignedTo(@Param("companyId") long companyId);

        @Query(value = "SELECT location as location, COUNT(*) as count FROM vehicles where archived=0 and company_id = :companyId GROUP BY location", nativeQuery = true)
        List<Object[]> reportLocation(@Param("companyId") long companyId);

        List<Vehicle> findByCompanyIdAndVinEndingWithIgnoreCase(long companyId, String vin);

        long countByCompanyIdAndCreatedAtBetween(long companyId, Date from, Date to);

        List<Vehicle> findByCompanyIdAndArchivedAndCreatedAtBetween(long companyId, boolean archived, Date from,
                        Date to);

        Long countByCompanyIdAndArchivedAndCreatedAtBetween(long companyId, boolean archived, Date from, Date to);

        List<Vehicle> findByCompanyIdAndArchivedAndUpdatedAtBetween(long companyId, boolean archived, Date from,
                        Date to);

        Long countByCompanyIdAndArchivedAndUpdatedAtBetween(long companyId, boolean archived, Date from, Date to);

        List<Vehicle> findByCompanyIdAndArchivedAndStatus(long companyId, boolean b, Long status);

        int countByCompanyIdAndArchived(long companyId, boolean archived);

        @Query(value = "SELECT COUNT( DISTINCT v.id) FROM vehicles v LEFT JOIN customers c ON v.customer_id = c.id AND v.company_id = c.company_id WHERE v.company_id=?1 AND v.archived=?2 AND c.last_name=?3 ", nativeQuery = true)
        int countByCustomerLastName(long companyId, boolean archived, String lastName);

        @Query(value = "SELECT DISTINCT v.* FROM vehicles v LEFT JOIN customers c ON v.customer_id = c.id AND v.company_id = c.company_id WHERE v.company_id=?1 AND v.archived=?2 AND c.last_name=?3 ", nativeQuery = true)
        List<Vehicle> findByCustomerLastName(long companyId, boolean archived, String lastName, Pageable withPage);

        @Query(value = "SELECT DISTINCT v.* FROM vehicles v LEFT JOIN customers c ON v.customer_id = c.id AND v.company_id = c.company_id WHERE v.archived=?1 AND c.phone=?2 Order By v.created_at DESC", nativeQuery = true)
        List<Vehicle> findByCustomerPhone(boolean archived, String lastName);

        Optional<Vehicle> findByTokenAndArchived(String uuid, boolean b);

        List<Vehicle> findByAssignedToAndCompanyIdAndArchived(long id, long companyId, boolean b);

        Optional<Vehicle> findByToken(String uuid);

        @Query(value = "SELECT DISTINCT v.* FROM vehicles v LEFT JOIN customers c ON v.customer_id = c.id AND v.company_id = c.company_id WHERE v.company_id=?1 AND v.archived=?2 AND c.last_name=?3 ", nativeQuery = true)
        List<Vehicle> findByMakeModelName(long companyId, boolean archived, String lastName, Pageable withPage);

        // @Query(value = "SELECT COUNT(v) FROM vehicles v " +
        // "LEFT JOIN customers c ON v.company_id = c.company_id " +
        // "WHERE (:company_id IS NULL OR v.company_id = ?1) " +
        // "AND (:archived IS NULL OR v.archived = :archived) " +
        // "AND (:searchString IS NULL OR " +
        // " (v.year = :searchYear OR v.make LIKE %:searchString% OR v.model LIKE
        // %:searchString% " +
        // " OR c.first_name LIKE %:searchString% OR c.last_name LIKE
        // %:searchString%))", nativeQuery = true)
        // int countVehicles(@Param("company_id") Long company_id,
        // @Param("archived") boolean archived,
        // @Param("searchString") String searchString,
        // @Param("searchYear") int searchYear);

        // @Query(value = "SELECT v FROM vehicles v " +
        // "LEFT JOIN customers c ON v.company_id = c.company_id " +
        // "WHERE (:company_id IS NULL OR v.company_id = :companyId) " +
        // "AND (:archived IS NULL OR v.archived = :archived) " +
        // "AND (:searchString IS NULL OR " +
        // " (v.year = :searchYear OR v.make LIKE %:searchString% OR v.model LIKE
        // %:searchString% " +
        // " OR c.first_name LIKE %:searchString% OR c.last_naame LIKE
        // %:searchString%))", nativeQuery = true)
        // List<Vehicle> searchVehicles(@Param("companyId") Long companyId,
        // @Param("archived") boolean archived,
        // @Param("searchString") String searchString,
        // @Param("searchYear") int searchYear);

        @Query(value = "SELECT COUNT(DISTINCT v.id) FROM vehicles v " +
                        "LEFT JOIN customers c ON v.company_id = c.company_id AND v.customer_id = c.id " +
                        "WHERE (v.company_id = :companyId) " +
                        "AND (v.archived = :archived) " +
                        "AND (:searchString IS NULL OR " +
                        "    (v.make LIKE %:searchString% OR v.model LIKE %:searchString% " +
                        "    OR c.first_name LIKE %:searchString% OR c.last_name LIKE %:searchString%))", nativeQuery = true)
        int countVehicles(@Param("companyId") long company_id,
                        @Param("archived") boolean archived,
                        @Param("searchString") String searchString);

        @Query(value = "SELECT DISTINCT v.* FROM vehicles v " +
                        "LEFT JOIN customers c ON v.company_id = c.company_id AND v.customer_id = c.id  " +
                        "WHERE (v.company_id = :companyId) " +
                        "AND (v.archived = :archived) " +
                        "AND (:searchString IS NULL OR " +
                        "    (v.make LIKE %:searchString% OR v.model LIKE %:searchString% " +
                        "    OR c.first_name LIKE %:searchString% OR c.last_name LIKE %:searchString%))", nativeQuery = true)
        List<Vehicle> searchVehicles(@Param("companyId") long companyId,
                        @Param("archived") boolean archived,
                        @Param("searchString") String searchString);

        @Query(value = "SELECT DISTINCT v.* FROM vehicles v " +
                        "LEFT JOIN customers c ON v.company_id = c.company_id AND v.customer_id = c.id  " +
                        "WHERE (v.company_id = :companyId) " +
                        "AND (v.archived = :archived) " +
                        "AND (:searchString IS NULL OR " +
                        "    (v.make LIKE %:searchString% OR v.model LIKE %:searchString% " +
                        "    OR c.first_name LIKE %:searchString% OR c.last_name LIKE %:searchString%))", nativeQuery = true)
        List<Vehicle> searchVehiclesWithPage(@Param("companyId") long companyId,
                        @Param("archived") boolean archived,
                        @Param("searchString") String searchString, Pageable withPage);

        // @Query(value = "SELECT COUNT(v) FROM vehicles v " +
        // "WHERE (:company_id IS NULL OR v.company_id = :company_id) " +
        // "AND (:archived IS NULL OR v.archived = :archived) " +
        // "AND (:searchString IS NULL OR " +
        // " (v.year = :searchYear OR v.make LIKE %:searchString% OR v.model LIKE
        // %:searchString% " +
        // " ))", nativeQuery = true)
        // int countVehicles(@Param("company_id") Long company_id,
        // @Param("archived") boolean archived,
        // @Param("searchString") String searchString,
        // @Param("searchYear") int searchYear);

        // @Query(value = "SELECT v FROM vehicles v " +
        // "WHERE (:company_id IS NULL OR v.company_id = :companyId) " +
        // "AND (:archived IS NULL OR v.archived = :archived) " +
        // "AND (:searchString IS NULL OR " +
        // " (v.year = :searchYear OR v.make LIKE %:searchString% OR v.model LIKE
        // %:searchString% " +
        // " ))", nativeQuery = true)
        // List<Vehicle> searchVehicles(@Param("companyId") Long companyId,
        // @Param("archived") boolean archived,
        // @Param("searchString") String searchString,
        // @Param("searchYear") int searchYear);

        int countByCompanyId(long companyId);

        int countByCompanyIdNot(long companyId);

        int countByArchivedAndCompanyIdNot(boolean achived, long companyId);

        long countByCompanyIdNotAndCreatedAtBetween(int i, Date from, Date to);
}
