package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.xoftex.parthub.models.PurchaseOrder;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

	List<PurchaseOrder> findByPublished(boolean published);

	List<PurchaseOrder> findByTitleContaining(String title);

	// List<PurchaseOrder> findByYearAndMakeAndModelAndPartName(int year, String
	// make,
	// String model, String partName);

	List<PurchaseOrder> findByYearAndMakeAndModelAndPartNameAndStatus(int year, String make, String model,
			String partName,
			int status);

	List<PurchaseOrder> findByPartNumberAndStatus(String partNumber, int status);

	List<PurchaseOrder> findByUserId(long userId);

	List<PurchaseOrder> findByUserIdAndStatus(long userId, int status);

	long countByUserIdAndStatus(long userId, int status);

	long countByUserId(long userId);

	List<PurchaseOrder> findByStatus(int status);

	long countByStatus(int status);

	List<PurchaseOrder> findByYearAndMakeAndModelAndPartNameAndStatus(int year, String make, String model,
			String partName,
			int i, Pageable withPage);

	int countByYearAndMakeAndModelAndPartNameAndStatus(int year, String make, String model, String partName, int i);

	List<PurchaseOrder> findByPartNumberAndStatus(String partNumber, int status, Pageable withPage);

	int countByPartNumberAndStatus(String partNumber, int status);

	@Query(value = "SELECT SUM(view_count) FROM autoparts where user_id= ?1 AND status=1", nativeQuery = true)
	int getViewCountForUser(long userId);

	List<PurchaseOrder> findByCompanyIdAndArchivedAndStatusNot(long companyId, boolean archived, int status);

	List<PurchaseOrder> findByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndArchivedAndStatusNot(
			String partNumber,
			String title, String description,
			long companyId, boolean archived,
			int status);

	List<PurchaseOrder> findByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndArchived(
			String partNumber,
			String title, String description,
			long companyId, boolean archived);

	List<PurchaseOrder> findByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndArchivedAndStatus(
			String partNumber,
			String title, String description,
			long companyId, boolean archived,
			int status);

	// with paging
	List<PurchaseOrder> findByCompanyIdAndArchivedAndStatusOrderByIdDesc(long companyId, boolean archived, int status,
			Pageable withPage);

	int countByCompanyIdAndArchivedAndStatus(long companyId, boolean archived, int status);

	List<PurchaseOrder> findByCompanyIdAndArchivedAndYearAndStatus(long companyId, boolean archived,
			int year, int status);

	List<PurchaseOrder> findByCompanyIdAndArchivedAndYearAndMakeAndStatus(long companyId, boolean archived,
			int year, String make, int status);

	List<PurchaseOrder> findByCompanyIdAndArchivedAndYearAndMakeAndModelAndStatus(long companyId, boolean archived,
			int year, String make, String model, int status);

	List<PurchaseOrder> findByCompanyIdAndArchivedOrderByIdDesc(int companyId, boolean archived, Pageable withPage);

	int countByCompanyIdAndArchived(int companyId, boolean archived);

}
