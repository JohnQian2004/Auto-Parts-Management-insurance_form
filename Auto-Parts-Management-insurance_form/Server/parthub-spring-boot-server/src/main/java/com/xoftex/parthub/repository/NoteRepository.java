package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByCompanyId(long companyId);

    List<Note> findByCompanyIdAndArchived(long companyId, boolean b);

}
