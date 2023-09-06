package com.example.demo.Controller;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.example.demo.Objects.DisplayForm;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class DisplayOperationController {
	
	//初期ターミナル画面へ遷移します。
	@RequestMapping("/TotalTerminal")
	public String toTotalTerminal() {
		return "TotalTerminal";
	}
	

	//画面遷移を行います。
	//画面form内の項目を次画面へ取り次ぎます。
	@RequestMapping("/gotoward")
	public ModelAndView gotoward(@ModelAttribute DisplayForm form) {
		ModelAndView mv = new ModelAndView();
		mv.setViewName(form.getDestination());
		//formオブジェクトに存在する値を全て受け渡しするための処理
		//一度Mapに変換してからModelAndViewに受け渡します。
		Map<String,Object> map = new ObjectMapper().convertValue(form, Map.class);
		map.forEach((k,v)->{
			mv.addObject(k, v);
		});
		return mv;
	}
}
