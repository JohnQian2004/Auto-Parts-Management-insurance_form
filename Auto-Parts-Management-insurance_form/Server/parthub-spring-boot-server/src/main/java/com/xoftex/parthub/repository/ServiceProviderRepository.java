package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.ServiceProvider;

@Repository
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {

    List<ServiceProvider> findByServiceTypeIdAndArchivedOrderByNameAsc(long serviceTypeId, boolean archived);

    List<ServiceProvider> findByCompanyIdOrderByNameAsc(long companyId);

    List<ServiceProvider> findByServiceTypeIdOrderByNameAsc(long serviceTypeId, Pageable withPage);

    List<ServiceProvider> findByNameOrderByNameAsc(String serviceName, Pageable withPage);

    @Query(value = "Select count(*) from serviceproviders a where upper(a.name) rlike ?1 and a.archived=?2", nativeQuery = true)
    int countNameIn(String names, boolean c);

    @Query(value = "select * from serviceproviders a where upper(a.name) rlike ?1 and a.archived=?2", nativeQuery = true)
    List<ServiceProvider> findNameIn(String names, boolean c, Pageable withPage);

    @Query(value = "Select count(*) from serviceproviders a where a.service_type_id=?1 and upper(a.name) rlike ?2 and a.archived=?3", nativeQuery = true)
    int countServiceTypeIdAndNameIn(long serviceTypeId, String names, boolean c);

    @Query(value = "select * from serviceproviders a where a.service_type_id=?1 and upper(a.name) rlike ?2 and a.archived=?3", nativeQuery = true)
    List<ServiceProvider> findServiceTypeIdAndNameIn(long seriveTypeId, String names, boolean c, Pageable withPage);

    int countByServiceTypeId(long serviceTypeId);

    @Query(value = "Select count(*) from serviceproviders", nativeQuery = true)
    int countAll();

    @Query(value = "Select * from serviceproviders order by name ASC", nativeQuery = true)
    List<ServiceProvider> findAllOrderByNameAsc(Pageable withPage);

    List<ServiceProvider> findByUserIdOrderByNameAsc(long userId);

}
