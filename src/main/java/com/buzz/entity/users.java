package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data //自动添加get/set方法
@AllArgsConstructor//全部参数的构造方法
@NoArgsConstructor//没有参数的构造方法
public class users
{
    public String userId;
    public String userPassword;
    public String bindEmail;
    public String bindPhone;
    public String photo;
    public String userName;
    public String sex;
    public String address;
    public Timestamp birthDate;
    public String individualResume;
    public String stateId;
}
