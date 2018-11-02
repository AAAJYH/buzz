package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

/**
 * @Author: jyh
 * @Date: 2018/10/27 9:47
 * 评论回复实体
 */

@Data
@AllArgsConstructor
public class scenicSpotCommentReply {

    private String commentReplyId; //id
    private String userName; //回复用户姓名
    private String userId; //回复用户Id
    private String replyUserName; //被回复用户名称
    private String replyUserId; //被回复用户id
    private String replyContent;//回复内容
    private Timestamp replyTime; //回复时间
    private String scenicSpotCommentId; //景点评论外键

}
