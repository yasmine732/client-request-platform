package com.stb.clientrequest.repository;

import com.stb.clientrequest.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClientRepository
        extends JpaRepository<Client, Long> {

    boolean existsByEmailIgnoreCase(
            String email
    );

    Optional<Client> findByEmailIgnoreCase(
            String email
    );

    @Query("""
            SELECT client
            FROM Client client
            WHERE LOWER(
                    COALESCE(client.referenceClient, '')
                  )
                  LIKE LOWER(
                    CONCAT('%', :texte, '%')
                  )

               OR LOWER(
                    COALESCE(client.nom, '')
                  )
                  LIKE LOWER(
                    CONCAT('%', :texte, '%')
                  )

               OR LOWER(
                    COALESCE(client.prenom, '')
                  )
                  LIKE LOWER(
                    CONCAT('%', :texte, '%')
                  )

               OR LOWER(
                    COALESCE(client.raisonSociale, '')
                  )
                  LIKE LOWER(
                    CONCAT('%', :texte, '%')
                  )

               OR LOWER(
                    COALESCE(client.email, '')
                  )
                  LIKE LOWER(
                    CONCAT('%', :texte, '%')
                  )

               OR LOWER(
                    COALESCE(client.telephone, '')
                  )
                  LIKE LOWER(
                    CONCAT('%', :texte, '%')
                  )
            """)
    List<Client> rechercher(
            @Param("texte") String texte
    );
}