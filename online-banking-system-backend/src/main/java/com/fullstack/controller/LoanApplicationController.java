package com.fullstack.controller;

import com.fullstack.dto.CommonApiResponse;
import com.fullstack.dto.LoanApplicationRequestDto;
import com.fullstack.dto.LoanApplicationResponseDto;
import com.fullstack.resource.LoanApplicationResource;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/loan")
@CrossOrigin(origins = "http://localhost:3000")
@SecurityRequirement(name = "Bearer Auth")
@Tag(name = "Loan Application", description = "APIs for loan application processing")
public class LoanApplicationController {

    @Autowired
    private LoanApplicationResource loanApplicationResource;

    @PostMapping("apply")
    @Operation(summary = "Apply for a loan", description = "Submit a new loan application")
    public ResponseEntity<CommonApiResponse> applyLoan(@RequestBody LoanApplicationRequestDto request) {
        return this.loanApplicationResource.addLoanApplication(request);
    }

    @GetMapping("fetch/all")
    @Operation(summary = "Fetch all loan applications", description = "Return all loan applications")
    public ResponseEntity<LoanApplicationResponseDto> getAllLoanApplications() {
        return this.loanApplicationResource.fetchAllLoanApplications();
    }

    @GetMapping("fetch/customer")
    @Operation(summary = "Fetch loan applications by customer", description = "Return loan applications for a specific customer")
    public ResponseEntity<LoanApplicationResponseDto> getLoanApplicationsByCustomer(@RequestParam("customerId") int customerId) {
        return this.loanApplicationResource.fetchLoanApplicationsByCustomer(customerId);
    }

    @GetMapping("fetch/bank")
    @Operation(summary = "Fetch loan applications by bank", description = "Return loan applications assigned to a specific bank")
    public ResponseEntity<LoanApplicationResponseDto> getLoanApplicationsByBank(@RequestParam("bankId") int bankId,
                                                                                 @RequestParam(value = "status", required = false) String status) {
        return this.loanApplicationResource.fetchLoanApplicationsByBank(bankId, status);
    }

    @GetMapping("fetch/id")
    @Operation(summary = "Fetch loan application by id", description = "Return loan application details by id")
    public ResponseEntity<LoanApplicationResponseDto> getLoanApplicationById(@RequestParam("applicationId") int applicationId) {
        return this.loanApplicationResource.fetchLoanApplicationById(applicationId);
    }

    @PostMapping("update/status")
    @Operation(summary = "Update loan application status", description = "Approve or reject a loan application")
    public ResponseEntity<CommonApiResponse> updateLoanStatus(@RequestParam("applicationId") int applicationId,
                                                              @RequestParam("status") String status) {
        return this.loanApplicationResource.updateLoanStatus(applicationId, status);
    }
}
