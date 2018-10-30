package com.buzz.entity;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/22 15:56
 */

import lombok.Data;

/**
 * 管理员账号实体
 */

@Data
public class Admin {

    private Integer id;
    private String adname;
    private String pwd;
    private String state;
    private int rid;

}
