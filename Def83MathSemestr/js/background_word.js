
var col_tabl = 0;
var vnut_tabl = 1;
var width_tabl = 9576/2;

var test_chis_for = 0;
var test_chis_for_max = 10000;

var bool_podpisy = true;

function getHtmlWord(html){
	//html - разметка решения
	
	console.log(html.premain);
	let massiv_br = (html.premain).split('<br>');//разбиваем на строки сплитом на <br>
	
	let text_rtf = "";
	
	text_rtf += "{\\rtf\\utf8{\\author Deff83}{\\fonttbl\\f0\\fnil Times New Roman;{\\f1\\fnil Autumn;}{\\f2\\fnil Times New Roman;}{\\f3\\fnil Calligraphic}}{\\colortbl;\\red255\\green200\\blue200;\\red170\\green0\\blue170;\\red255\\green160\\blue160;}{\\f2\\fs28 \\qj \\fi851\\sb100\\sa100 "; //кодировка utf8, автор Deff83, таблица шрифта (каждому f1, f2 соответствует шрифт), отступ на весь документ fi851, sb100 интервал после абзаца, sa100 интервал перед абзацем qj - выравнивание по ширене, fs - 14 шрифт
	
	if (bool_podpisy) {text_rtf = text_rtf + preobraz(codeStringRus(podpisi_Deff83()))+"{\\par}"};
	
	col_tabl = 0;
	vnut_tabl = 1;
	
	for (let i = 0; i < massiv_br.length; ++i) {
		let pre_text = massiv_br[i];//получаем строку
		
		//pre_text = preobr_znachki(pre_text);//символы степени и значки
		
		pre_text = poprob_nal(pre_text, 0);//проверяем наличие таблицы или картинки
		pre_text = preobraz(pre_text);//преобразуем символы
		
		text_rtf += codeStringRus(pre_text+"{\\par}");//и русский текст
	}
	
	
	text_rtf += "}}";//закрываем открытый в самом начале скобки
	
	console.log(text_rtf)
	
	
	writeFile("Deff83.rtf", text_rtf); 
}

function podpisi_Deff83(){
return "<b>Файл rtf создан при помощи скрипта {\\f3\\fs36\\cf2 Deff83} script</b>{\\qc \\par} {\\fs16\\cf2  https://github.com/deff83 }{\\qc \\par}";
}

function add_znach_string(text_code, cursor, znach){
	let text = text_code;
	if (cursor == 1) return znach+text.substring(0);
	return text.substring(0, cursor)+znach+text.substring(cursor);
}

function preobr_znachki(text_code){
	let text = text_code;
	cursor = text.length;//курсор считывания формулы
	
	let massiv_znach = [];
	let massiv_znach_scobki = [];
	
	let skobki = 0;
	
	while(cursor > 0){
		cursor--;
		let symbol = text.substring(cursor, cursor+1);
		
		if (cursor >= 6 && text.substring(cursor-6, cursor+1)=="\\limits"){
			massiv_znach.splice(massiv_znach.length-2, 2);
			massiv_znach_scobki.splice(massiv_znach_scobki.length-2, 2);
		}
		
		if (cursor<text.length-1){
			
			let znachki = text.substring(cursor, cursor+2);
			console.log(znachki);
			if(znachki == "_{"){
				massiv_znach_scobki.push(0);
				massiv_znach.push("_{");
				/*if (cursor > 0) {
					if (text.substring(cursor-1, cursor)==")"){
						massiv_znach.splice(massiv_znach.length-1, 1);
						massiv_znach.push(")_{");
					}
				}*/
			}
			if(znachki == "^{"){
				massiv_znach_scobki.push(0);
				massiv_znach.push("^{");
				/*if (cursor > 0) {
					if (text.substring(cursor-1, cursor)==")"){
						massiv_znach.splice(massiv_znach.length-1, 1);
						massiv_znach.push(")^{");
					}
				}*/
			}
			
			
		}
		
		
		if(massiv_znach[massiv_znach.length-1]=="_{"){
			if (symbol == "}" || symbol == ")"){
				massiv_znach_scobki[massiv_znach_scobki.length-1]++;
			}
			if (massiv_znach_scobki[massiv_znach_scobki.length-1]==0){
				if (symbol == "{" || symbol == "[" || symbol == "(" || symbol == " " || symbol == "=" || cursor == 0){
					text = add_znach_string(text, cursor+1, "__");
					massiv_znach.splice(massiv_znach.length-1, 1);
					massiv_znach_scobki.splice(massiv_znach_scobki.length-1, 1);
					cursor++;
					continue;
				}
			}
			if (symbol == "{" || symbol == "("){
				massiv_znach_scobki[massiv_znach_scobki.length-1]--;
				
			}
		}
		
		if(massiv_znach[massiv_znach.length-1]=="^{"){
			if (symbol == "}" || symbol == ")"){
				massiv_znach_scobki[massiv_znach_scobki.length-1]++;
			}
			if (massiv_znach_scobki[massiv_znach_scobki.length-1]==0){
				if (symbol == "{" || symbol == "[" || symbol == "(" || symbol == " " || symbol == "=" || cursor == 0){
					text = add_znach_string(text, cursor+1, "^^");
					massiv_znach.splice(massiv_znach.length-1, 1);
					massiv_znach_scobki.splice(massiv_znach_scobki.length-1, 1);
					cursor++;
					continue;
				}
			}
			if (symbol == "{" || symbol == "("){
				massiv_znach_scobki[massiv_znach_scobki.length-1]--;
				
			}
		}
		
		
		
		
		
		
		console.log(vivodmass(massiv_znach));
		console.log(vivodmass(massiv_znach_scobki));
		
	}
	
	return text;
}


