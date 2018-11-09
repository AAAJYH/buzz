package com.buzz.entity;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @Author: aaaJYH
 * @Date: 2018/10/3 20:02
 * 攻略实体
 */

@Data
public class strategy {

    private String strategyId; //id
    private String strategyPhoto; //攻略图片内容
    private String strategyHeadline; //旅游攻略标题
    private String strategyBriefIntroduction; //攻略简介
    private String scenicSpot; //有关景点
    private String cityId; //city外键
    private long downloadNumber; //下载数量
    private Timestamp updateTime; //修改时间
    private String stateId; //状态外键

}
