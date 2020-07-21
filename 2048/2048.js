(function ($) {
    $.fn.game2048 = function () {
        var score = 0;
        var context = $(this);
        let size_x = 4;
        let size_y = 4;

        $(this).append("<div id='titre'>2048</div>");
        $(this).append("<div class='container'><div id='scorer'></div> <button id='restart'>Restart</button></div>");
        $(this).append(generate_map(size_x, size_y));

        show_score();

        generate_tiles(2, size_x, size_y); //génère 2 tuiles random

        function create_game(object) {
            object.empty();
            object.append("<div id='titre'>2048</div>");
            object.append("<div class='container'><div id='scorer'></div> <button id='restart'>Restart</button></div>");
            object.append(generate_map(size_x, size_y));
            score = 0;
            show_score();

            function show_score() {
                element = $("#scorer");
                element.empty();
                element.append("Score : " + score);
            }

            $("#restart").click(function () {
                create_game(context);
                generate_tiles(2, size_x, size_y);
            });
        }

        function show_score() {
            element = $("#scorer");
            element.empty();
            element.append("Score : " + score);
        }

        $("#restart").click(function () {
            create_game(context);
            generate_tiles(2, size_x, size_y);
        });

        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        function generate_tile_value() {
            if (getRandomInt(6) == 0) //1 chance sur 6 que chiffre 4 apparaisse
            {
                return 4;
            }
            else {
                return 2;
            }
        }

        function generate_tiles(nbr_tiles, size_x, size_y) //générer les premiers chiffres
        {
            for (let i = 0; i < nbr_tiles; i++) {
                var x = getRandomInt(size_x);
                var y = getRandomInt(size_y); //donne aux var x y position aléatoire entre 0 et taille du tableau

                if ($("td[x*='" + x + "'][y*='" + y + "']").attr('nbr') != 0) {
                    generate_tiles(nbr_tiles - i, size_x, size_y);
                }
                else {
                    var value = generate_tile_value();

                    if (value == 2) {

                        $("td[x*='" + x + "'][y*='" + y + "']").attr('nbr', value).attr('done', false).addClass("color_" + 2);
                    }
                    else {
                        $("td[x*='" + x + "'][y*='" + y + "']").attr('nbr', value).attr('done', false).addClass("color_" + 4);
                    }
                    $("td[x*='" + x + "'][y*='" + y + "']").append(value);
                }
            }
        }

        $(document).keydown(function(e) {
            if (e.which == 39) {
                soundmove();
                move_right();
                show_score();
                
                if (option_open(size_x, size_y) == false ){
                    alert("game over");
                }
            }

            else if (e.which == 37) {
                soundmove();
                move_left();
                show_score();
                
                if (option_open(size_x, size_y) == false ){
                    alert("game over");
                }
            }

            else if (e.which == 38) {
                soundmove();
                move_up();
                show_score();
                
                if (option_open(size_x, size_y) == false ){
                    alert("game over");
                }
            }

            else if (e.which == 40) {
                soundmove();
                move_down();
                show_score();

                if (option_open(size_x, size_y) == false ){
                    alert("game over");
                }
            }
        });

        function soundmove() {
            var audio = new Audio('move.mp3');
            audio.play();
        }


        function move_left() {
            var move = false;

            for (let y = 0; y < size_y; y++) {
                for (let x = 0; x < size_x - 1; x++) {

                    let cellule = $("td[x*='" + x + "'][y*='" + y + "']");
                    let celluleDroite = $("td[x*='" + (x + 1) + "'][y*='" + y + "']");
                    let valCellule = cellule.attr('nbr');
                    let valCelluleD = celluleDroite.attr('nbr');
                    let celluleFusion = cellule.attr('done'); //attribut qui vérifie si une cellule a déja été fusionnée
                    let celluleFusion2 = celluleDroite.attr('done');

                    if (valCellule == 0 && valCelluleD !== valCellule) {
                        cellule.attr('nbr', valCelluleD);
                        cellule.empty();
                        cellule.removeClass();
                        cellule.addClass("color_" + valCelluleD);
                        cellule.append(valCelluleD);
                        celluleDroite.empty();
                        celluleDroite.removeClass();
                        celluleDroite.attr('nbr', 0);
                        x = -1;
                        move = true;
                    }

                    if (valCellule == valCelluleD && valCellule != 0 && celluleFusion == "false" && celluleFusion2 == "false") {
                        fusion_tiles(cellule, celluleDroite);
                        cellule.attr('done', true);
                        x = -1;
                        move = true;
                    }
                }
            }

            $("td").each(function () {
                $(this).attr("done", false);
            });

            if (move == true) {
                generate_tiles(1, size_x, size_y);
            }

            move = false;
        }

        function move_right() {
            var move = false;

            for (let y = 0; y < size_y; y++) {
                for (let x = size_x - 1; x > 0; x--) {

                    let cellule = $("td[x*='" + x + "'][y*='" + y + "']");
                    let celluleGauche = $("td[x*='" + (x - 1) + "'][y*='" + y + "']");
                    let valCellule = cellule.attr('nbr');
                    let valCelluleG = celluleGauche.attr('nbr');
                    let celluleFusion = cellule.attr('done');
                    let celluleFusion2 = celluleGauche.attr('done');

                    if (valCellule == 0 && valCelluleG !== valCellule) {
                        cellule.attr('nbr', valCelluleG);
                        cellule.empty();
                        cellule.removeClass();
                        cellule.addClass("color_" + valCelluleG)
                        cellule.append(valCelluleG);
                        celluleGauche.empty();
                        celluleGauche.removeClass();
                        celluleGauche.attr('nbr', 0);
                        x = size_x;
                        move = true;
                    }

                    if (valCellule == valCelluleG && valCellule != 0 && celluleFusion == "false" && celluleFusion2 == "false") {
                        fusion_tiles(cellule, celluleGauche);
                        cellule.attr('done', true);
                        x = size_x;
                        move = true;
                    }
                }
            }

            $("td").each(function () {
                $(this).attr("done", false);
            });

            if (move == true) {
                generate_tiles(1, size_x, size_y);
            }

            move = false;
        }

        function move_up() {
            var move = false;

            for (let x = 0; x < size_x; x++) {
                for (let y = 0; y < size_y - 1; y++) {

                    let cellule = $("td[x*='" + x + "'][y*='" + y + "']");
                    let celluleSous = $("td[x*='" + x + "'][y*='" + (y + 1) + "']");
                    let valCellule = cellule.attr('nbr');
                    let valCelluleS = celluleSous.attr('nbr');
                    let celluleFusion = cellule.attr('done');
                    let celluleFusion2 = celluleSous.attr('done');

                    if (valCellule == 0 && valCelluleS !== valCellule) {
                        cellule.attr('nbr', valCelluleS);
                        cellule.empty();
                        cellule.removeClass();
                        cellule.addClass("color_" + valCelluleS)
                        cellule.append(valCelluleS);
                        celluleSous.empty();
                        celluleSous.removeClass();
                        celluleSous.attr('nbr', 0)
                        y = -1;
                        move = true;
                    }

                    if (valCellule == valCelluleS && valCellule != 0 && celluleFusion == "false" && celluleFusion2 == "false") {
                        fusion_tiles(cellule, celluleSous);
                        cellule.attr('done', true);
                        y = -1;
                        move = true;
                    }
                }
            }

            $("td").each(function () {
                $(this).attr("done", false);
            });

            if (move == true) {
                generate_tiles(1, size_x, size_y);
            }
            move = false;
        }

        function move_down() {
            var move = false;

            for (let x = 0; x < size_x; x++) {
                for (let y = size_y - 1; y > 0; y--) {

                    let cellule = $("td[x*='" + x + "'][y*='" + y + "']");
                    let celluleSur = $("td[x*='" + x + "'][y*='" + (y - 1) + "']");
                    let valCellule = cellule.attr('nbr');
                    let valCelluleS = celluleSur.attr('nbr');
                    let celluleFusion = cellule.attr('done');
                    let celluleFusion2 = celluleSur.attr('done');

                    if (valCellule == 0 && valCelluleS !== valCellule) {
                        cellule.attr('nbr', valCelluleS);
                        cellule.empty();
                        cellule.removeClass();
                        cellule.addClass("color_" + valCelluleS)
                        cellule.append(valCelluleS);
                        celluleSur.empty();
                        celluleSur.removeClass();
                        celluleSur.attr('nbr', 0);
                        y = size_y;
                        move = true;
                    }

                    if (valCellule == valCelluleS && valCellule != 0 && celluleFusion == "false" && celluleFusion2 == "false") {
                        fusion_tiles(cellule, celluleSur);
                        cellule.attr('done', true);
                        y = size_y;
                        move = true;
                    }
                }
            }

            $("td").each(function () {
                $(this).attr("done", false);
            });


            if (move == true) {
                generate_tiles(1, size_x, size_y);
            }

            move = false;
        }

        function fusion_tiles(celluleA, celluleB) {
            value = (celluleB.attr("nbr") * 2);
            celluleA.attr('nbr', (value));
            celluleA.empty();
            celluleA.removeClass();
            if (celluleA.attr('nbr') !== "0") {
                celluleA.append(value);
                celluleA.addClass("color_" + value);
            }
            celluleB.empty();
            celluleB.removeClass();
            celluleB.attr('nbr', 0);
            score = (score + value);

            if (value == 2048) {
                alert("victory");
            }
        }

        function option_open(size_x, size_y) {
            let empty = false; 
            for (let y = 0; y < size_y; y++) {
                for (let x = 0; x < size_x; x++) {
                    
                    if ($("td[x*='" + x + "'][y*='" + y + "']").attr('nbr') == "0")
                    {
                        empty = true;
                        return true;
                    }
                }
            }
            if (empty == true)
            {
                return true;
            }
            else {
                for (let y = 0; y < size_y; y++) {
                    for (let x = 0; x < size_x; x++) {
                        value = $("td[x*='" + x + "'][y*='" + y + "']").attr('nbr');
                        valueDroite = $("td[x*='" + (x+1) + "'][y*='" + y + "']").attr('nbr');
                        valueSous = $("td[x*='" + x + "'][y*='" + (y+1) + "']").attr('nbr');

                        if(value == valueDroite || value == valueSous) {
                            return true;
                        }
                    }
                }
            }
            empty = false;
            return false;
        }



        function generate_map(size_x, size_y) {
            var table = $('<table></table>');

            for (let y = 0; y < size_y; y++) {

                let ligne = $('<tr></tr>');
                for (let x = 0; x < size_x; x++) {
                    let cellule = $('<td></td>').attr('x', x).attr('y', y).attr('nbr', 0);
                    ligne.append(cellule);
                }
                table.append(ligne);
            }
            return table;
        }


    }
})(jQuery);

/*
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

avec floor qui permet d'arrondir au nombre entier inférieur
*/

{/* <div id="myfilter" style="position: absolute; background-color: rgb(0, 0, 0); opacity: 0.3; width: 322px; height: 182px; display: block;"></div> */}
// <div id="myrestartbutton" style="position: absolute; padding-top: 75px; padding-left: 120px; display: block;"><button onclick="restartGame()">Restart</button></div>
// <button onclick="restartGame()">Restart</button>