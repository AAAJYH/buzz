package com.buzz.configuration;
/**
 * 支付宝配置信息
 * @author linhongcun
 *
 */
public class AlipayConfig {

    //开发者中心 / 研发服务 / 沙箱环境 / 沙箱应用/ 信息配置/ 必看部分/ APPID（填自己的，下面都是改过的~）
    public static String app_id = "2016091300504325";

    //开发者中心 / 研发服务 / 沙箱环境 / 沙箱应用/ 信息配置/ 必看部分/ 支付宝公钥（填自己的，下面都是改过的~）  注意：是支付宝公钥而不是应用公钥
    public static String public_key = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuQKhs41sany+t+dR0tY+MT3V6nJkXc3UMYHD1D/Pm/DlzsxC3glErLIV3It/ag8RsjjAmn6umA6JBaI81/8B/o31ZXv+fuYJZJodOOd+gCMIH5TvUbxZvg587LOxFI3opfa8erFkZOuSFgR675yPCX3yQZY0WyeGzmIqAYQKUnvxgHc63cu4eS6JNA4ySYxXIjuvE9f/qrtjtKQ6XKsKztlQVBW/Zsvz03CwMbraLbwFD4tcyzE87hOjv1k6QeV419B4Emp86jQNsZnDO2/pcM2C1PFl9Ll1EorT3aHSZRCgC1Y3zJGaH/4F7IrayywR6c0Y20sijjwGgb0o34KFkwIDAQAB";

    //开发者中心 / 研发服务 / 沙箱环境 / 沙箱应用/ 信息配置/ 必看部分/ 生成公钥时对应的私钥（填自己的，下面都是改过的~）
    public static String private_key = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCW6NsmGdfpDVGwVxz9xB+P5GIsu2bmJJRi2hv6Fk/6jETbebEHmHEJeFunIMR4u7GiuehF6tAPxclIx7lbzKyG8NByI+EjV75shgtzasbKt4lYExg9/efG7TmC6xX9KFPnyxhexuBZnv+z3ML49BxagqWxCPizrG2KZZEVcKRjch+oRPep5i4SO9K9Qt1U//1RGWPg1RDHLhCmneLpCkG3HDDOJXG1XKkeSjd25+kT5fncoIuUUTaKSmTId1CazfKIMI0FDoIUIBH5CXyH58UqQ9R+zViMIfzUL3jQJduGJ9EDFKGQWrclPcdpZ5pTmZE0YY9F3Yltri1Bsv8cmn+VAgMBAAECggEALaswTtp5TazbMMtcGavVhV0vHKxl2nXtdfDdkJRaBc+XMvgjy9GlO6Fx0yUGcCcU/dLW6PnDl1JatKzEenR5LakI29Hh2yk9lmgGZRpGKKjcZov4xSHml3vI8Mal8+PVaIs8x8nVsSl95neDhYWSYw2wiN/XK8CdsclE28En7nPrg/w7mFy4rpbxKUdQJRP/aXpm843zPzv+VxqbntDQtbv652bdnfhLC80sOmpi/e48vdQLRN6b6vgZC5pxWx+8ktGM+LtZYyTUiALljyjjlEGmFreqvtZuIPAkdxlxdsO/rgsVny4ZijOh6Ne+/a1hW0ChxrN1w9G6IO2plL+BIQKBgQD6n9YRnU7cgiZJsITO4FB4SdT1UN+WE7lYBTu1nSHMRQynPm6kOeInA59V0YSS+1gA95mUgCxL79BV4G5iGxClZZLFiDV5+H6DvI7ekmLSszGsmWsjaCy0d6MBubzjjXJEJWNez4VZ0szbX7fB64JJt4OW+GXepQ+hU62dFJxp/QKBgQCaJX3qcWwuI848adcQ97/Xdtg1H48pcbNa8clnbX0L3aAOudxnHOQ5BOOmQz4DwMqn7FyRe5Aa+W0cjcO1Ll4cPwzxmiTw13z0DgtOTe6MjmsMGdF0KaKic/xYOM95lrk12CvCiW/V5xJsOAe/3QslP4eKAFclez5lsD9BPXszeQKBgQDtlnipWidYg0kosl40gBHI9rUbmf9blncuKkfgc4WG0C6enWDl7rmlopl6EZVMgVl8ET1WuetEUaN+xbPe7Slqok/xUp7fceL9n9MQzFVCyP1eUlJuzmMS8hdlm16lmYGpeIgraS9RZ7UsgiEBhPGOUJo+lFx+JJwco+cB8ngVQQKBgHsBWgZgNixnhCZvayBuIxdEDenuYiZ3ReFXuhkfpL54P0YhCID77B6YCTVeyTjjepQfqAqr6GWuDmTPt5F4C79MjP6qu7m4q0xxfJIi3C4rY77HR34Dz3UFSyP3SZDENs2B0AGv/J9bgjb7SyvOrxstI/J6rRAK1dL9nqxn7E05AoGBAK+pGJtrxdxDmiIhl8Q76cy1AL9DdKmqTln1X4CjDrBWufLH4MAnc0MGxHyvePTihIb22xZIVkNM7GVK/F1p6i5Ukj+bSXca9+8nRlf4DTLEdQwn6E6WgASBNectcC0F4OT5j0ZsRaEqSYH7zihdTqUaQMsbwfBp3Q+m5LHxHWo+";

    //Controller Mapping:得放到服务器上，且使用域名解析 IP
    public static String notify_url =    "http://localhost:80/alipayController/returnUrl";

    //Controller Mapping:得放到服务器上，且使用域名解析 IP
    public static String return_url = "http://localhost:80/alipayController/returnUrl";

    //开发者中心 / 研发服务 / 沙箱环境 / 沙箱应用/ 信息配置/ 必看部分/ 支付宝网关（注意沙箱alipaydev，正式则为 alipay）
    public static String url = "https://openapi.alipaydev.com/gateway.do";

    public static String charset = "UTF-8";

    public static String format = "json";

    public static String signtype = "RSA2";

}
