package com.buzz.entity;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 8:16
 * 省实体层
 */

@Data
public class province {

    private String provinceId; //uuid
    private String provinceName; //省名称
    private String stateId; //状态（删除/未删除）
    private Timestamp uptime; //修改时间

}
