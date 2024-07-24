package com.worq.worcation.domain.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SignUpRequestDto {
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String nickName;
    @NotBlank
    @Pattern(regexp = "/^\\d{2,3}-\\d{3,4}-\\d{4}$/")
    private String phone;
    @NotBlank
    private String sido;
    @NotBlank
    private String gugun;
}
