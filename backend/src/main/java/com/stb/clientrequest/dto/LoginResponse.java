package com.stb.clientrequest.dto;

import com.stb.clientrequest.enums.Role;

public record LoginResponse(

        Long userId,

        Long clientId,

        String nom,

        String prenom,

        String email,

        Role role,

        String message

) {
}