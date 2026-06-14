package com.fullstack.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssuedCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String cardType; // DEBIT_CARD / CREDIT_CARD / BUSINESS_CARD

    @Column(length = 19)
    private String cardNumber; // stored as digits (we will display masked on UI)

    private String expiryMonth; // "01".."12"
    private String expiryYear;  // "2026".."2036"
    private String cvv;         // 3-digit CVV

    private String status; // ACTIVE / BLOCKED

    private String createdAt;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "bank_id")
    private Bank bank;

    @OneToOne
    @JoinColumn(name = "card_application_id", unique = true)
    private CardApplication cardApplication;
}

