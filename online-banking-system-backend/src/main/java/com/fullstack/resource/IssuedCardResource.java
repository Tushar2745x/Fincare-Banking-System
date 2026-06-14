package com.fullstack.resource;

import com.fullstack.dto.IssuedCardResponseDto;
import com.fullstack.entity.IssuedCard;
import com.fullstack.service.IssuedCardService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Log4j2
public class IssuedCardResource {

    @Autowired
    private IssuedCardService issuedCardService;

    public ResponseEntity<IssuedCardResponseDto> fetchByCustomer(int customerId) {
        IssuedCardResponseDto response = new IssuedCardResponseDto();
        if (customerId == 0) {
            response.setCards(List.of());
            response.setResponseMessage("bad request, missing data");
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        List<IssuedCard> cards = this.issuedCardService.getByCustomer(customerId);
        response.setCards(cards);
        response.setResponseMessage("Issued cards fetched successfully");
        response.setSuccess(true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

