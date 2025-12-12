package com.xoftex.parthub.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Job;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByVehicleId(long vehicleId);

    List<Job> findByVehicleIdOrderBySequenceNumberAsc(long vehicleId);

    List<Job> findByServiceId(long id);

    List<Job> findByServiceIdAndVehicleId(long serviceId, long vehicleId);

    List<Job> findByEmployeeId(long id);

    List<Job> findByVehicleIdOrderByNameAsc(long vehicleId);

    List<Job> findByEmployeeIdAndArchived(long userId, boolean b);

    List<Job> findByEmployeeIdAndStatusAndUpdatedAtBetween(long userId, int i, Date from, Date to);

    // @Query(value = "SELECT employee_Id, COUNT(*) FROM jobs, users WHERE users.id=jobs.employee_Id and users.company_id=:companyId and jobs.STATUS=:status AND jobs.updated_At BETWEEN :from AND :to GROUP BY jobs.employee_id", nativeQuery = true)
    // List<Object[]> getUserPerformance(@Param("companyId") long companyId, @Param("status") int status,
    //         @Param("from") Date from, @Param("to") Date to);
    @Query(value = "SELECT employee_Id, COUNT(*) FROM jobs, employees WHERE employees.id=jobs.employee_Id and employees.company_id=:companyId and jobs.STATUS=:status AND jobs.updated_At BETWEEN :from AND :to GROUP BY jobs.employee_id", nativeQuery = true)
    List<Object[]> getEmployeePerformance(@Param("companyId") long companyId, @Param("status") int status, @Param("from") Date from, @Param("to") Date to);

    List<Job> findByEmployeeIdAndArchivedAndStatusAndUpdatedAtBetween(long id, boolean b, int i, Date from, Date to);

    int countByArchivedAndEmployeeIdAndStatus(boolean b, long id, int i);

    List<Job> findByClaimId(long claimId);

    @Query(value = "SELECT j.* FROM jobs j LEFT JOIN vehicles v ON j.vehicle_id=v.id WHERE v.company_id=:companyId AND v.archived =0;", nativeQuery = true)
    List<Job> findAllCurrentEmplyeeJobs(@Param("companyId") long companyId
    );

    @Query(value = "SELECT j.* FROM jobs j LEFT JOIN vehicles v ON j.vehicle_id=v.id WHERE v.company_id=:companyId AND j.employee_id=:employeeId AND v.archived =0;", nativeQuery = true)
    List<Job> findAllCurrentEmplyeeJobsWithUuid(@Param("companyId") long companyId, @Param("employeeId") long employeeId);

    int countByVehicleIdNot(long vehicleId);
}