function poprob_nal(text_code, vnutr){
	let text = text_code;
	
	let divd = document.createElement('div');
	divd.innerHTML = text_code;
	
	let tables = divd.getElementsByTagName("table");

	if (tables.length > 0){
		console.log(tables.length);
		
		
		vnut_tabl++;
		
		if(vnutr == 0){
		col_tabl++;
		vnut_tabl=1;
		text = "{Таблица - "+col_tabl+"}{\\fi0 \\par}{\\fi0\\qc";//название fi отступ qc выравнивание по середине
		
		}else{
			text = "{";
		}
		
		
		let tr_s = tables[0].getElementsByTagName("tr");//берем первую табличку (на сайте так сделано, что первая таблица главная на все в строке)
		
		for (let i = 0; i < tr_s.length; ++i) {
			
			if ((tr_s[i].parentElement.parentElement)!=tables[0]) continue;//если родитель tr не главная таблица
			
			let td_s = tr_s[i].getElementsByTagName("td");
			
			if(vnutr==0){
				width_tabl = 9576/td_s.length;//размер ячейки 9576/(количество столбцов)
				
				if(tables.length > 1){//если внутри вложена табличка - то удалить последннюю пустую столбец
					width_tabl = 9576/(td_s.length-1);
				}
			}
			
			let size = 24;//шрифт в таблице 14
			
			if (td_s.length > 8) size = 20;//если столбцов больше 8 то 10
			if (td_s.length > 10) size = 18;//если столбцов больше 10 то 9
			
			if(vnutr!=0){
					text += "\\itap"+vnut_tabl;
			}
			
			text += " {\\trowd \\fs"+size+"\\qc ";//itap -подуровень таблицы, fs - размер букв
			
			let nach = "{";//описание значений ячейки
			
			let end_text = "";//разметка ячеек
			
			
			
			for (let j = 0; j < td_s.length; ++j) {
				
				//if(vnutr==0 & j==td_s.length-1) continue;
				if(tables.length > 1 & j==td_s.length-1){//если внутри вложена табличка - то удалить последннюю пустую столбец
					continue;
				}
				
				if ((td_s[j].parentElement.parentElement.parentElement)!=tables[0]) continue;//если родитель td не главная таблица
				
			nach += "{"+poprob_nal(td_s[j].innerHTML, 1)+"}" + "\\cell ";
				if(td_s[j].hasAttribute("bgcolor")){
					end_text += "\\clcbpatraw3";
				}
				end_text += "\\clwWidth"+(width_tabl)+"\\cellx"+((width_tabl-108-1)+(width_tabl-1)*j)+"";//размеры ячеек с рамкой
				if(tables.length == 1){//если конечная таблица
				end_text += " \\clbrdrt\\brdrs \\clbrdrl\\brdrs \\clbrdrb\\brdrs \\clbrdrr\\brdrs "
				}
				
			}
			
			end_text += "";
			nach += "}";
			
			text += nach;
			
			if(vnutr!=0 & tables.length>1){
					text += "\\trftsWidth0\\trftsWidthB0\\trautofit0\\trpaddl0\\trpaddr0\\trpaddf0\\trpaddft0\\trpaddfb0\\trpaddfr0\\tblrsid10033287\\tbllkhdrrows\\tbllkhdrcols\\tbllknocolband\\tblind0\\tblindtype3 ";//отступы от границ ячейки
			}else{
text += "\\trftsWidth1\\trftsWidthB3\\trautofit1\\trpaddl108\\trpaddr108\\trpaddfl3\\trpaddft3\\trpaddfb3\\trpaddfr3\\tblrsid10033287\\tbllkhdrrows\\tbllkhdrcols\\tbllknocolband\\tblind0\\tblindtype3 ";//отступы от границ ячейки
			}
			
			if(tables.length == 1){//если конечная таблица
text += "\\clbrdrt\\brdrs \\clbrdrl\\brdrs \\clbrdrb\\brdrs \\clbrdrr\\brdrs "; //единичная рамка
			}
			text += end_text;
			text += "\\row}\\pard \\ltrpar\\ql";//закрытие строки ячейки


		}
		
		text += "}";//закрытие таблицы
	} else {
	
	let formuls = divd.getElementsByTagName("img");//если есть картинка

	let src_formul_s = "";

	if (formuls.length > 0){
		
		let mass_split_formuls = text.split('<img class="img-online" src="https:\/\/chart.googleapis.com\/chart?');
		
		for (let i = 0; i < mass_split_formuls.length; ++i) {
			let razdel_mass_formul = mass_split_formuls[i].split('">');
			if (razdel_mass_formul.length > 1){
				let formul = razdel_mass_formul[0];
				
				if(test_chis_for < test_chis_for_max) {
					src_formul_s += formul_preobr(preo_rus_utf_href(preobr_znachki(formul.substring(15))));//cht=tx&amp;chl=       смещение на 15
					test_chis_for++;
				}
				
				let ostalnoe = razdel_mass_formul[1];
				
				src_formul_s += poprob_nal(ostalnoe);
			}
		}
		
		
		
		return src_formul_s;
	}
	}
	
	if (bool_podpisy){
		let divs = divd.getElementsByTagName("div");
		if (divs.length > 0){
			text  = "{\\cf1 "+text+"}";
		}
		let as = divd.getElementsByTagName("a");
		if (as.length > 0){
			text  = "{\\cf1 "+text+"}";
		}
		if (text_code == "</div>"){
			text  = "{\\cf1 "+text+"}";
		}
	}
	

	
	return text;
}

