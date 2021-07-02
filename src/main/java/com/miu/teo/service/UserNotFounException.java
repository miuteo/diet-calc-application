package com.miu.teo.service;

public class UserNotFounException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public UserNotFounException() {
        super("User not found");
    }
}
