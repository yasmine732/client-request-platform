package com.stb.clientrequest.dto;

import com.stb.clientrequest.enums.Role;

public record RegisterClientResponse(

        Long userId,

        Long clientId,

        String referenceClient,

        String email,

        Role role,

        String message

) {
}