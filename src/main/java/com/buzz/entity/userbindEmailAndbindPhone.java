package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class userbindEmailAndbindPhone
{
    private String updateId;
    private String userId;
    private String updatebindEmail;
    private String updatebindEmailstateId;
    private String updatebindPhone;
    private String updatebindPhonestateId;
    private String verificationMode;
    private Integer verificationCode;
    private String type;
}
