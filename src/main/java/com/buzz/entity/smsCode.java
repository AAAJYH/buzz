package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data //自动添加get/set方法
@AllArgsConstructor//全部参数的构造方法
@NoArgsConstructor//没有参数的构造方法
public class smsCode
{
    private String bindPhone;
    private Integer verificationCode;
}
