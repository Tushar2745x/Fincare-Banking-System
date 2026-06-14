package com.fullstack.controller;

import com.fullstack.dto.CardApplicationRequestDto;
import com.fullstack.dto.CardApplicationResponseDto;
import com.fullstack.dto.CommonApiResponse;
import com.fullstack.resource.CardApplicationResource;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/card")
@CrossOrigin(origins = "http://localhost:3000")
@SecurityRequirement(name = "Bearer Auth")
@Tag(name = "Card Application", description = "APIs for card application processing")
public class CardApplicationController {

    @Autowired
    private CardApplicationResource cardApplicationResource;

    @PostMapping("apply")
    @Operation(summary = "Apply for a card", description = "Submit a new card application")
    public ResponseEntity<CommonApiResponse> apply(@RequestBody CardApplicationRequestDto request) {
        return this.cardApplicationResource.apply(request);
    }

    @GetMapping("fetch/customer")
    @Operation(summary = "Fetch card applications by customer", description = "Return card applications for a specific customer")
    public ResponseEntity<CardApplicationResponseDto> fetchByCustomer(@RequestParam("customerId") int customerId) {
        return this.cardApplicationResource.fetchByCustomer(customerId);
    }

    @GetMapping("fetch/bank")
    @Operation(summary = "Fetch card applications by bank", description = "Return card applications for a specific bank")
    public ResponseEntity<CardApplicationResponseDto> fetchByBank(@RequestParam("bankId") int bankId,
                                                                  @RequestParam(value = "status", required = false) String status) {
        return this.cardApplicationResource.fetchByBank(bankId, status);
    }

    @PostMapping("update/status")
    @Operation(summary = "Update card application status", description = "Approve or reject a card application")
    public ResponseEntity<CommonApiResponse> updateStatus(@RequestParam("applicationId") int applicationId,
                                                          @RequestParam("status") String status) {
        return this.cardApplicationResource.updateStatus(applicationId, status);
    }
}

