package com.buzz.entity;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 11:57
 * 景点实体层
 */

@Data
public class scenicspot {

    private String scenicSpotId; //uuid
    private String chineseName; //中文名
    private String englishName; //英文名
    private String address; //景点位置
    private String synopsis; //概况
    private String phone; //联系电话
    private String url; //手机号
    private String traffic; //交通
    private String tickets; //门票
    private String openingHours; //开放时间
    private String longitude; //经度
    private String latitude; //纬度
    private String photo; //图片
    private String cityId; //city外键
    private city city;
    private Timestamp uptime; //修改时间
    private String scenicSpotCollectId;//景点收藏编号

}
