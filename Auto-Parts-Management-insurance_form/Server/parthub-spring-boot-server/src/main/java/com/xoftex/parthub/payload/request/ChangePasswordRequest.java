package com.xoftex.parthub.payload.request;

import jakarta.validation.constraints.*;

public class ChangePasswordRequest {

    @NotBlank
    @Size(min = 6, max = 30)
    private String oldPassword;

    @NotBlank
    @Size(min = 6, max = 30)
    private String newPassword;

    public String getOldPassword() {
        return oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    
}
