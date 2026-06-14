package com.fullstack.dto;

import com.fullstack.entity.CardApplication;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CardApplicationResponseDto {

    private List<CardApplication> applications;
    private String responseMessage;
    private boolean success;
}

