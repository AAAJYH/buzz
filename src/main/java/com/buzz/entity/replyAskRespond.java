package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class replyAskRespond
{
    private String replyAskRespondId;
    private String replyHeadPhoto;
    private String replyBrief;
    private String askRespondId;
    private List<replyAskRespondComment> replyaskrespondcomments;
    private askRespond askrespond;
    private String replyAskRespondContent;
    private String userId;
    private users user;
    private Timestamp releaseTime;
    private String optimumAnswer;
    private String stateId;
    private Integer replyAskRespondTopNum;//点赞数量不存在数据库
    private Integer replyAskRespondCommentNum;//回复评论数量不存在数据库
    private String replyAskRespondTopId;//收藏回复问答编号,不存在数据库
}
