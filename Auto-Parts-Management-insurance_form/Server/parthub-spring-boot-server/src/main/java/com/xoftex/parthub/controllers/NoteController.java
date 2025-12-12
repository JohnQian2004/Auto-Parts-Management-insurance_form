package com.xoftex.parthub.controllers;

import java.util.ArrayList;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Employee;
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.Note;

import com.xoftex.parthub.models.SequenceCarrier;

import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.JobRepository;
import com.xoftex.parthub.repository.NoteRepository;

import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.VehicleRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;
import com.xoftex.parthub.services.NoteWebSocketHandler;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/notes")
public class NoteController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  NoteRepository noteRepository;

  @Autowired
  EmployeeRepository employeeRepository;

  @Autowired
  VehicleRepository vehicleRepository;

  @Autowired
  AutoPartRepository autoPartRepository;

  @Autowired
  VehicleHistoryRepository vehicleHistoryRepository;

  @Autowired
  JobRepository jobRepository;

  @Autowired
  JwtUtils jwtUtils;

  private final NoteWebSocketHandler noteWebSocketHandler;

  public NoteController(NoteWebSocketHandler noteWebSocketHandler) {
    this.noteWebSocketHandler = noteWebSocketHandler;
  }

  @PostMapping("/send")
  public String sendJob(@RequestBody Note note) {
    noteWebSocketHandler.sendJobToClients(note);
    System.out.print(note);
    return "Job sent to clients";
  }

  private static final Logger LOG = LoggerFactory.getLogger(NoteController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Note> createAndUpdateNote(@PathVariable("id") long id,
      @RequestBody Note noteIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Note note = new Note();

    if (userOptional.isPresent()) {

      if (noteIn.getEmployeeId() == 0) {
        noteIn.setUserId(id);
        noteIn.setColor("text-white");
      } else {
        noteIn.setUserId(0);

      }

      note = this.noteRepository.save(noteIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(note, HttpStatus.CREATED);

  }

  @PostMapping("/user/{jobId}/{userId}")
  public ResponseEntity<Note> createAndUpdateNoteUserId(@PathVariable("userId") long userId,
      @PathVariable("jobId") long jobId,
      @RequestBody Note noteIn) {

    Optional<User> userOptional = this.userRepository.findById(userId);
    Note note = new Note();

    if (userOptional.isPresent()) {

      // noteIn.setEmployeeId(employeeOptional.get().getId());
      noteIn.setCompanyId(userOptional.get().getCompanyId());
      // noteIn.setColor("text-warning fw-500");
      noteIn.setUserId(userOptional.get().getId());
      noteIn.setJobId(jobId);

      note = this.noteRepository.save(noteIn);

      Optional<Job> jobOptional = this.jobRepository.findById(jobId);

      if (jobOptional.isPresent()) {
        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("Job User notification notes [" + jobOptional.get().getName() + "] ");
        vehicleHistory.setType(1); // 0) add 1) update 2) delete
        // vehicleHistory.setUserId(0); // fix later
        // vehicleHistory.setEmployeeId(employeeOptional.get().getId());
        vehicleHistory.setUserId(userOptional.get().getId());
        vehicleHistory.setVehicleId(jobOptional.get().getVehicleId());
        vehicleHistory.setValue("Job [" + jobOptional.get().getId() + "]" + jobOptional.get().getName() + " Done");
        this.vehicleHistoryRepository.save(vehicleHistory);

      }
      try {
        System.out.println("Sending .." + note.toString());
        noteWebSocketHandler.sendJobToClients(note);
      } catch (Exception ex) {

      }
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(note, HttpStatus.CREATED);

  }

  @PostMapping("/employee/{jobId}/{uuidEmployee}")
  public ResponseEntity<Note> createAndUpdateNoteUuidEmployee(@PathVariable("uuidEmployee") String uuidEmployee,
      @PathVariable("jobId") long jobId,
      @RequestBody Note noteIn) {

    Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuidEmployee);
    Note note = new Note();

    if (employeeOptional.isPresent()) {
      noteIn.setEmployeeId(employeeOptional.get().getId());
      noteIn.setCompanyId(employeeOptional.get().getCompanyId());
      // noteIn.setColor("text-success fw-500");
      noteIn.setUserId(0);
      noteIn.setJobId(jobId);

      note = this.noteRepository.save(noteIn);

      Optional<Job> jobOptional = this.jobRepository.findById(jobId);
      if (jobOptional.isPresent()) {
        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("Job employee notification notes [" + jobOptional.get().getName() + "] ");
        vehicleHistory.setType(1); // 0) add 1) update 2) delete
        vehicleHistory.setUserId(0); // fix later
        vehicleHistory.setEmployeeId(employeeOptional.get().getId());
        vehicleHistory.setVehicleId(jobOptional.get().getVehicleId());
        vehicleHistory.setValue("Job [" + jobOptional.get().getId() + "]" + jobOptional.get().getName() + " Done");
        this.vehicleHistoryRepository.save(vehicleHistory);

      }
      try {
        System.out.println("Sending .." + note.toString());
        noteWebSocketHandler.sendJobToClients(note);
      } catch (Exception ex) {

      }
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(note, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Note> getNote(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Note> noteOptional = this.noteRepository.findById(id);
    Note note = new Note();
    if (noteOptional.isPresent()) {
      note = noteOptional.get();

      // fix later
      // setVariableForNote(companyId, note);
      return new ResponseEntity<>(note, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Note>> getCompanyNotes(@PathVariable("companyId") long companyId) {

    List<Note> notes = new ArrayList<Note>();

    notes = this.noteRepository.findByCompanyIdAndArchived(companyId, false);
    if (notes.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } else {
      setVarables(companyId, notes);
    }

    return new ResponseEntity<>(notes, HttpStatus.OK);
  }

  private void setVarables(long companyId, List<Note> notes) {
    for (Note note : notes) {
      setVariableForNote(companyId, note);
    }
  }

  private void setVariableForNote(long companyId, Note note) {

    if (note.getJobId() > 0) {
      Optional<Job> jobOptional = this.jobRepository.findById(note.getJobId());
      if (jobOptional.isPresent()) {
        note.setJobName(jobOptional.get().getName());
        note.setJobPrice(jobOptional.get().getPrice());
        note.setJobStatus(jobOptional.get().getStatus());

        if (note.getVehicleId() > 0) {
          Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(note.getVehicleId());
          if (vehicleOptional.isPresent()) {
            note.setYear(vehicleOptional.get().getYear());
            note.setMake(vehicleOptional.get().getMake());
            note.setModel(vehicleOptional.get().getModel());
            note.setColorVehicle(vehicleOptional.get().getColor());

          }
        }
      }

    }

    if (note.getEmployeeId() > 0) {

      Optional<Employee> employeeOptional = this.employeeRepository.findById(note.getEmployeeId());
      if (employeeOptional.isPresent()) {
        Employee employee = employeeOptional.get();
        String firstNameC = employee.getFirstName().toUpperCase().substring(0, 1);
        String lastNameC = employee.getLastName().toUpperCase().substring(0, 1);

        note.setCreatorShortName(firstNameC + lastNameC);
      }

    } else {

      if (note.getUserId() > 0) {
        List<User> users = this.userRepository.findByCompanyIdOrderByFirstNameAsc(companyId);
        for (User user : users) {
          if (user.getId() == note.getUserId()) {
            String firstNameC = user.getFirstName().toUpperCase().substring(0, 1);
            String lastNameC = user.getLastName().toUpperCase().substring(0, 1);
            note.setCreatorShortName(firstNameC + lastNameC);
          }
        }

      }
    }

  }

  @PostMapping("/sequence/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Note>> updateSequenceNumber(@PathVariable("companyId") long companyId,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    List<Note> notes = this.noteRepository.findByCompanyId(companyId);

    for (Note note : notes) {

      for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

        if (note.getId() == sequenceCarrier.getId()) {
          note.setSequenceNumber(sequenceCarrier.getIndex());
          note = this.noteRepository.save(note);
        }

      }
    }
    notes = this.noteRepository.findByCompanyIdAndArchived(companyId, false);
    setVarables(companyId, notes);
    return new ResponseEntity<>(notes, HttpStatus.OK);

  }

  // @DeleteMapping("/{id}")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  // public ResponseEntity<?> deleteNote(@PathVariable("id") long id) {
  // LOG.info("" + id);
  // Optional<Note> NoteOptional = this.noteRepository.findById(id);
  // Note note = new Note();
  // if (NoteOptional.isPresent()) {
  // note = NoteOptional.get();

  // if (note.getJobId() > 0) {

  // if (note.getJobId() > 0) {
  // Optional<Job> jobOptional = this.jobRepository.findById(note.getJobId());
  // if (jobOptional.isPresent()) {
  // VehicleHistory vehicleHistory = new VehicleHistory();
  // vehicleHistory.setName("Note");
  // vehicleHistory.setType(2); // 0) add 1) update 2) delete
  // vehicleHistory.setUserId(0); // fix later
  // vehicleHistory.setVehicleId(jobOptional.get().getVehicleId());
  // vehicleHistory.setValue(note.getNotes() + " Notification notes is removed");
  // this.vehicleHistoryRepository.save(vehicleHistory);
  // }
  // }

  // }
  // note.setArchived(true);
  // this.noteRepository.save(note);

  // return new ResponseEntity<>(null, HttpStatus.OK);
  // } else {
  // return new ResponseEntity<>(HttpStatus.NOT_FOUND);
  // }
  // }

  @DeleteMapping("/{userId}/{noteId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteNoteWithUserId(@PathVariable("userId") long userId,
      @PathVariable("noteId") long noteId) {

    LOG.info("userId" + userId + " noteId " + noteId);

    Optional<Note> NoteOptional = this.noteRepository.findById(noteId);
    Note note = new Note();
    if (NoteOptional.isPresent()) {
      note = NoteOptional.get();

      if (note.getJobId() > 0) {

        if (note.getJobId() > 0) {
          Optional<Job> jobOptional = this.jobRepository.findById(note.getJobId());
          if (jobOptional.isPresent()) {
            VehicleHistory vehicleHistory = new VehicleHistory();
            vehicleHistory.setName("Note");
            vehicleHistory.setType(2); // 0) add 1) update 2) delete
            vehicleHistory.setUserId(userId); // fix later
            vehicleHistory.setVehicleId(jobOptional.get().getVehicleId());
            vehicleHistory.setValue(note.getNotes() + " Notification notes is removed");
            this.vehicleHistoryRepository.save(vehicleHistory);
          }
        }

      }
      note.setArchived(true);
      this.noteRepository.save(note);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}