package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class askRespond
{
    private String askRespondId;
    private String askRespondTitle;
    private String askRespondDetail;
    private String interestLabelId;
    private interestLabel interestlabel;
    private String cityId;
    private city city;
    private String userId;
    private users user;
    private Timestamp releaseTime;
    private String stateId;
    private Integer replyAskRespondNum;
    private replyAskRespond replyaskrespond;
}
