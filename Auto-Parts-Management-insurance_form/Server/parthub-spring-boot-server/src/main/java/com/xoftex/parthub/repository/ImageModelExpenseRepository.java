package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xoftex.parthub.models.ImageModelExpense;

public interface ImageModelExpenseRepository extends JpaRepository<ImageModelExpense, Long> {

    public List<ImageModelExpense> findByExpenseId(long expenseId);

}