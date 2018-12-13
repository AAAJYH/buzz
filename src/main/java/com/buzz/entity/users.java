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
    private String userId;
    private String userPassword;
    private String bindEmail;
    private String bindPhone;
    private String photo;
    private String userName;
    private String sex;
    private String address;
    private city city;
    private Timestamp birthDate;
    private String individualResume;
    private String stateId;
    private Integer nums;//不存在数据库,用来存在回复问答数量,被顶数量,被采纳数量
}
