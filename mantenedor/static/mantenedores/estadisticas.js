$(document).ready(function () {
    //graficoVentas();
    //graficoTotalVentas();
    //graficoTipoVentas();
    //graficoCategoria();
    graficoVentas2();
    graficoVentas3();
    graficoVentas4();
    graficoVentas5();
    graficoVentas6();
});

/*
function graficoVentas() {

    var ctx = document.getElementById("graficaVentaMes").getContext("2d");
    var myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            datasets: [{
                label: '2020',
                data: [30, 32, 43, 23, 54, 12, 3, 5, 6, 23, 56, 76],
                borderColor: ['rgb(253, 0, 0, 0.5)'],
                backgroundColor: ['rgb(253, 0, 0 )']
            },
            {
                label: '2021',
                data: [1, 52, 33, 28, 44, 52, 13, 8, 10, 13, 46, 88],
                borderColor: ['rgb(0, 201, 253  , 0.5)'],
                backgroundColor: ['rgb(0, 201, 253 )']
            }
            ]


        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function graficoTotalVentas() {

    var ctx = document.getElementById("graficaTotalVentas").getContext("2d");
    var myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            datasets: [{
                label: '2020',
                data: [250000, 500000, 450000, 500000, 600000, 400000, 250000, 600000, 700000, 400000, 800000, 500000],
                backgroundColor: ['rgb(253, 0, 0, 0.2)']
            },
            {
                label: '2021',
                data: [200000, 458400, 521000, 452221, 874402, 451231, 115487, 568420, 965584, 412584, 874587, 451287],
                borderColor: ['rgb(0, 201, 253 )'],
                backgroundColor: ['rgb(0, 201, 253 )'],
                type: "line"
            }
            ]

        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function graficoTipoVentas() {

    var ctx = document.getElementById("graficaTipoVenta").getContext("2d");
    var myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Boleta", "Factura"],
            datasets: [{
                label: 'mesActual',
                data: [40, 15],
                backgroundColor: ['rgb(253, 0, 0, 0.5)', 'rgb(0, 201, 253, 0.5)']
            }
            ]

        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function graficoCategoria() {

    var ctx = document.getElementById("graficaCategoria").getContext("2d");
    var myChart = new Chart(ctx, {
        type: "polarArea",
        data: {
            labels: ["Construcción", "Herramientas", "Hogar", "Jardín", "Pinturas"],
            datasets: [{
                label: 'mesActual',
                data: [40, 15, 54, 10, 20],
                backgroundColor: ['rgb(253, 0, 0, 0.5)',
                    'rgb(0, 201, 253, 0.5)',
                    'rgb(24, 253, 0 , 0.5)',
                    'rgb(127, 0, 253 , 0.5)',
                    'rgb(250, 253, 0 , 0.5)']
            }
            ]

        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
*/

