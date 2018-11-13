package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class replyAskRespondTop
{
    private String replyAskRespondTopId;
    private String replyAskRespondId;
    private String userId;
    private Timestamp releaseTime;
}
