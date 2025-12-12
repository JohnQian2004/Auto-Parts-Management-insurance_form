package com.xoftex.parthub.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.xoftex.parthub.models.Autopart;

public interface AutoPartRepository extends JpaRepository<Autopart, Long> {

	List<Autopart> findByPublished(boolean published);

	List<Autopart> findByTitleContaining(String title);

	// List<Autopart> findByYearAndMakeAndModelAndPartName(int year, String make,
	// String model, String partName);

	List<Autopart> findByYearAndMakeAndModelAndPartNameAndStatus(int year, String make, String model, String partName,
			int status);

	List<Autopart> findByPartNumberAndStatus(String partNumber, int status);

	List<Autopart> findByUserId(long userId);

	List<Autopart> findByUserIdAndStatus(long userId, int status);

	List<Autopart> findByCompanyIdAndStatus(long companyId, int status);

	List<Autopart> findByCompanyIdAndStatusAndPublishedAndArchived(long companyId, int status, boolean published,
			boolean archived);

	List<Autopart> findByCompanyIdAndStatusAndPublishedAndArchivedOrderByIdDesc(int companyId, int status,
			boolean published,
			boolean archived, Pageable withPage);

	List<Autopart> findByUserIdAndStatusAndPublishedAndArchivedOrderByIdDesc(int userId, int status,
			boolean published,
			boolean archived, Pageable withPage);

	int countByCompanyIdAndStatusAndPublishedAndArchived(int companyId, int status, boolean published,
			boolean archived);

	int countByUserIdAndStatusAndPublishedAndArchived(int userId, int status, boolean published,
			boolean archived);

	long countByUserIdAndStatus(long userId, int status);

	long countByUserIdAndStatusAndArchivedAndPublished(long userId, int status, boolean archived, boolean published);

	long countByCompanyIdAndStatusAndArchivedAndPublished(long companyId, int status, boolean archived,
			boolean published);

	long countByUserId(long userId);

	List<Autopart> findByStatus(int status);

	long countByStatus(int status);

	List<Autopart> findByYearAndMakeAndModelAndPartNameAndStatus(int year, String make, String model, String partName,
			int i, Pageable withPage);

	List<Autopart> findByYearAndMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(int year,
			String make,
			String model,
			String partName,
			int status, boolean archived, boolean published, Pageable withPage);

	List<Autopart> findByTitleContainsIgnoreCaseAndStatusAndArchivedAndPublished(String partName,
			int status, boolean archived, boolean published, Pageable withPage);

	List<Autopart> findByYearAndMakeAndModelAndPartNumberAndStatusAndArchivedAndPublished(int year, String make,
			String model,
			String partNumber,
			int status, boolean archived, boolean published, Pageable withPage);

	@Query(value = "SELECT DISTINCT a.* FROM autoparts a LEFT JOIN fitments f ON a.id=f.autopart_Id WHERE ( (a.year=?1 AND a.make=?2 AND a.model=?3 AND a.part_number=?4) OR  (f.year=?1 AND f.make=?2 AND f.model=?3 AND f.part_number=?4)) AND a.status=?5 AND a.archived=?6 AND a.published=?7", nativeQuery = true)
	List<Autopart> findWithFitmentYearMakeModel(int year, String make,
			String model,
			String partName,
			int status, boolean archived, boolean published, Pageable withPage);

	int countByYearAndMakeAndModelAndPartNameAndStatus(int year, String make, String model, String partName, int i);

	int countByYearAndMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublished(int year, String make, String model,
			String partName, int i, boolean archived, boolean published);

	int countByYearAndMakeAndModelAndPartNumberAndStatusAndArchivedAndPublished(int year, String make, String model,
			String partNumber, int i, boolean archived, boolean published);

	int countByTitleContainsIgnoreCaseAndStatusAndArchivedAndPublished(
			String title, int i, boolean archived, boolean published);

	@Query(value = "SELECT COUNT( DISTINCT a.id) FROM autoparts a LEFT JOIN fitments f ON a.id=f.autopart_Id WHERE ( (a.year=?1 AND a.make=?2 AND a.model=?3 AND a.part_number=?4) OR  (f.year=?1 AND f.make=?2 AND f.model=?3 AND f.part_number=?4)) AND a.status=?5 AND a.archived=?6 AND a.published=?7", nativeQuery = true)
	int countWithFitmentYearMakeModel(int year, String make, String model,
			String partName, int status, boolean archived, boolean published);

