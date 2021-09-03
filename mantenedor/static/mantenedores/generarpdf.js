
function clickPdf() {


    var doc = new jsPDF();   


    var elementHTML = $('#info').html();
    var elementHTML1 = $('#DatosProveedor').html();
    var elementHTML2 = $('#info2').html();
    var elementHTML3 = $('#info3').html();

    var specialElementHandlers = {
        '#elementH': function (element, renderer) {
            return true;
        }
    };

    doc.text(20, 20, 'ORDEN DE PEDIDO'); 
    doc.fromHTML(elementHTML, 15, 15, {
        'width': 170,
        'elementHandlers': specialElementHandlers
    });
    doc.fromHTML(elementHTML1, 90, 11, {
        'width': 170,
        'elementHandlers': specialElementHandlers
    });
    doc.fromHTML(elementHTML3, 15, 55, {
        'width': 700,
        'height': 500,
        'elementHandlers': specialElementHandlers
    });
    doc.fromHTML(elementHTML2, 15, 160, {
        'width': 230,
        'elementHandlers': specialElementHandlers
    });
    


    // Save the PDF
    doc.save('sample-document.pdf');
}

function clickPdfGrafico() {
    

    var doc = new jsPDF();   


    var elementHTMLGRAFICO = $('#divGrafica1').html();

    var specialElementHandlers = {
        '#elementH': function (element, renderer) {
            return true;
        }
    };

    doc.text(20, 20, 'ESTADISTICAS'); 
    doc.fromHTML(elementHTMLGRAFICO, 15, 15, {
        'width': 170,
        'elementHandlers': specialElementHandlers
    });


    // Save the PDF
    doc.save('sample-document.pdf');
}