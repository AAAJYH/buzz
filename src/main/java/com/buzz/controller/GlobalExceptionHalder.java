package com.buzz.controller;

        import org.springframework.boot.web.servlet.error.ErrorController;
        import org.springframework.web.bind.annotation.ControllerAdvice;
        import org.springframework.web.bind.annotation.ExceptionHandler;
        import org.springframework.web.bind.annotation.RequestMapping;

@ControllerAdvice
public class GlobalExceptionHalder
{
    @ExceptionHandler(RuntimeException.class)
    public String toError500()
    {
        return "redirect:/500.html";
    }
}