	List<Autopart> findByPartNumberAndStatus(String partNumber, int status, Pageable withPage);

	List<Autopart> findByPartNumberContainsAndStatusAndArchivedAndPublished(String partNumber, int status,
			boolean archived, boolean published,
			Pageable withPage);

	List<Autopart> findByPartNumberAndStatusAndArchivedAndPublished(String partNumber, int status,
			boolean archived, boolean published,
			Pageable withPage);

	@Query(value = "SELECT DISTINCT a.* FROM autoparts a LEFT JOIN fitments f ON a.id=f.autopart_Id WHERE ( a.part_number=?1 OR f.part_number=?1) AND a.status=?2 AND a.archived=?3 AND a.published=?4", nativeQuery = true)
	List<Autopart> findWithFitment(String partNumber, int status,
			boolean archived, boolean published,
			Pageable withPage);

	int countByPartNumberContainsAndStatusAndArchivedAndPublished(String partNumber, int status, boolean archived,
			boolean published);

	int countByPartNumberAndStatusAndArchivedAndPublished(String partNumber, int status, boolean archived,
			boolean published);

	@Query(value = "SELECT COUNT( DISTINCT a.id ) FROM autoparts a LEFT JOIN fitments f ON a.id=f.autopart_Id WHERE ( a.part_number=?1 OR f.part_number=?1) AND a.status=?2 AND a.archived=?3 AND a.published=?4", nativeQuery = true)
	int countWithFitment(String partNumber, int status, boolean archived,
			boolean published);

	int countByPartNumberAndStatus(String partNumber, int status);

	// @Query(value = "SELECT SUM(view_count) FROM autoparts where user_id= ?1 AND
	// status=1", nativeQuery = true)
	// int getViewCountForUser(long userId);

	@Query(value = "SELECT SUM(view_count) FROM autoparts where company_id= ?1 AND status=2 AND published=1", nativeQuery = true)
	int getViewCountForCompany(long userId);

	@Query(value = "SELECT SUM(view_count) FROM autoparts where user_id= ?1 AND status=2 AND archived=0 AND published=1", nativeQuery = true)
	int getViewCountForUser(long userId);

	@Query(value = "SELECT SUM(view_count) FROM autoparts where status=2 AND archived=0", nativeQuery = true)
	int getTotalViewCount();

	List<Autopart> findByCompanyIdAndArchivedAndStatusNot(long companyId, boolean archived, int status);

	List<Autopart> findByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndArchivedAndStatusNot(
			String partNumber,
			String title, String description,
			long companyId, boolean archived,
			int status);

	List<Autopart> findByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndArchived(
			String partNumber,
			String title, String description,
			long companyId, boolean archived);

	@Query(value = "select * from autoparts a where ( upper(a.part_number) like concat('%', upper(?1), '%') or upper(a.title) like concat('%', upper(?2), '%') or upper(a.description) like concat('%', upper(?3), '%')) and a.company_id=?4 and a.archived=?5", nativeQuery = true)
	List<Autopart> searchWithArchivedFlag(String partNumber, String title, String description, long companyId,
			boolean archived);

	List<Autopart> findByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndArchivedAndStatus(
			String partNumber,
			String title, String description,
			long companyId, boolean archived,
			int status);

	@Query(value = "select * from autoparts a where ( upper(a.part_number) like concat('%', upper(?1), '%') or upper(a.title) like concat('%', upper(?2), '%') or upper(a.description) like concat('%', upper(?3), '%')) and a.company_id=?4 and a.archived=?5 and a.status=?6  ", nativeQuery = true)
	List<Autopart> searchInventory(String partNumber, String title, String description, long companyId,
			boolean archived, int status);

	int countByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndPublishedAndArchivedAndStatus(
			String partNumber,
			String title, String description,
			long companyId, boolean published, boolean archived, int status);

	List<Autopart> findByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndPublishedAndArchivedAndStatus(
			String partNumber,
			String title, String description,
			long companyId, boolean published, boolean archived,
			int status, Pageable withPage);

