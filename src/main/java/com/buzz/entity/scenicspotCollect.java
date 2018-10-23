package com.buzz.entity;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @Author: aaaJYH
 * @Date: 2018/10/3 17:42
 * 景点收藏实体
 */

@Data
public class scenicspotCollect {
    private String scenicSpotCollectId; //id
    private String scenicSpotId; //scenicspot外键
    private String usersId; //users外键
    private Timestamp collectTime; //收藏时间
}
