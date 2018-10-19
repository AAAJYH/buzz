package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Time;
import java.sql.Timestamp;

/**
 * @Author: jyh
 * @Date: 2018/10/18 22:25
 * 酒店订单实体
 */

@Data
@AllArgsConstructor
public class hotelorders {

    private String orderId; //id
    private String hid; //酒店id
    private String roomName; //房型名称
    private String bedType; //床型
    private String inDate; //入住日期
    private String outDate; //离开日期
    private String lastTime; //最晚到店时间
    private String productName; //含不含早
    private Double orderAmout; //订单总金额
    private String passengers; //入住人
    private String contactName; //联系人
    private String contactMobile; //联系电话
    private String email; //电子邮箱
    private String Remark; //备注
    private String userId; //user外键
    private String state; //订单状态
    private Timestamp subTime; //提交时间

}
