ventana = new Ventana();

function Ventana(){
	var datosxx="";
    this.showHTML = function (objContainer,stPagina){
           $.ajax({
                  type: "GET",
                  url: stPagina ,
                  async: false,
                  cache: false,
                  //headers: "stHeader",
                  success: function (response) {
                        //alert("success" + response);
                        //  document.write (response)
                        datosxx = response;
                    },
                  error: function (msg, status, errorThrown) {
                  	      alert (msg)
                            datosxx = "Error " + msg
                            //wndMsgAlert("Error" + msg);
                            //wndMsgAlert(errorThrown+'\n'+status+'\n'+msg.statusText+'\n>>1.-'+msg.responseText);
                            datosxx=null;
                  }
            });
        document.getElementById(objContainer).innerHTML = datosxx;
    }
    this.getPostData = function (stPagina,stData){
           $.ajax({
                  type: "POST",
                  url: stPagina ,
                  async: false,
                  cache: false,
                  data : stData,
                  //headers: "stHeader",
                  //contentType: "application/json; charset=utf-8",
                  dataType : 'json',
                  success: function (response) {
                        //alert("success" + response);
                        //  document.write (response)
                        datosxx = response;
                    },
                  error: function (msg, status, errorThrown) {
                          alert (msg)
                            datosxx = "Error " + msg
                            //wndMsgAlert("Error" + msg);
                            //wndMsgAlert(errorThrown+'\n'+status+'\n'+msg.statusText+'\n>>1.-'+msg.responseText);
                            datosxx=null;
                  }
            });
        //document.getElementById(objContainer).innerHTML = datosxx;
        return datosxx;
    }

    this.getPostHtml = function (objContainer,stPagina,stData){
           $.ajax({
                  type: "POST",
                  url: stPagina ,
                  async: false,
                  cache: false,
                  data : stData,
                  //headers: "stHeader",
                  success: function (response) {
                        //alert("success" + response);
                        //  document.write (response)
                        datosxx = response;
                    },
                  error: function (msg, status, errorThrown) {
                          alert (msg)
                            datosxx = "Error " + msg
                            //wndMsgAlert("Error" + msg);
                            //wndMsgAlert(errorThrown+'\n'+status+'\n'+msg.statusText+'\n>>1.-'+msg.responseText);
                            datosxx=null;
                  }
            });
        document.getElementById(objContainer).innerHTML = datosxx;
    }

    this.showHTML2 = function (objContenedor,stPagina){
           $.ajax({
                  type: "GET",
                  url: stPagina ,
                  async: false,
                  cache: false,
                  //headers: "stHeader",
                  success: function (response) {
                        //alert("success" + response);
                        //  document.write (response)
                        datosxx = response;
                    },
                  error: function (msg, status, errorThrown) {
                          alert (msg)
                            datosxx = "Error " + msg
                            //wndMsgAlert("Error" + msg);
                            //wndMsgAlert(errorThrown+'\n'+status+'\n'+msg.statusText+'\n>>1.-'+msg.responseText);
                            datosxx=null;
                  }
            });
        document.getElementById(objContenedor).innerHTML = datosxx;
    } 
}
