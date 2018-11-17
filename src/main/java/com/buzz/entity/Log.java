package com.buzz.entity;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @Author: jyh
 * @Date: 2018/11/11 17:26
 */

@Data
public class Log {

    private String logId; //id
    private String requestUrl; //请求url
    private String requestType; //请求类型
    private long totalTime; //用秒
    private String ip; //ip地址
    private Timestamp createSubtime; //创建时间

}