	@Query(value = "select count(*) from autoparts a where ( upper(a.part_number) like concat('%', upper(?1), '%') or upper(a.title) like concat('%', upper(?2), '%') or upper(a.description) like concat('%', upper(?3), '%') or upper(a.stock_number) like concat('%', upper(?4), '%')) and a.company_id=?5 and a.published=?6 and a.archived=?7 and a.status=?8  ", nativeQuery = true)
	int count(String partNumber, String title, String description, String stockNumber, long companyId,
			boolean published,
			boolean archived, int status);

	@Query(value = "select count(*) from autoparts a where ( upper(a.part_number) like concat('%', upper(?1), '%') or upper(a.title) like concat('%', upper(?2), '%') or upper(a.description) like concat('%', upper(?3), '%') or upper(a.stock_number) like concat('%', upper(?4), '%') ) and a.user_id=?5 and a.published=?6 and a.archived=?7 and a.status=?8  ", nativeQuery = true)
	int countUser(String partNumber, String title, String description, String stockNumber, long userId,
			boolean published,
			boolean archived, int status);

	@Query(value = "select * from autoparts a where ( upper(a.part_number) like concat('%', upper(?1), '%') or upper(a.title) like concat('%', upper(?2), '%') or upper(a.description) like concat('%', upper(?3), '%') or upper(a.stock_number) like concat('%', upper(?4), '%')) and a.company_id=?5 and a.published=?6 and a.archived=?7 and a.status=?8  ", nativeQuery = true)
	List<Autopart> search(String partNumber, String title, String description, String stockNumber, long companyId,
			boolean published,
			boolean archived, int status, Pageable pageable);

	@Query(value = "select * from autoparts a where ( upper(a.part_number) like concat('%', upper(?1), '%') or upper(a.title) like concat('%', upper(?2), '%') or upper(a.description) like concat('%', upper(?3), '%') or upper(a.stock_number) like concat('%', upper(?4), '%') ) and a.user_id=?5 and a.published=?6 and a.archived=?7 and a.status=?8  ", nativeQuery = true)
	List<Autopart> searchUser(String partNumber, String title, String description, String stockNumber, long userId,
			boolean published,
			boolean archived, int status, Pageable pageable);

	// with paging
	List<Autopart> findByCompanyIdAndArchivedAndStatusOrderByIdDesc(long companyId, boolean archived, int status,
			Pageable withPage);

	List<Autopart> findByArchivedAndPublishedAndStatusOrderByIdDesc(boolean archived, boolean published, int status,
			Pageable withPage);

	int countByArchivedAndPublishedAndStatusOrderByIdDesc(boolean archived, boolean published, int status);

	int countByCompanyIdAndArchivedAndStatus(long companyId, boolean archived, int status);

	List<Autopart> findByCompanyIdAndArchivedAndYearAndStatus(long companyId, boolean archived,
			int year, int status);

	List<Autopart> findByCompanyIdAndArchivedAndYearAndMakeAndStatus(long companyId, boolean archived,
			int year, String make, int status);

	List<Autopart> findByCompanyIdAndArchivedAndYearAndMakeAndModelAndStatus(long companyId, boolean archived,
			int year, String make, String model, int status);

	List<Autopart> findByCompanyIdAndArchivedOrderByIdDesc(int companyId, boolean archived, Pageable withPage);

	int countByCompanyIdAndArchived(int companyId, boolean archived);

	long countByStatusAndArchivedAndCreatedAtBetween(int i, boolean b, Date from, Date to);

	long countByStatusAndArchived(int status, boolean archived);

	@Query(value = "Select count(*) from autoparts a where upper(a.title) rlike ?1 and a.status=?2 and a.archived=?3 and a.published=?4", nativeQuery = true)
	int coutPartNameIn(String names, int i, boolean b,
			boolean c);

	@Query(value = "select * from autoparts a where upper(a.title) rlike ?1 and a.status=?2 and a.archived=?3 and a.published=?4", nativeQuery = true)
	List<Autopart> findPartNameIn(String names,
			int i, boolean b, boolean c,
			Pageable withPage);

	@Query(value = "SELECT title as title, COUNT(*) as count FROM autoparts where archived=0 GROUP BY title ORDER BY count DESC", nativeQuery = true)
	List<Object[]> reportTitle();

