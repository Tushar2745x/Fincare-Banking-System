package com.fullstack.dto;

import com.fullstack.entity.IssuedCard;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class IssuedCardResponseDto {
    private List<IssuedCard> cards;
    private String responseMessage;
    private boolean success;
}

