package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class replyAskRespondComment
{
    private String replyAskRespondCommentId;
    private String commentContent;
    private String replyAskRespondId;
    private String parentRespondCommentId;
    private replyAskRespondComment parentrespondcomment;
    private String userId;
    private users user;
    private Timestamp releaseTime;
    private String stateId;
}
