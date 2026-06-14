package com.fullstack.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
@Log4j2
public class RequestHeaderInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
		// we can validate few things before the request goes to controller

		log.info("preHandle() method invoked");
		log.info("---------------- Request Start ---------------");
		log.info("Request URL: {}", request.getRequestURI());
		log.info("Method Type: {}", request.getMethod());
		log.info("Local Address: {}", request.getLocalAddr());

		return true;
	}

	@Override
	@SneakyThrows
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {

		log.info("postHandle() method invoked");

		HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
	}

	@Override
	@SneakyThrows
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {

		log.info("afterCompletion() method invoked");

		log.info("Status: {}", response.getStatus());
		log.info("---------------- Request End ---------------");

		HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
	}

}
