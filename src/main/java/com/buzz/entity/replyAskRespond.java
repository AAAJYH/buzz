package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class replyAskRespond
{
    private String replyAskRespondId;
    private String replyHeadPhoto;
    private String replyBrief;
    private String askRespondId;
    private askRespond askrespond;
    private String replyAskRespondContent;
    private String userId;
    private users user;
    private Timestamp releaseTime;
    private String stateId;
}
