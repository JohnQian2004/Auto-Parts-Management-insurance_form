package com.xoftex.parthub.controllers;

import java.util.ArrayList;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Company;
import com.xoftex.parthub.models.Employee;

import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.CustomerRepository;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.JobRepository;

import com.xoftex.parthub.repository.UserRepository;

import com.xoftex.parthub.security.jwt.JwtUtils;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    JobRepository jobRepository;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    JwtUtils jwtUtils;

    @Value("${image.root.path}")
    // String filePath = "C:\\Projects\\images\\";
    String filePath = "";

    String imageNamePrefix = "test_image_";

    private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

    @PostMapping("/{id}")
    public ResponseEntity<Employee> createUpdateEmployee(@PathVariable("id") long id, @RequestBody Employee employeeIn) {

        Optional<User> userOptional = this.userRepository.findById(id);
        Employee employee = new Employee();
        String randomCode = UUID.randomUUID().toString();
        if (employeeIn.getId() == 0 || employeeIn.getToken() == null || employeeIn.getToken().equals("") || employeeIn.isShallResetToken() == true) {
            employeeIn.setToken(randomCode);
        }
 

        if (userOptional.isPresent()) {

            employeeIn.setUserId(id);

            employee = this.employeeRepository.save(employeeIn);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(employee, HttpStatus.CREATED);

    }

    @GetMapping("")
    public ResponseEntity<List<Employee>> getAllEmployees() {

        List<Employee> employees = new ArrayList<Employee>();
        employeeRepository.findAll().forEach(employees::add);
        if (employees.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Employee>> getComponentEmployees(@PathVariable("companyId") long companyId) {

        List<Employee> employees = new ArrayList<Employee>();

        employees = employeeRepository.findByCompanyIdOrderByFirstNameAsc(companyId);
        if (employees.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {

            for (Employee employee : employees) {
                if (employee.getToken() == null) {
                    String randomCode = UUID.randomUUID().toString();
                    employee.setToken(randomCode);
                    this.employeeRepository.save(employee);
                }

                int jobCountsUnfinished = this.jobRepository.countByArchivedAndEmployeeIdAndStatus(false,
                        employee.getId(), 0);
                int jobCountsFinished = this.jobRepository.countByArchivedAndEmployeeIdAndStatus(false,
                        employee.getId(), 1);

                employee.setJobCountsUnfinished(jobCountsUnfinished);
                employee.setJobCountsFinished(jobCountsFinished);
            }

        }

        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @GetMapping("/employee/uuid/{uuid}")
    public ResponseEntity<List<Employee>> getCompanyEmployeesByEmployeeUuid(@PathVariable("uuid") String uuid) {

        //compomised for the moment; has to change later
        LOG.info(uuid);
        List<Employee> employees = new ArrayList<>();
        Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuid);
        if (employeeOptional.isPresent()) {
            Optional<Company> companyOptional = this.companyRepository.findById(employeeOptional.get().getCompanyId());
            if (companyOptional.isPresent()) {
                employees = employeeRepository.findByCompanyIdOrderByFirstNameAsc(companyOptional.get().getId());
                if (employees.isEmpty()) {
                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } else {

                    for (Employee employee : employees) {
                        if (employee.getToken() == null) {
                            String randomCode = UUID.randomUUID().toString();
                            employee.setToken(randomCode);
                            this.employeeRepository.save(employee);
                        }
                    }
                }
            }

        }

        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @GetMapping("/company/uuid/{companyId}")
    public ResponseEntity<List<Employee>> getComponentEmployeesUuid(@PathVariable("companyId") String uuid) {

        List<Employee> employees = new ArrayList<Employee>();
        Optional<Company> companyOptional = this.companyRepository.findByToken(uuid);

        if (companyOptional.isPresent()) {
            employees = employeeRepository.findByCompanyIdOrderByFirstNameAsc(companyOptional.get().getId());
            if (employees.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {

                for (Employee employee : employees) {
                    if (employee.getToken() == null) {
                        String randomCode = UUID.randomUUID().toString();
                        employee.setToken(randomCode);
                        this.employeeRepository.save(employee);
                    }
                }
            }
        }

        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @GetMapping("/uuid/{id}")
    public ResponseEntity<Employee> getEmployeeByUuid(@PathVariable("id") String uuid) {
        LOG.info("" + uuid);
        Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuid);
        Employee employee = new Employee();
        if (employeeOptional.isPresent()) {
            employee = employeeOptional.get();
            return new ResponseEntity<>(employee, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable("id") long id) {
        LOG.info("" + id);
        Optional<Employee> employeeOptional = this.employeeRepository.findById(id);
        Employee employee = new Employee();
        if (employeeOptional.isPresent()) {
            employee = employeeOptional.get();
            return new ResponseEntity<>(employee, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable("id") long id) {
        LOG.info("" + id);
        Optional<Employee> employeeOptional = this.employeeRepository.findById(id);
        Employee employee = new Employee();
        if (employeeOptional.isPresent()) {
            employee = employeeOptional.get();

            List<Job> jobs = this.jobRepository.findByEmployeeId(id);

            for (Job job : jobs) {
                this.jobRepository.delete(job);
            }

            this.employeeRepository.delete(employee);

            return new ResponseEntity<>(null, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }
}
