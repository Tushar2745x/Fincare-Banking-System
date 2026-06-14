package com.fullstack.dto;

import com.fullstack.entity.LoanApplication;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LoanApplicationResponseDto extends CommonApiResponse {

    private List<LoanApplication> applications;
}