function preobraz(text_code){
	let text = text_code;
	
	text = text.replace(new RegExp("#", 'g'), "{$} ");//link for button downlod file
	
	text = text.replace(new RegExp("<b>", 'g'), "{\\b ");
	text = text.replace(new RegExp("</b>", 'g'), "}");
	
	text = text.replace(new RegExp("<i>", 'g'), "{\\i ");
	text = text.replace(new RegExp("</i>", 'g'), "}");
	
	text = text.replace(new RegExp("<sub>", 'g'), "{\\sub ");
	text = text.replace(new RegExp("</sub>", 'g'), "}");
	
	text = text.replace(new RegExp("<sup>", 'g'), "{\\super ");
	text = text.replace(new RegExp("</sup>", 'g'), "}");
	
	
	text = text.replace(new RegExp("≈", 'g'), "\\u8776\\'3f");
	text = text.replace(new RegExp("∞", 'g'), "\\u8734\\'3f");
	text = text.replace(new RegExp("—", 'g'), " \\endash ");
	text = text.replace(new RegExp("–", 'g'), " \\endash ");
	text = text.replace(new RegExp("•", 'g'), "\\u8729\\'95");
	text = text.replace(new RegExp("·", 'g'), "\\u8729\\'95");
	text = text.replace(new RegExp("÷", 'g'), " \\endash ");
	text = text.replace(new RegExp("№", 'g'), "\\'b9");
	
	
	
	//><≤≥≠∆∑∏
	text = text.replace(new RegExp("&lt;", 'g'), "<");
	text = text.replace(new RegExp("&gt;", 'g'), ">");
	
	text = text.replace(new RegExp("≤", 'g'), "\\u8804\\'3f");
	text = text.replace(new RegExp("≥", 'g'), "\\u8805\\'3f");
	text = text.replace(new RegExp("≧", 'g'), "\\u8805\\'3f");//>
	text = text.replace(new RegExp("≦", 'g'), "\\u8804\\'3f");//<
	text = text.replace(new RegExp("∆", 'g'), "\\u8710\\'3f");
	text = text.replace(new RegExp("→", 'g'), "\\u8594\\'3e");
	text = text.replace(new RegExp("←", 'g'), "\\u8592\\'3c");
	text = text.replace(new RegExp("≠", 'g'), "\\u8800\\'3f");
	text = text.replace(new RegExp("≡", 'g'), "\\u8801\\'3f");
	text = text.replace(new RegExp("≈", 'g'), "\\u8776\\'3f");
	text = text.replace(new RegExp("∈", 'g'), "\\u1013\\'3f");//E область принадлежности
	
	
	
	
	
	
	
	text = text.replace(new RegExp("&le;", 'g'), "\\u8804\\'3f");
	text = text.replace(new RegExp("&ge;", 'g'), "\\u8805\\'3f");
	
	text = text.replace(new RegExp("&ne;", 'g'), "\\u8800\\'3f");
	text = text.replace(new RegExp("&Delta;", 'g'), "\\u8710\\'3f");
	
	text = text.replace(new RegExp("&sum;", 'g'), "\\u8721\\'3f");
	text = text.replace(new RegExp("&prod;", 'g'), "\\u8719\\'3f");
	
	//αγδεζ ηθικλ μνξοπ ρςστ υφχψω
	text = text.replace(new RegExp("α", 'g'), "\\u945\\'3f");
	text = text.replace(new RegExp("β", 'g'), "\\u946\\'3f");
	text = text.replace(new RegExp("γ", 'g'), "\\u947\\'3f");
	text = text.replace(new RegExp("δ", 'g'), "\\u948\\'3f");
	text = text.replace(new RegExp("ε", 'g'), "\\u949\\'3f");//$epsilon
	text = text.replace(new RegExp("ζ", 'g'), "\\u950\\'3f");
	
	text = text.replace(new RegExp("η", 'g'), "\\u951\\'3f");
	text = text.replace(new RegExp("θ", 'g'), "\\u952\\'3f");
	text = text.replace(new RegExp("ι", 'g'), "\\u953\\'3f");
	text = text.replace(new RegExp("κ", 'g'), "\\u954\\'3f");
	text = text.replace(new RegExp("λ", 'g'), "\\u955\\'3f");//$lambda
	
	text = text.replace(new RegExp("μ", 'g'), "\\u956\\'3f");
	text = text.replace(new RegExp("ν", 'g'), "\\u957\\'3f");
	text = text.replace(new RegExp("ξ", 'g'), "\\u958\\'3f");
	text = text.replace(new RegExp("ο", 'g'), "\\u959\\'3f");
	text = text.replace(new RegExp("π", 'g'), "\\u960\\'3f");
	
	text = text.replace(new RegExp("ρ", 'g'), "\\u961\\'3f");
	text = text.replace(new RegExp("ς", 'g'), "\\u962\\'3f");
	text = text.replace(new RegExp("σ", 'g'), "\\u963\\'3f");//$sigma \mr\mscr0\msty2 \u963\'f3
	text = text.replace(new RegExp("∂", 'g'), "\\u8706\\'3f");
	

	text = text.replace(new RegExp("∑", 'g'), "\\u8721\\'3f");
	text = text.replace(new RegExp("…", 'g'), "...");
	text = text.replace(new RegExp("&nbsp;", 'g'), "  ");
	
	
	
	
	
	text = text.replace(new RegExp("τ", 'g'), "\\u964\\'3f");
	
	text = text.replace(new RegExp("υ", 'g'), "\\u965\\'3f");
	text = text.replace(new RegExp("φ", 'g'), "\\u966\\'3f");
	text = text.replace(new RegExp("χ", 'g'), "\\u967\\'3f");
	text = text.replace(new RegExp("ψ", 'g'), "\\u968\\'3f");
	text = text.replace(new RegExp("ω", 'g'), "\\u969\\'3f");
	
	//ϊϋόύώ Ϗϐϑϒϓ ϔϕϖϗϘ ϙϚϛϜϝ
	
	text = text.replace(new RegExp("ϊ", 'g'), "\\u970\\'3f");
	text = text.replace(new RegExp("ϋ", 'g'), "\\u971\\'3f");
	text = text.replace(new RegExp("ό", 'g'), "\\u972\\'3f");
	text = text.replace(new RegExp("ύ", 'g'), "\\u973\\'3f");
	text = text.replace(new RegExp("ώ", 'g'), "\\u974\\'3f");
	
	text = text.replace(new RegExp("Ϗ", 'g'), "\\u975\\'3f");
	text = text.replace(new RegExp("ϐ", 'g'), "\\u976\\'3f");
	text = text.replace(new RegExp("ϑ", 'g'), "\\u977\\'3f");
	text = text.replace(new RegExp("ϒ", 'g'), "\\u978\\'3f");
	text = text.replace(new RegExp("ϓ", 'g'), "\\u979\\'3f");
	
	text = text.replace(new RegExp("ϔ", 'g'), "\\u980\\'3f");
	text = text.replace(new RegExp("ϕ", 'g'), "\\u981\\'3f");
	text = text.replace(new RegExp("ϖ", 'g'), "\\u982\\'3f");
	text = text.replace(new RegExp("ϗ", 'g'), "\\u983\\'3f");
	text = text.replace(new RegExp("Ϙ", 'g'), "\\u984\\'3f");
	
	text = text.replace(new RegExp("ϙ", 'g'), "\\u985\\'3f");
	text = text.replace(new RegExp("Ϛ", 'g'), "\\u986\\'3f");
	text = text.replace(new RegExp("ϛ", 'g'), "\\u987\\'3f");
	text = text.replace(new RegExp("Ϝ", 'g'), "\\u988\\'3f");
	text = text.replace(new RegExp("ϝ", 'g'), "\\u989\\'3f");
	
	
	
	
	return text;
}

