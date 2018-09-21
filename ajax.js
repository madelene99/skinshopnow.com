/* Article FructCode.com */
$( document ).ready(function() {
    $("#btn").click(
		function(){
            sendAjaxForm('result_form', 'ajax_form', 'http://vip.demenibu.com/tracker_api');
			return false; 
		}
	);
});
$( document ).ready(function() {
    $("#btn1").click(
        function(){
            sendAjaxForm('result_form1', 'ajax_form', 'http://vip.demenibu.com/tracker_api');
            return false; 
        }
    );
});
 
function sendAjaxForm(result_form, ajax_form, url) {
    $.ajax({
        url:     "http://vip.demenibu.com/tracker_api", //url страницы (action_ajax_form.php)
        type:     "GET", //метод отправки
        dataType: "html", //формат данных
        data: $("#ajax_form").serialize(),  // Сеарилизуем объект
        success: function(response) { //Данные отправлены успешно
        	  console.log(response);
              window.location.href = "thank-you/index.html"

    	},
    	error: function(response) { // Данные не отправлены
           alert("error");
    	}
 	});
}