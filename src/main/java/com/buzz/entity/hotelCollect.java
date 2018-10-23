package com.buzz.entity;

import lombok.Data;

/**
 * @Author: jyh
 * @Date: 2018/10/17 21:46
 * 酒店收藏实体
 */

@Data
public class hotelCollect {

    private String hotelCollectId; //id
    private String userId; //用户id
    private String hotelId; //酒店id

}
