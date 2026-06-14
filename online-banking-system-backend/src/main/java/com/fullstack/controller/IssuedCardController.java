package com.fullstack.controller;

import com.fullstack.dto.IssuedCardResponseDto;
import com.fullstack.resource.IssuedCardResource;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/issued-card")
@CrossOrigin(origins = "http://localhost:3000")
@SecurityRequirement(name = "Bearer Auth")
@Tag(name = "Issued Card", description = "APIs for generated/issued cards")
public class IssuedCardController {

    @Autowired
    private IssuedCardResource issuedCardResource;

    @GetMapping("fetch/customer")
    @Operation(summary = "Fetch issued cards by customer", description = "Return generated cards for a customer after approval")
    public ResponseEntity<IssuedCardResponseDto> fetchByCustomer(@RequestParam("customerId") int customerId) {
        return this.issuedCardResource.fetchByCustomer(customerId);
    }
}