function codeStringRus(text_code){
	//\'e0\'e1\'e2\'e3\'e4\'e5\'b8\'e6\'e7\'e8\'ea\'eb\'ec\'ed\'ee\'ef\'f0\'f1\'f2\'f3\'f4\'f5\'f6\'f7\'f8\'f9\'fa\'fb\'fc\'fd\'fe\'ff
	//\'c0\'c1\'c2\'c3\'c4\'c5\'a8\'c6\'c7\'c8\'c9\'ca\'cb\'cc\'cd\'ce\'cf\'d0\'d1\'d2\'d3\'d4\'d5\'d6\'d7\'d8\'d9\'da\'db\'dc\'dd\'de\'df
	let text = text_code;
	console.log(text_code)
	
	text = text.replace(new RegExp("а", 'g'), "\\'e0");
	text = text.replace(new RegExp("б", 'g'), "\\'e1");
	text = text.replace(new RegExp("в", 'g'), "\\'e2");
	text = text.replace(new RegExp("г", 'g'), "\\'e3");
	text = text.replace(new RegExp("д", 'g'), "\\'e4");
	text = text.replace(new RegExp("е", 'g'), "\\'e5");
	
	text = text.replace(new RegExp("ё", 'g'), "\\'b8");
	
	text = text.replace(new RegExp("ж", 'g'), "\\'e6");
	text = text.replace(new RegExp("з", 'g'), "\\'e7");
	text = text.replace(new RegExp("и", 'g'), "\\'e8");
	
	text = text.replace(new RegExp("й", 'g'), "\\'e9");
	
	text = text.replace(new RegExp("к", 'g'), "\\'ea");
	text = text.replace(new RegExp("л", 'g'), "\\'eb");
	text = text.replace(new RegExp("м", 'g'), "\\'ec");
	text = text.replace(new RegExp("н", 'g'), "\\'ed");
	text = text.replace(new RegExp("о", 'g'), "\\'ee");
	
	text = text.replace(new RegExp("п", 'g'), "\\'ef");
	text = text.replace(new RegExp("р", 'g'), "\\'f0");
	text = text.replace(new RegExp("с", 'g'), "\\'f1");
	text = text.replace(new RegExp("т", 'g'), "\\'f2");
	text = text.replace(new RegExp("у", 'g'), "\\'f3");
	text = text.replace(new RegExp("ф", 'g'), "\\'f4");
	text = text.replace(new RegExp("х", 'g'), "\\'f5");
	text = text.replace(new RegExp("ц", 'g'), "\\'f6");
	text = text.replace(new RegExp("ч", 'g'), "\\'f7");
	text = text.replace(new RegExp("ш", 'g'), "\\'f8");
	text = text.replace(new RegExp("щ", 'g'), "\\'f9");
	text = text.replace(new RegExp("ъ", 'g'), "\\'fa");
	text = text.replace(new RegExp("ы", 'g'), "\\'fb");
	text = text.replace(new RegExp("ь", 'g'), "\\'fc");
	text = text.replace(new RegExp("э", 'g'), "\\'fd");
	text = text.replace(new RegExp("ю", 'g'), "\\'fe");
	text = text.replace(new RegExp("я", 'g'), "\\'ff");
	
	///////////////////////////////////////////////////////////////////////////////////////////
	text = text.replace(new RegExp("А", 'g'), "\\'c0");
	text = text.replace(new RegExp("Б", 'g'), "\\'c1");
	text = text.replace(new RegExp("В", 'g'), "\\'c2");
	text = text.replace(new RegExp("Г", 'g'), "\\'c3");
	text = text.replace(new RegExp("Д", 'g'), "\\'c4");
	text = text.replace(new RegExp("Е", 'g'), "\\'c5");
	
	text = text.replace(new RegExp("Ё", 'g'), "\\'a8");
	
	text = text.replace(new RegExp("Ж", 'g'), "\\'c6");
	text = text.replace(new RegExp("З", 'g'), "\\'c7");
	text = text.replace(new RegExp("И", 'g'), "\\'c8");
	
	text = text.replace(new RegExp("Й", 'g'), "\\'c9");
	
	text = text.replace(new RegExp("К", 'g'), "\\'ca");
	text = text.replace(new RegExp("Л", 'g'), "\\'cb");
	text = text.replace(new RegExp("М", 'g'), "\\'cc");
	text = text.replace(new RegExp("Н", 'g'), "\\'cd");
	text = text.replace(new RegExp("О", 'g'), "\\'ce");
	
	text = text.replace(new RegExp("П", 'g'), "\\'cf");
	text = text.replace(new RegExp("Р", 'g'), "\\'d0");
	text = text.replace(new RegExp("С", 'g'), "\\'d1");
	text = text.replace(new RegExp("Т", 'g'), "\\'d2");
	text = text.replace(new RegExp("У", 'g'), "\\'d3");
	text = text.replace(new RegExp("Ф", 'g'), "\\'d4");
	text = text.replace(new RegExp("Х", 'g'), "\\'d5");
	text = text.replace(new RegExp("Ц", 'g'), "\\'d6");
	text = text.replace(new RegExp("Ч", 'g'), "\\'d7");
	text = text.replace(new RegExp("Ш", 'g'), "\\'d8");
	text = text.replace(new RegExp("Щ", 'g'), "\\'d9");
	text = text.replace(new RegExp("Ъ", 'g'), "\\'da");
	text = text.replace(new RegExp("Ы", 'g'), "\\'db");
	text = text.replace(new RegExp("Ь", 'g'), "\\'dc");
	text = text.replace(new RegExp("Э", 'g'), "\\'dd");
	text = text.replace(new RegExp("Ю", 'g'), "\\'de");
	text = text.replace(new RegExp("Я", 'g'), "\\'df");
	
	
	return text;
}