	int countByTitleContainsAndStatusAndArchivedAndPublished(String partName, int i, boolean b, boolean c);

	List<Autopart> findByTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(String partName, int i, boolean b,
			boolean c,
			Pageable withPage);

	@Query(value = "select count(*) from autoparts a where ( upper(a.part_number) like concat('%', upper(?1), '%') or upper(a.stock_number) like concat('%', upper(?2), '%')) and a.published=?3 and a.archived=?4 and a.status=?5  ", nativeQuery = true)
	int countPartNumberOrStockNumber(String partNumber, String stockNumber,
			boolean published,
			boolean archived, int status);

	@Query(value = "select * from autoparts a where ( upper(a.part_number) like concat('%', upper(?1), '%') or upper(a.stock_number) like concat('%', upper(?2), '%')) and a.published=?3 and a.archived=?4 and a.status=?5  ", nativeQuery = true)
	List<Autopart> searchPartNumberOrStockerNumber(String partNumber, String stockNumber,
			boolean published,
			boolean archived, int status, Pageable pageable);

	@Query(value = "select count(*) from autoparts a where ( upper(a.title) like concat('%', upper(?1), '%') or upper(a.description) like concat('%', upper(?2), '%')) and a.published=?3 and a.archived=?4 and a.status=?5  ", nativeQuery = true)
	int countPartNameOrDescription(String partNumber, String stockNumber,
			boolean published,
			boolean archived, int status);

	@Query(value = "select * from autoparts a where ( upper(a.title) like concat('%', upper(?1), '%') or upper(a.description) like concat('%', upper(?2), '%')) and a.published=?3 and a.archived=?4 and a.status=?5  ", nativeQuery = true)
	List<Autopart> searchPartNameOrDescription(String partNumber, String stockNumber,
			boolean published,
			boolean archived, int status, Pageable pageable);

	@Query(value = "select count(*) from autoparts a where ( upper(a.title) rlike ?1 or upper(a.description) rlike ?2 ) and a.published=?3 and a.archived=?4 and a.status=?5  ", nativeQuery = true)
	int countPartNameOrDescriptionRLike(String partNumber, String stockNumber,
			boolean published,
			boolean archived, int status);

	@Query(value = "select * from autoparts a where ( upper(a.title) rlike ?1 or upper(a.description) rlike ?2 ) and a.published=?3 and a.archived=?4 and a.status=?5  ", nativeQuery = true)
	List<Autopart> searchPartNameOrDescriptionRLike(String partNumber, String stockNumber,
			boolean published,
			boolean archived, int status, Pageable pageable);

	int countByMakeContainsAndStatusAndArchivedAndPublished(String make, int i, boolean b, boolean c);

	List<Autopart> findByMakeContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(String make, int i, boolean b,
			boolean c,
			Pageable withPage);

	int countByMakeAndModelContainsAndStatusAndArchivedAndPublished(String make, String model, int i, boolean b,
			boolean c);

	List<Autopart> findByMakeAndModelContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(String make, String model,
			int i,
			boolean b, boolean c,
			Pageable withPage);

	int countByYearAndStatusAndArchivedAndPublished(int year, int i, boolean b, boolean c);

	List<Autopart> findByYearAndStatusAndArchivedAndPublishedOrderByIdDesc(int year, int i, boolean b, boolean c,
			Pageable withPage);

	List<Autopart> findByYearAndMakeAndStatusAndArchivedAndPublishedOrderByIdDesc(int year, String make, int i,
			boolean b, boolean c,
			Pageable withPage);

	int countByYearAndMakeAndStatusAndArchivedAndPublished(int year, String make, int i, boolean b, boolean c);

	int countByYearAndTitleContainsAndStatusAndArchivedAndPublished(int year, String partName, int i, boolean b,
			boolean c);

	List<Autopart> findByYearAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(int year, String partName,
			int i,
			boolean b, boolean c, Pageable withPage);

	int countByMakeAndTitleContainsAndStatusAndArchivedAndPublished(String make, String partName, int i, boolean b,
			boolean c);

	List<Autopart> findByMakeAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(String make, String partName,
			int i,
			boolean b, boolean c, Pageable withPage);