function graficoVentas2() {
    $.ajax({
        type: 'POST',
        url: 'grafVentasMes_count',
        cache: false,
        processData: false,
        dataType: 'JSON',
        success: function (data) {

            var enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre
            for (let i = 0; i < data.length; i++) {
                if (data[i][0] == 01) {
                    enero = data[i][1]
                }
                if (data[i][0] == 02) {
                    febrero = data[i][1]
                }
                if (data[i][0] == 03) {
                    marzo = data[i][1]
                }
                if (data[i][0] == 04) {
                    abril = data[i][1]
                }
                if (data[i][0] == 05) {
                    mayo = data[i][1]
                }
                if (data[i][0] == 06) {
                    junio = data[i][1]
                }
                if (data[i][0] == 07) {
                    julio = data[i][1]
                }
                if (data[i][0] == 08) {
                    agosto = data[i][1]
                }
                if (data[i][0] == 09) {
                    septiembre = data[i][1]
                }
                if (data[i][0] == 10) {
                    octubre = data[i][1]
                }
                if (data[i][0] == 11) {
                    noviembre = data[i][1]
                }
                if (data[i][0] == 12) {
                    diciembre = data[i][1]
                }
            }

            var ctx = document.getElementById("graficaVentaMes").getContext("2d");
            var myChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
                    datasets: [{
                        label: '2021',
                        data: [enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre],
                        borderColor: ['rgb(253, 0, 0, 0.5)'],
                        backgroundColor: ['rgb(253, 0, 0 )']
                    },
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        },
        error: function () {
            console.log("no funciona")
        }
    })
}

function graficoVentas3() {
    $.ajax({
        type: 'POST',
        url: 'grafVentasMes_sum',
        cache: false,
        processData: false,
        dataType: 'JSON',
        success: function (data) {

            var enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre
            for (let i = 0; i < data.length; i++) {
                if (data[i][0] == 01) {
                    enero = data[i][1]
                }
                if (data[i][0] == 02) {
                    febrero = data[i][1]
                }
                if (data[i][0] == 03) {
                    marzo = data[i][1]
                }
                if (data[i][0] == 04) {
                    abril = data[i][1]
                }
                if (data[i][0] == 05) {
                    mayo = data[i][1]
                }
                if (data[i][0] == 06) {
                    junio = data[i][1]
                }
                if (data[i][0] == 07) {
                    julio = data[i][1]
                }
                if (data[i][0] == 08) {
                    agosto = data[i][1]
                }
                if (data[i][0] == 09) {
                    septiembre = data[i][1]
                }
                if (data[i][0] == 10) {
                    octubre = data[i][1]
                }
                if (data[i][0] == 11) {
                    noviembre = data[i][1]
                }
                if (data[i][0] == 12) {
                    diciembre = data[i][1]
                }
            }
            var ctx = document.getElementById("graficaTotalVentas").getContext("2d");
            var myChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
                    datasets: [{
                        label: '2021',
                        data: [enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre],
                        backgroundColor: ['rgb(253, 0, 0, 0.2)']
                    },
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        },
        error: function () {
            console.log("no funciona")
        }
    })
}

function graficoVentas4() {
    $.ajax({
        type: 'POST',
        url: 'grafDoc_count',
        cache: false,
        processData: false,
        dataType: 'JSON',
        success: function (data) {

            var boleta, factura
            for (let i = 0; i < data.length; i++) {
                if (data[i][0] == 'Boleta') {
                    boleta = data[i][1]
                }
                if (data[i][0] == 'Factura') {
                    factura = data[i][1]
                }
            }
            var ctx = document.getElementById("graficaTipoVenta").getContext("2d");
            var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: ["Boleta", "Factura"],
                    datasets: [{
                        label: 'mesActual',
                        data: [boleta, factura],
                        backgroundColor: ['rgb(253, 0, 0, 0.5)', 'rgb(0, 201, 253, 0.5)']
                    }
                    ]

                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

        },
        error: function () {
            console.log("no funciona")
        }
    })
}

function graficoVentas5() {
    $.ajax({
        type: 'POST',
        url: 'grafCat_count',
        cache: false,
        processData: false,
        dataType: 'JSON',
        success: function (data) {

            var Construccion, Herramientas, Hogar, Jardin, Pinturas, electrico
            for (let i = 0; i < data.length; i++) {
                if (data[i][0] == 'Construcción') {
                    Construccion = data[i][1]
                }
                if (data[i][0] == 'Herramientas') {
                    Herramientas = data[i][1]
                }
                if (data[i][0] == 'Hogar') {
                    Hogar = data[i][1]
                }
                if (data[i][0] == 'Jardín') {
                    Jardin = data[i][1]
                }
                if (data[i][0] == 'Pinturas') {
                    Pinturas = data[i][1]
                }
                if (data[i][0] == 'Electricidad') {
                    electrico = data[i][1]
                }
            }
            var ctx = document.getElementById("graficaCategoria").getContext("2d");
            var myChart = new Chart(ctx, {
                type: "polarArea",
                data: {
                    labels: ["Construcción", "Herramientas", "Hogar", "Jardín", "Pinturas", "Eléctricidad"],
                    datasets: [{
                        label: 'mesActual',
                        data: [Construccion, Herramientas, Hogar, Jardin, Pinturas, electrico],
                        backgroundColor: ['rgb(253, 0, 0, 0.5)',
                            'rgb(0, 201, 253, 0.5)',
                            'rgb(24, 253, 0 , 0.5)',
                            'rgb(127, 0, 253 , 0.5)',
                            'rgb(250, 253, 0 , 0.5)',
                            'rgb(350, 120, 0 , 0.5)']
                    }
                    ]

                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

        },
        error: function () {
            console.log("no funciona")
        }
    })
}

function graficoVentas6() {
    $.ajax({
        type: 'POST',
        url: 'grafProdCat_count',
        cache: false,
        processData: false,
        dataType: 'JSON',
        success: function (data) {
            var Construccion, Herramientas, Hogar, Jardin, Pinturas, electrico
            for (let i = 0; i < data.length; i++) {
                if (data[i][0] == 'Construcción') {
                    Construccion = data[i][1]
                }
                if (data[i][0] == 'Herramientas') {
                    Herramientas = data[i][1]
                }
                if (data[i][0] == 'Hogar') {
                    Hogar = data[i][1]
                }
                if (data[i][0] == 'Jardín') {
                    Jardin = data[i][1]
                }
                if (data[i][0] == 'Pinturas') {
                    Pinturas = data[i][1]
                }
                if (data[i][0] == 'Electricidad') {
                    electrico = data[i][1]
                }
            }
            var ctx = document.getElementById("graficaProdCategoria").getContext("2d");
            var myChart = new Chart(ctx, {
                type: "polarArea",
                data: {
                    labels: ["Construcción", "Herramientas", "Hogar", "Jardín", "Pinturas", "Eléctricidad"],
                    datasets: [{
                        label: 'mesActual',
                        data: [Construccion, Herramientas, Hogar, Jardin, Pinturas, electrico],
                        backgroundColor: ['rgb(253, 0, 0, 0.5)',
                            'rgb(0, 201, 253, 0.5)',
                            'rgb(24, 253, 0 , 0.5)',
                            'rgb(127, 0, 253 , 0.5)',
                            'rgb(250, 253, 0 , 0.5)',
                            'rgb(350, 120, 0 , 0.5)']
                    }
                    ]

                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

            /*$.each(data, function (index, value) {
                
            
                console.log(value)
                var Construccion = 0
                var Herramientas = 0
                var Hogar = 0
                var Jardin = 0
                var Pinturas = 0

                if (value[0] == 'Construcción' && value[1] > 0) {
                    Construccion = value[1]
                    console.log('Hola Construcción') 
                } 
                else if (value[0] == 'Herramientas' && value[1] > 0) {
                    Herramientas = value[1]
                    console.log('Hola Herramientas') 
                } 
                else if (value[0] == 'Hogar' && value[1] > 0) {
                    Hogar = value[1]
                    console.log('Hola Hogar') 
                } 
                else if (value[0] == 'Jardín' && value[1] > 0) {
                    Jardin = value[1]
                    console.log('Hola Jardín') 
                } 
                else if (value[0] == 'Pinturas' && value[1] > 0) {
                    Pinturas = value[1]
                    console.log('Hola Pinturas') 
                } 
            
                var ctx = document.getElementById("graficaProdCategoria").getContext("2d");
                var myChart = new Chart(ctx, {
                    type: "polarArea",
                    data: {
                        labels: ["Construcción", "Herramientas", "Hogar", "Jardín", "Pinturas"],
                        datasets: [{
                            label: 'mesActual',
                            data: [Construccion, Herramientas, Hogar, Jardin, Pinturas],
                            backgroundColor: ['rgb(253, 0, 0, 0.5)',
                                'rgb(0, 201, 253, 0.5)',
                                'rgb(24, 253, 0 , 0.5)',
                                'rgb(127, 0, 253 , 0.5)',
                                'rgb(250, 253, 0 , 0.5)']
                        }
                        ]

                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
            })*/

        },
        error: function () {
            console.log("no funciona")
        }
    })
}