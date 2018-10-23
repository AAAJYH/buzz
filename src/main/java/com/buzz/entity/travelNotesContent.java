package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class travelNotesContent
{
    private String type;
    private String value;
    private double width;
    private double height;
}
