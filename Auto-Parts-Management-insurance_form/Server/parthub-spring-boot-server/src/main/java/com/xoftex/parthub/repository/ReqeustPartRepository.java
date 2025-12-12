package com.xoftex.parthub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.RequestPart;

@Repository
public interface ReqeustPartRepository extends JpaRepository<RequestPart, Long> {

        Optional<RequestPart> findByToken(String uuid);

        // total count
        int countByIdNot(int id);

        int countByArchivedOrderByIdDesc(boolean b);

        List<RequestPart> findByArchivedOrderByIdDesc(boolean b, Pageable withPage);

        @Query(value = "Select count(*) from requestparts a where upper(a.title) rlike ?1 and a.archived=?2", nativeQuery = true)
        int coutPartNameIn(String names,
                        boolean c);

        @Query(value = "select * from requestparts a where upper(a.title) rlike ?1 and a.archived=?2", nativeQuery = true)
        List<RequestPart> findPartNameIn(String names,
                        boolean b,
                        Pageable withPage);

        List<RequestPart> findByCompanyIdAndArchivedOrderByIdDesc(int companyId, boolean b, Pageable withPage);

        int countByCompanyIdAndArchived(int companyId, boolean b);

        List<RequestPart> findByUserIdAndArchivedOrderByIdDesc(int userId, boolean archived, Pageable withPage);

        int countByUserIdAndArchived(int userId, boolean archived);

        int countByTitleContainsIgnoreCaseAndArchived(String partName, boolean b);

        List<RequestPart> findByTitleContainsIgnoreCaseAndArchived(String partName, boolean b, Pageable withPage);

        int countByYearAndMakeAndModelAndPartNumberAndArchived(int year, String make, String model, String partNumber,
                        boolean b);

        List<RequestPart> findByYearAndMakeAndModelAndPartNumberAndArchived(int year, String make, String model,
                        String partNumber, boolean b, Pageable withPage);

        int countByTitleContainsAndArchived(String partName, boolean b);

        List<RequestPart> findByTitleContainsAndAndArchivedOrderByIdDesc(String partName, boolean b, Pageable withPage);

        int countByMakeContainsAndArchived(String make, boolean b);

        List<RequestPart> findByMakeContainsAndAndArchivedOrderByIdDesc(String make, boolean b, Pageable withPage);

        int countByMakeAndModelContainsAndArchived(String make, String model, boolean b);

        List<RequestPart> findByMakeAndModelContainsAndArchivedOrderByIdDesc(String make, String model, boolean b,
                        Pageable withPage);

        int countByYearAndArchived(int year, boolean b);

        List<RequestPart> findByYearAndArchivedOrderByIdDesc(int year, boolean b, Pageable withPage);

        int countByYearAndMakeAndArchived(int year, String make, boolean b);

        List<RequestPart> findByYearAndMakeAndArchivedOrderByIdDesc(int year, String make, boolean b,
                        Pageable withPage);

        int countByYearAndTitleContainsAndArchived(int year, String partName, boolean b);

        List<RequestPart> findByYearAndTitleContainsAndArchivedOrderByIdDesc(int year, String partName, boolean b,
                        Pageable withPage);

        int countByMakeAndTitleContainsAndArchived(String make, String partName, boolean b);

        List<RequestPart> findByMakeAndTitleContainsAndArchivedOrderByIdDesc(String make, String partName, boolean b,
                        Pageable withPage);

        int countByYearAndMakeAndTitleContainsAndArchived(int year, String make, String partName, boolean b);

        List<RequestPart> findByYearAndMakeAndTitleContainsAndArchivedOrderByIdDesc(int year, String make,
                        String partName, boolean b,
                        Pageable withPage);

        int countByMakeAndModelAndTitleContainsAndArchived(String make, String model, String partName, boolean b);

        List<RequestPart> findByMakeAndModelAndTitleContainsAndArchivedOrderByIdDesc(String make, String model,
                        String partName,
                        boolean b, Pageable withPage);

        int countByYearAndMakeAndModelAndTitleContainsAndArchived(int year, String make, String model, String partName,
                        boolean b);

        List<RequestPart> findByYearAndMakeAndModelAndTitleContainsAndArchivedOrderByIdDesc(int year, String make,
                        String model,
                        String partName, boolean b, Pageable withPage);

        List<RequestPart> findByYearAndMakeAndModelAndPartName(int year, String make, String model, String partName);

        public int countByLocationAndTitleContainsAndArchived(int location, String partName, boolean b);

        public List<RequestPart> findByLocationAndTitleContainsAndAndArchivedOrderByIdDesc(int location,
                        String partName, boolean b, Pageable withPage);

    public int countByLocationAndMakeContainsAndArchived(int location, String make, boolean b);

    public List<RequestPart> findByLocationAndMakeContainsAndAndArchivedOrderByIdDesc(int location, String make, boolean b, Pageable withPage);

    public int countByLocationAndMakeAndModelContainsAndArchived(int location, String make, String model, boolean b);

    public List<RequestPart> findByLocationAndMakeAndModelContainsAndArchivedOrderByIdDesc(int location, String make, String model, boolean b, Pageable withPage);

    public int countByLocationAndYearAndArchived(int location, int year, boolean b);

    public List<RequestPart> findByLocationAndYearAndArchivedOrderByIdDesc(int location, int year, boolean b, Pageable withPage);

    public int countByLocationAndYearAndMakeAndArchived(int location, int year, String make, boolean b);

    public List<RequestPart> findByLocationAndYearAndMakeAndArchivedOrderByIdDesc(int location, int year, String make, boolean b, Pageable withPage);

    public int countByLocationAndYearAndTitleContainsAndArchived(int location, int year, String partName, boolean b);

    public List<RequestPart> findByLocationAndYearAndTitleContainsAndArchivedOrderByIdDesc(int location, int year, String partName, boolean b, Pageable withPage);

    public int countByLocationAndMakeAndTitleContainsAndArchived(int location, String make, String partName, boolean b);

    public List<RequestPart> findByLocationAndMakeAndTitleContainsAndArchivedOrderByIdDesc(int location, String make, String partName, boolean b, Pageable withPage);

    public int countByLocationAndYearAndMakeAndTitleContainsAndArchived(int location, int year, String make, String partName, boolean b);

    public List<RequestPart> findByLocationAndYearAndMakeAndTitleContainsAndArchivedOrderByIdDesc(int location, int year, String make, String partName, boolean b, Pageable withPage);

    public int countByLocationAndMakeAndModelAndTitleContainsAndArchived(int location, String make, String model, String partName, boolean b);

    public List<RequestPart> findByLocationAndMakeAndModelAndTitleContainsAndArchivedOrderByIdDesc(int location, String make, String model, String partName, boolean b, Pageable withPage);

    public int countByLocationAndYearAndMakeAndModelAndTitleContainsAndArchived(int location, int year, String make, String model, String partName, boolean b);

    public List<RequestPart> findByLocationAndYearAndMakeAndModelAndTitleContainsAndArchivedOrderByIdDesc(int location, int year, String make, String model, String partName, boolean b, Pageable withPage);

}
