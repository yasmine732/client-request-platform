package com.stb.clientrequest.repository;

import com.stb.clientrequest.entity.Demande;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DemandeRepository extends JpaRepository<Demande, Long> {
}