	int countByYearAndMakeAndTitleContainsAndStatusAndArchivedAndPublished(int year, String make, String partName,
			int i, boolean b, boolean c);

	List<Autopart> findByYearAndMakeAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(int year, String make,
			String partName, int i, boolean b, boolean c, Pageable withPage);

	int countByMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublished(String make, String model, String partName,
			int i, boolean b, boolean c);

	List<Autopart> findByMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(String make,
			String model,
			String partName, int i, boolean b, boolean c, Pageable withPage);

	Optional<Autopart> findByToken(String uuid);

	List<Autopart> findByVehicleId(long vehicleId);

	List<Autopart> findByPurchaseOrderId(long id);

	@Query(value = "SELECT a.user_id as id, COUNT(*) as count FROM autoparts a LEFT JOIN users u ON a.user_id = u.id  WHERE u.part_market_only = 1 AND a.archived=0 GROUP BY a.user_id ORDER BY count DESC LIMIT 100", nativeQuery = true)
	List<Object[]> reportUserTop100();

	int countByVehicleIdNot(long vehicleId);

	long countByCompanyIdNotAndCreatedAtBetween(int i, Date from, Date to);

	public int countByLocationAndTitleContainsAndStatusAndArchivedAndPublished(int location, String partName, int i,
			boolean b, boolean b0);

	public List<Autopart> findByLocationAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(int location,
			String partName, int i, boolean b, boolean b0, Pageable withPage);

	public int countByLocationAndMakeContainsAndStatusAndArchivedAndPublished(int location, String make, int i,
			boolean b, boolean b0);

	public List<Autopart> findByLocationAndMakeContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(int location,
			String make, int i, boolean b, boolean b0, Pageable withPage);

	public int countByLocationAndMakeAndModelContainsAndStatusAndArchivedAndPublished(int location, String make,
			String model, int i, boolean b, boolean b0);

	public List<Autopart> findByLocationAndMakeAndModelContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
			int location, String make, String model, int i, boolean b, boolean b0, Pageable withPage);

	public int countByLocationAndYearAndStatusAndArchivedAndPublished(int location, int year, int i, boolean b,
			boolean b0);

	public List<Autopart> findByLocationAndYearAndStatusAndArchivedAndPublishedOrderByIdDesc(int location, int year,
			int i, boolean b, boolean b0, Pageable withPage);

	public int countByLocationAndYearAndMakeAndStatusAndArchivedAndPublished(int location, int year, String make, int i,
			boolean b, boolean b0);

	public List<Autopart> findByLocationAndYearAndMakeAndStatusAndArchivedAndPublishedOrderByIdDesc(int location,
			int year, String make, int i, boolean b, boolean b0, Pageable withPage);

	public int countByLocationAndYearAndTitleContainsAndStatusAndArchivedAndPublished(int location, int year,
			String partName, int i, boolean b, boolean b0);

	public List<Autopart> findByLocationAndYearAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
			int location, int year, String partName, int i, boolean b, boolean b0, Pageable withPage);

	public int countByLocationAndMakeAndTitleContainsAndStatusAndArchivedAndPublished(int location, String make,
			String partName, int i, boolean b, boolean b0);

	public List<Autopart> findByLocationAndMakeAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
			int location, String make, String partName, int i, boolean b, boolean b0, Pageable withPage);

	public int countByLocationAndYearAndMakeAndTitleContainsAndStatusAndArchivedAndPublished(int location, int year,
			String make, String partName, int i, boolean b, boolean b0);

	public List<Autopart> findByLocationAndYearAndMakeAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
			int location, int year, String make, String partName, int i, boolean b, boolean b0, Pageable withPage);

	public int countByLocationAndMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublished(int location, String make,
			String model, String partName, int i, boolean b, boolean b0);

	public List<Autopart> findByLocationAndMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
			int location, String make, String model, String partName, int i, boolean b, boolean b0, Pageable withPage);

	public int countByLocationAndYearAndMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublished(int location,
			int year, String make, String model, String partName, int i, boolean b, boolean b0);

	public List<Autopart> findByLocationAndYearAndMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
			int location, int year, String make, String model, String partName, int i, boolean b, boolean b0,
			Pageable withPage);
}
