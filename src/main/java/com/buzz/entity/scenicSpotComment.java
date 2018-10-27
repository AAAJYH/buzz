package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

/**
 * @Author: jyh
 * @Date: 2018/10/27 1:23
 * 景点评论实体
 */

@Data
@AllArgsConstructor
public class scenicSpotComment {

    private String scenicSpotCommentId; //id
    private String content; //评论内容
    private String pictures; //评论图片
    private String userId; //评论用户id
    private String userName; //用户姓名
    private String userPicture; //用户头像
    private Timestamp commentTime; //评论时间
    private Integer start; //星星
    private String scenicSpotId; //景点外键

}