var mass_formul_enum = {};
var cursor = 0;
var skchek = 1;

//блок чтения формул вызов formul_preobr(preo_rus_utf_href());
{
function preo_rus_utf_href(text_code){
	let textf = text_code;
	textf = textf.replace(new RegExp("%2B", 'g'), "+");
	return textf;
}

var mass_formul_enum;
var cursor = 0;
var skachek = 1;

var getmass = " ";

let prefix_text = "{\\mmath{\\*\\moMathPara {\\*\\moMath { \\i {";
let prefix_text_end = "}}}}}";


var prefix = "{";
var prefix_end = "}";

function formul_preobr(text_code){ //преобразование формул
	mass_formul_enum = [];
	cursor = 0;//курсор считывания формулы
	
	let text = prefix_text;


	
	console.log("cursor:"+cursor+" text_code.length:"+text_code.length);
	
	
	while(cursor <= text_code.length){
	
	console.log("cursor:"+cursor+"       sub: '"+text_code.substring(cursor)+"'        mass_formul_enum:"+vivodmass(mass_formul_enum));
		skachek = 1;//скачек курсора на следующий ход
		
		let sub_text = text_code.substring(cursor);//оставшейся текст
		
		let bool_operand = proverka_operand(sub_text);
		
		if(bool_operand==" "){
			text += sub_text.substring(0, 1);
		}else{
			if (bool_operand=="}"){//если закрытие скобки
				if (getmass!=" "){//получаем последнюю функцию
					
					switch(getmass){
						case "frac"://если дробь
							mass_formul_enum.push("frac_mden");//знаменатель
							text += "}}{\\mden {";
							skachek = 2;//
							break;
						case "frac_mden"://если дробь
							text += "}}}";
							text += prefix_end;
							break;
							
						case "int"://если интеграл
							mass_formul_enum.push("int_msub");//нижний предел
							text += "}}{\\msup{";
							skachek = 3;//
							break;
						case "int_msub"://если интеграл
							mass_formul_enum.push("int_me");//нижний предел
							text += "}}{\\me{";
							skachek = 2;
							break
						case "int_me"://если интеграл
							text += "}}}";
							text += prefix_end;
							break
							
							
							
							
							
						case "int_lim"://если интеграл предел
							mass_formul_enum.push("int_lim_mden");//нижний предел
							text += "}}{\\mden{";
							skachek = 3;//
							break;
						case "int_lim_mden"://если интеграл
							text += "}}}}}";
							text += prefix_end;
							break;
							
							
						case "lim"://если предел
							mass_formul_enum.push("lim_mden");//значение предела
							text += "}}}}{\\me {";
							text += prefix_text;
							skachek = 2;
							break;
						case "lim_mden"://подпредельное
							text += "}}";
							text += prefix_text_end;
							text += prefix_end;
							break;
						case "sqrt"://корень квадратный
							text += "}}}";
							text += prefix_end;
							break;
						case "overline"://верхнее подчеркивание
							text += "}}}";
							text += prefix_end;
							break;
						case "sum"://знак простой суммы
							text += "}}}";
							text += prefix_end;
							break;
						case "^":
							text += "}}}";
							mass_formul_enum.splice(mass_formul_enum.length-1, 1);
							break;
						case "_":
							text += "}}}";
							mass_formul_enum.splice(mass_formul_enum.length-1, 1);
							break;
						case "_^":
							mass_formul_enum.push("_^k");//значение предела
							break;
						case "_^k":
							text += "}}}";
							mass_formul_enum.splice(mass_formul_enum.length-1, 1);
							break;
						case "{":
							text += "]";
							break;
						
					}
				}
			}
			console.log("tyyyyyyyyyyyyyyyyyyyyyyyyyyyt "+bool_operand);
			switch(bool_operand){//открытие функции
			
				case "frac"://если дробь
					text += prefix;
					text += "{\\mf {\\mnum {";
					break;
				case "int"://если интеграл
					text += prefix;
					text += "{\\mnary{\\mnaryPr{\\mlimLoc subSup}}{\\msub{";
					break;
				case "int_lim"://если интегральный предел
					text += prefix;
					text += "{\\md{\\mdPr{\\mbegChr |}{\\mendChr}}{\\me{\\mf{\\mfPr{\\mtype noBar}}{\\mnum{";
					break;
				case "sqrt"://если корень квадратный
					text += prefix;
					text += "{\\mrad{\\mradPr{\\mdegHide on}}{\\mdeg }{\\me {";
					break;
				case "overline":
					text += prefix;
					text += "{\\macc{\\maccPr{\\mchr \\u773 ?}}{\\me {";
					break;
				case "sum":
					text += prefix;
					text += "{\\mnary{\\mnaryPr{\\mchr \\u8721 ?}{\\mlimLoc undOvr}{\\msubHide on}{\\msupHide on}}{\\msub}{\\msup}{\\me {";
					break;
				case "lim"://если предел
					text += prefix;
					text += "{\\mfName {\\mlimLow {\\mlimLowPr{\\mctrlPr }}{\\me {lim}}{\\mlim {";
					break;
				case "infty"://бесконечность знак
					text += "{\\u8734\\'3f}";
					break;
				case "cdot"://бесконечность знак
					text += "{\\mr\\mscr0\\msty2 \\u8729\\'95}";
					break;
				case "dots"://бесконечность знак
					text += "{...}";
					break;
				case "epsilon"://
					text += "{\\mr\\mscr0\\msty2 \\u949\\'3f}";
					break;
				
				case "partial"://
					text += "{\\mr\\mscr0\\msty2 \\u8706\\'3f}";
					break;
				case "approx"://
					text += "{\\mr\\mscr0\\msty2 \\u8776\\'3f}";
					break;
				
				case "sigma"://
					text += "{\\mr\\mscr0\\msty2 \\u963\\'f3}";
					break;
				case "lambda"://
					text += "{\\mr\\mscr0\\msty2 \\u955\\'3f}";
					break;
					
				case "alpha"://α
					text += "{\\mr\\mscr0\\msty2 \\u945\\'3f}";
					break;
				
				case "beta"://β
					text += "{\\mr\\mscr0\\msty2 \\u946\\'3f}";
					break;
				
				case "gamma"://γ
					text += "{\\mr\\mscr0\\msty2 \\u947\\'3f}";
					break;
				
				case "delta"://δ
					text += "{\\mr\\mscr0\\msty2 \\u948\\'3f}";
					break;
				
				case "varepsilon"://ϵ
					text += "{\\mr\\mscr0\\msty2 \\u949\\'3f}";
					break;
				
				case "zeta"://ζ
					text += "{\\mr\\mscr0\\msty2 \\u950\\'3f}";
					break;
				
				case "eta"://η
					text += "{\\mr\\mscr0\\msty2 \\u951\\'3f}";
					break;
				
				case "theta"://θ
					text += "{\\mr\\mscr0\\msty2 \\u952\\'3f}";
					break;
				
				case "vartheta"://ϑ
					text += "{\\mr\\mscr0\\msty2 \\u952\\'3f}";
					break;
				case "lt"://<
					text += "{\\mr\\mscr0\\msty2 \\u8804\\'3f}";
					break;
				case "gt"://>
					text += "{\\mr\\mscr0\\msty2 \\u8805\\'3f}";
					break;
				case "le"://<=
					text += "{\\mr\\mscr0\\msty2 \\u8804\\'3f}";
					break;
				case "ge"://>=
					text += "{\\mr\\mscr0\\msty2 \\u8805\\'3f}";
					break;
				
				case "iota"://ι
					text += "{\\mr\\mscr0\\msty2 \\u953\\'3f}";
					break;
				
				case "kappa"://κ
					text += "{\\mr\\mscr0\\msty2 \\u954\\'3f}";
					break;
				
				case "mu"://μ
					text += "{\\mr\\mscr0\\msty2 \\u956\\'3f}";
					break;
				
				case "nu"://ν
					text += "{\\mr\\mscr0\\msty2 \\u957\\'3f}";
					break;
				
				case "xi"://ξ
					text += "{\\mr\\mscr0\\msty2 \\u958\\'3f}";
					break;
				
				case "pi"://π
					text += "{\\mr\\mscr0\\msty2 \\u960\\'3f}";
					break;
				
				case "varpi"://ϖ
					text += "{\\mr\\mscr0\\msty2 \\u982\\'3f}";
					break;
				
				case "rho"://ρ
					text += "{\\mr\\mscr0\\msty2 \\u961\\'3f}";
					break;
				
				case "varrho"://ϱ
					text += "{\\mr\\mscr0\\msty2 \\u961\\'3f}";
					break;
				
				case "sigma"://σ
					text += "{\\mr\\mscr0\\msty2 \\u963\\'3f}";
					break;
				
				case "varsigma"://ς
					text += "{\\mr\\mscr0\\msty2 \\u962\\'3f}";
					break;
				
				case "tau"://τ
					text += "{\\mr\\mscr0\\msty2 \\u964\\'3f}";
					break;
				
				case "upsilon"://υ
					text += "{\\mr\\mscr0\\msty2 \\u965\\'3f}";
					break;
				
				case "phi"://φ
					text += "{\\mr\\mscr0\\msty2 \\u966\\'3f}";
					break;
				
				case "varphi"://φ
					text += "{\\mr\\mscr0\\msty2 \\u966\\'3f}";
					break;
				
				case "chi"://χ
					text += "{\\mr\\mscr0\\msty2 \\u967\\'3f}";
					break;
				
				case "psi"://ψ
					text += "{\\mr\\mscr0\\msty2 \\u968\\'3f}";
					break;
				
				case "omega"://ω
					text += "{\\mr\\mscr0\\msty2 \\u969\\'3f}";
					break;
				
				case "Gamma"://Γ
					text += "{\\mr\\mscr0\\msty2 \\'c3}";
					break;
				
				case "Delta"://Δ,
					text += "{\\mr\\mscr0\\msty2 \\u8710\\'3f}";
					break;
				
				case "Theta"://Θ,
					text += "{\\mr\\mscr0\\msty2 \\u952\\'3f}";
					break;
				
				case "Lambda"://Λ,
					text += "{\\mr\\mscr0\\msty2 \\u955\\'3f}";
					break;
				
				case "Xi"://Ξ,
					text += "{\\mr\\mscr0\\msty2 \\u967\\'3f}";
					break;
				
				case "Pi"://Π,
					text += "{\\mr\\mscr0\\msty2 \\'cf}";
					break;
				
				case "Sigma"://Σ,
					text += "{\\mr\\mscr0\\msty2 \\u8721\\'3f}";
					break;
				
				case "Upsilon"://Υ,
					text += "{\\mr\\mscr0\\msty2 \\u979\\'3f}";
					break;
				
				case "Phi"://Φ,
					text += "{\\mr\\mscr0\\msty2 \\'d4}";
					break;
				
				case "Psi"://Ψ,
					text += "{\\mr\\mscr0\\msty2 \\u968\\'3f}";
					break;
				
				case "Omega"://Ω
					text += "{\\mr\\mscr0\\msty2 \\u969\\'3f}";
					break;
				
				case "to"://бесконечность знак
					text += "{\\u8594\\'3e}";
					break;
				case "("://
					text += "{\\md{\\mdPr{\\mctrlPr}}{\\me {";
					break;
				case ")"://
					text += "}}}";
					break;
				case "^"://степень начало
					text += "{\\msSup{\\msSupPr}{\\me{";
					break;
				case "_"://значек начало
					text += "{\\msSub{\\msSubPr}{\\me{";
					break;
				case "^{"://степень середина
					if (mass_formul_enum[mass_formul_enum.length-1] == "^" || mass_formul_enum[mass_formul_enum.length-1] == "_^"){
						text += "}}{\\msup{";
					}
					break;
				case "_{"://значек середина
				if (mass_formul_enum[mass_formul_enum.length-1] == "_" || mass_formul_enum[mass_formul_enum.length-1] == "_^"){
						text += "}}{\\msub{";
					}
					break;
				case "_^"://
					text += "{\\msSubSup{\\msSubSupPr}{\\me{";
					break;
				case "notFound"://оператор не найден
					text += "$";
					break;
				case "{":
					text += "["
					break;
			}
		}
		
		cursor += skachek;
	}
	
	

	text += prefix_text_end;
	return text;
}



function proverka_operand(text_code){//запись в массив
	if (text_code.substring(0, 5)=="\\frac"){
		mass_formul_enum.push("frac");
		skachek = 6;
		return "frac";
	}
	if (text_code.substring(0, 5)=="\\lim_"){
		mass_formul_enum.push("lim");
		skachek = 6;
		return "lim";
	}
	if (text_code.substring(0, 5)=="\\sqrt"){
		mass_formul_enum.push("sqrt");
		skachek = 6;
		return "sqrt";
	}
	if (text_code.substring(0, 9)=="\\overline"){
		mass_formul_enum.push("overline");
		skachek = 10;
		return "overline";
	}
	if (text_code.substring(0, 4)=="\\sum"){
		mass_formul_enum.push("sum");
		skachek = 5;
		return "sum";
	}
	if (text_code.substring(0, 11)=="\\int\\limits"){
		mass_formul_enum.push("int");
		skachek = 13;
		return "int";
	}
	if (text_code.substring(0, 8)=="|\\limits"){
		mass_formul_enum.push("int_lim");
		skachek = 10;
		return "int_lim";
	}
	
	
	
	
	
	/////////////////////////////////////////////////////////END
	if (text_code.substring(0, 1)=="("){
		return "(";
	}
	if (text_code.substring(0, 1)==")"){
		return ")";
	}
	
	if (text_code.substring(0, 1)=="{"){
		mass_formul_enum.push("{");
		return "{";
	}
	
	
	if (text_code.substring(0, 4)=="^^__"){
		skachek = 4;//особое
		mass_formul_enum.push("_^");
		mass_formul_enum.push("_^");
		return "_^";
	}
	if (text_code.substring(0, 2)=="^^"){
		skachek = 2;//особое
		mass_formul_enum.push("^");
		mass_formul_enum.push("^");
		return "^";
	}
	if (text_code.substring(0, 2)=="^{"){
		skachek = 2;//особое
		return "^{";
	}
	if (text_code.substring(0, 2)=="__"){
		skachek = 2;//особое
		mass_formul_enum.push("_");
		mass_formul_enum.push("_");
		return "_";
	}
	if (text_code.substring(0, 2)=="_{"){
		skachek = 2;//особое
		return "_{";
	}
	
	
	
	
	if (text_code.substring(0, 1)=="}"){
		getmass = mass_formul_enum[mass_formul_enum.length-1];
		mass_formul_enum.splice(mass_formul_enum.length-1, 1);
		return "}";
	}
	
	if (text_code.substring(0, 6)=="\\infty"){
		skachek = 7;
		return "infty";
	}
	if (text_code.substring(0, 3)=="\\to"){
		skachek = 4;
		return "to";
	}
	if (text_code.substring(0, 3)=="\\le"){
		skachek = 3;
		return "le";
	}
	if (text_code.substring(0, 3)=="\\ge"){
		skachek = 3;
		return "ge";
	}
	if (text_code.substring(0, 4)=="\\leq"){
		skachek = 4;
		return "le";
	}
	if (text_code.substring(0, 4)=="\\geq"){
		skachek = 4;
		return "ge";
	}
	
	if (text_code.substring(0, 3)=="\\lt"){
		skachek = 3;
		return "lt";
	}
	if (text_code.substring(0, 3)=="\\gt"){
		skachek = 3;
		return "gt";
	}
	
	if (text_code.substring(0, 5)=="\\cdot"){
		skachek = 6;
		return "cdot";
	}
	if (text_code.substring(0, 5)=="\\dots"){
		skachek = 6;
		return "dots";
	}
	
	
	
	if (text_code.substring(0, 8)=="\\epsilon"){
		skachek = 8;
		return "epsilon";
	}
	if (text_code.substring(0, 8)=="\\partial"){
		skachek = 8;
		return "partial";
	}
	if (text_code.substring(0, 7)=="\\approx"){
		skachek = 7;
		return "approx";
	}
	
	
	if (text_code.substring(0, 6)=="\\sigma"){
		skachek = 6;
		return "sigma";
	}
	if (text_code.substring(0, 7)=="\\lambda"){
		skachek = 7;
		return "lambda";
	}
	
	if (text_code.substring(0, 6)=="\\alpha"){
		skachek = 6;
		return "alpha";
	}
	
	if (text_code.substring(0, 5)=="\\beta"){
		skachek = 5;
		return "beta";
	}
	
	if (text_code.substring(0, 6)=="\\gamma"){
		skachek = 6;
		return "gamma";
	}
	
	if (text_code.substring(0, 6)=="\\delta"){
		skachek = 6;
		return "delta";
	}
	
	if (text_code.substring(0, 11)=="\\varepsilon"){
		skachek = 11;
		return "varepsilon";
	}
	
	if (text_code.substring(0, 5)=="\\zeta"){
		skachek = 5;
		return "zeta";
	}
	
	if (text_code.substring(0, 4)=="\\eta"){
		skachek = 4;
		return "eta";
	}
	
	if (text_code.substring(0, 6)=="\\theta"){
		skachek = 6;
		return "theta";
	}
	
	if (text_code.substring(0, 9)=="\\vartheta"){
		skachek = 9;
		return "vartheta";
	}
	
	if (text_code.substring(0, 5)=="\\iota"){
		skachek = 5;
		return "iota";
	}
	
	if (text_code.substring(0, 6)=="\\kappa"){
		skachek = 6;
		return "kappa";
	}
	
	if (text_code.substring(0, 3)=="\\mu"){
		skachek = 3;
		return "mu";
	}
	
	if (text_code.substring(0, 3)=="\\nu"){
		skachek = 3;
		return "nu";
	}
	
	if (text_code.substring(0, 3)=="\\xi"){
		skachek = 3;
		return "xi";
	}
	
	if (text_code.substring(0, 3)=="\\pi"){
		skachek = 3;
		return "pi";
	}
	
	if (text_code.substring(0, 6)=="\\varpi"){
		skachek = 6;
		return "varpi";
	}
	
	if (text_code.substring(0, 4)=="\\rho"){
		skachek = 4;
		return "rho";
	}
	
	if (text_code.substring(0, 7)=="\\varrho"){
		skachek = 7;
		return "varrho";
	}
	
	if (text_code.substring(0, 6)=="\\sigma"){
		skachek = 6;
		return "sigma";
	}
	
	if (text_code.substring(0, 9)=="\\varsigma"){
		skachek = 9;
		return "varsigma";
	}
	
	if (text_code.substring(0, 4)=="\\tau"){
		skachek = 4;
		return "tau";
	}
	
	if (text_code.substring(0, 8)=="\\upsilon"){
		skachek = 8;
		return "upsilon";
	}
	
	if (text_code.substring(0, 4)=="\\phi"){
		skachek = 4;
		return "phi";
	}
	
	if (text_code.substring(0, 7)=="\\varphi"){
		skachek = 7;
		return "varphi";
	}
	
	if (text_code.substring(0, 4)=="\\chi"){
		skachek = 4;
		return "chi";
	}
	
	if (text_code.substring(0, 4)=="\\psi"){
		skachek = 4;
		return "psi";
	}
	
	if (text_code.substring(0, 6)=="\\omega"){
		skachek = 6;
		return "omega";
	}
	
	if (text_code.substring(0, 6)=="\\Gamma"){
		skachek = 6;
		return "Gamma";
	}
	
	if (text_code.substring(0, 6)=="\\Delta"){
		skachek = 6;
		return "Delta";
	}
	
	if (text_code.substring(0, 6)=="\\Theta"){
		skachek = 6;
		return "Theta";
	}
	
	if (text_code.substring(0, 7)=="\\Lambda"){
		skachek = 7;
		return "Lambda";
	}
	
	if (text_code.substring(0, 3)=="\\Xi"){
		skachek = 3;
		return "Xi";
	}
	
	if (text_code.substring(0, 3)=="\\Pi"){
		skachek = 3;
		return "Pi";
	}
	
	if (text_code.substring(0, 6)=="\\Sigma"){
		skachek = 6;
		return "Sigma";
	}
	
	if (text_code.substring(0, 8)=="\\Upsilon"){
		skachek = 8;
		return "Upsilon";
	}
	
	if (text_code.substring(0, 4)=="\\Phi"){
		skachek = 4;
		return "Phi";
	}
	
	if (text_code.substring(0, 4)=="\\Psi"){
		skachek = 4;
		return "Psi";
	}
	
	if (text_code.substring(0, 6)=="\\Omega"){
		skachek = 6;
		return "Omega";
	}
	
	
	
	
	
	
	
	
	
	if (text_code.substring(0, 1)=="\\"){//если ничего не нашло и стоит обратная косая черта то заменит ее на #
		return "notFound";
	}
	
	
	return " ";
}
	
}


function vivodmass(massiv){//вывод массива
	let tdfh = "["
	for (let j = 0; j < massiv.length; ++j) {
		tdfh += massiv[j]+", ";
	}
	return tdfh+"]";
}


function writeFile(name, value) {//запись в файл
var val = value;
if (value === undefined) {
val = "";
}
var download = document.createElement("a");
download.href = "data:text/plain;content-disposition=attachment;filename=file," + val;
download.download = name;
download.style.display = "none";
download.id = "download"; document.body.appendChild(download);
document.getElementById("download").click();
document.body.removeChild(download);
}

