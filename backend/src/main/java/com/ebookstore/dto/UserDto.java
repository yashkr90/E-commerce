package com.ebookstore.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Integer giftPoints;
    private LocalDateTime createdAt;
}
