/**
 *
 */
function dialogoElan() {
    var dialogo = $("<div></div>");

    var zonasElan = $("<div></div>");
    var elanPersonaje = personaje_actual.getElan();
    for (var i = 0; i < elanPersonaje.length; i++) {
        var titulo = $("<h3></h3>");
        titulo.append(_l(elanPersonaje[i].getNombre()) + " - " + _l(UI_SINCRONIZACION) + ": " + elanPersonaje[i].getSincronizacion() + " / " + _l(UI_LIBRE) + ": " + elanPersonaje[i].sincLibre());
        var contenido = $("<div></div>");
        contenido.attr("id","donesElan" + elanPersonaje[i].getNombre());
        appendDonesElan(contenido,elanPersonaje[i].getNombre(),dialogo);
        zonasElan.append(titulo).append(contenido);
    }
    zonasElan.accordion({
        heightStyle: "content"
    });
    dialogo.append(zonasElan);

    dialogo.dialog({
        modal: true,
        autoOpen: true,
        draggable: true,
        resizable: true,
        ////show: "puff",
        title: _l(DIAG_ELEGIR_OPCIONES_TITULO),
        position: "center",
        width: ANCHO_DIALOGO,
        height: ALTO_DIALOGO,
        maxHeight: ALTO_DIALOGO,
        closeOnEscape: true,
        close: function(event, ui) {dialogo.empty();}
    });
}

/**
 *
 * @param {jQuery} elemento
 * @param {string} nombre
 * @param {jQuery} dialogo
 */
function appendDonesElan(elemento, nombre, dialogo) {
    var elan = getElan(nombre);
    var dones = elan.getDones();

    var gridBotones = $("<ul></ul>").addClass("three_up tiles");

    for (var i = 0; i < dones.length; i++) {
        var labelBoton = "[" + dones[i].getCoste() + "] " + _l(dones[i].getNombre()) + "<br>";
        labelBoton += _l(ELAN_SYNC_REQ) + " " + dones[i].getElanMinimo();
        if (dones[i].getDonesRequisito().length > 0) {
            labelBoton += ", ";
            /**
             *
             * @type {string[]}
             */
            var donesRequisito = dones[i].getDonesRequisito();
            for (var j = 0; j < donesRequisito.length; j++) {
                labelBoton += _l(donesRequisito[j]);
                if (j+1 < donesRequisito.length) {
                    labelBoton += ", ";
                }
            }
        }
        var botonDon = boton("big primary pretty btn",labelBoton,!dones[i].puedeComprarse());
        botonDon.css("width", "100%");

        botonDon.on("click",{indice: i}, function(event) {
            var i = event.data.indice;
            dialogo.dialog("close" );
            aplicarDonElan(dones[i],nombre);
        });

        gridBotones.append($("<li></li>").append(botonDon));
    }
    elemento.append(gridBotones);
}


/**
 * Diálogo para definir manualmente quanto de Elan o personagem tem com cada deus.
 * Beryl e Shajad aparecem em colunas separadas; valor 0 = sem Elan com esse deus.
 */
function dialogoDefinirElan(event) {
    // O botão fica dentro do título da seção, que recolhe/expande ao clicar: não deixar o clique subir.
    if (event && event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
    }
    var dialogo = $("<div></div>").addClass("dialogoDefinirElan");
    dialogo.append($("<p></p>").addClass("ayudaDefinirElan").text(_l(UI_DEFINIR_ELAN_AYUDA)));

    var columnas = $("<div></div>").addClass("columnasDefinirElan");
    var tipos = [BERYL, SHAJAD];
    var inputs = [];

    for (var t = 0; t < tipos.length; t++) {
        var columna = $("<div></div>").addClass("columnaDefinirElan columna" + tipos[t]);
        columna.append($("<h3></h3>").text(tipos[t]));

        for (var i = 0; i < berylShajad_set.length; i++) {
            var dios = berylShajad_set[i];
            if (dios.getTipo() != tipos[t]) {
                continue;
            }
            var actual = null;
            var elanPersonaje = personaje_actual.getElan();
            for (var k = 0; k < elanPersonaje.length; k++) {
                if (elanPersonaje[k].getNombre() == dios.getNombre()) {
                    actual = elanPersonaje[k];
                }
            }
            var minimo = (actual == null) ? 0 : actual.getSinGastada();
            var valor = (actual == null) ? 0 : actual.getSincronizacion();

            var fila = $("<label></label>").addClass("filaDefinirElan");
            fila.append($("<span></span>").addClass("nombreDefinirElan").text(_l(dios.getNombre())));
            var input = $("<input type='number'>")
                .attr({min: minimo, max: 100, step: 5})
                .val(valor);
            input.data("nombre", dios.getNombre());
            input.data("original", valor);
            inputs.push(input);
            fila.append(input);
            columna.append(fila);
        }
        columnas.append(columna);
    }
    dialogo.append(columnas);

    dialogo.dialog({
        modal: true,
        autoOpen: true,
        draggable: true,
        resizable: true,
        title: _l(UI_DEFINIR_ELAN),
        width: Math.min(ANCHO_DIALOGO, $(window).width() - 20),
        closeOnEscape: true,
        buttons: [
            {
                text: _l(UI_APLICAR),
                click: function() {
                    for (var n = 0; n < inputs.length; n++) {
                        var valorNuevo = parseInt(inputs[n].val(), 10);
                        if (isNaN(valorNuevo)) {
                            valorNuevo = 0;
                        }
                        if (valorNuevo != inputs[n].data("original")) {
                            personaje_actual.definirSincronizacionElan(inputs[n].data("nombre"), valorNuevo);
                        }
                    }
                    // Garante que a seção Elan seja redesenhada mesmo se as notificações estiverem desligadas
                    $(DIV_DESTINO_ELAN).empty().append(muestraElan(personaje_actual.GENERACION_INICIADA));
                    $(this).dialog("close");
                }
            },
            {
                text: _l(UI_CANCELAR),
                click: function() {
                    $(this).dialog("close");
                }
            }
        ],
        close: function() {
            dialogo.dialog("destroy").remove();
        }
    });
}
