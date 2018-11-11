package com.buzz.entity;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @Author: jyh
 * @Date: 2018/11/11 17:26
 */

@Data
public class Log {

    private String logIdj; //id
    private String requestUrl; //请求url
    private String requestParam; //请求参数
    private String requestType; //请求类型
    private String responseContent; //响应内容
    private long TotalTime; //用秒
    private String ip; //ip地址
    private Timestamp createSubtime; //创建时间

}
