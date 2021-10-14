const readlineSync = require("readline-sync");

const main = () => {

    //UCITAVANJE IGRACA - IZBOR
    let tennisPlayers = [];
    let izbor
    let proveraIzbora

    do {
        proveraIzbora = true
        izbor = parseInt(readlineSync.question(`Izaberite opciju 
      1. Manuelni unos tenisera
      2. Ucitavanje iz dokumenta
      `))

        if (izbor != 1 && izbor != 2) {
            console.log('Morate uneti cifru 1 ili 2!')
            proveraIzbora = false
        }
    } while (!proveraIzbora)


    //MANUELNI UNOS
    if (izbor == 1) {

        //Koliko igraca
        var N = 0;
        let proveraBroja
        do {
            proveraBroja = true
            N = readlineSync.question("Unesite broj tenisera (N):");

            //Proverava da li je broj kvadrat broja 2 
            var x = N
            oblikUnosa = /^[0-9]*$/
            if (!oblikUnosa.test(N)) proveraBroja = false
            else if (N > 64 || N < 3) proveraBroja = false

            while (x > 1) {
                if (x % 2 != 0) proveraBroja = false
                x /= 2
            }

            if (!proveraBroja) console.log('Uneli ste neodgovarajuci broj ili u pogresnom formatu!')

        } while (!proveraBroja)


        //Unos Igraca
        var proveraIgraca
        for (var i = 0; i < N; i++) {
            var tempTennisPlayerData = [];
            var tempTennisPlayer = ""

            do {
                proveraIgraca = false;
                tempTennisPlayer = readlineSync.question(
                    "Unesite tenisera u obliku [ime],[prezime],[drzava],[ranking]:");

                tempTennisPlayerData = tempTennisPlayer.split(",");
                const pattern = /^[a-zA-Z]+$/
                if (tempTennisPlayerData.length != 4) {
                    proveraIgraca = true;
                    console.log('Uneli ste vise ili manje podataka nego sto je potrebno')
                }
                else if (tempTennisPlayerData[0].length === 0 || tempTennisPlayerData[1].length === 0 || tempTennisPlayerData[2].length === 0) {
                    proveraIgraca = true;
                    console.log('Morate uneti sve vrednosti')
                }
                else if (!Number.isInteger(parseInt(tempTennisPlayerData[3]))) {
                    proveraIgraca = true;
                    console.log('Pozicija na rang listi nije ispravno uneta')
                }

                else if (!pattern.test(tempTennisPlayerData[0]) || !pattern.test(tempTennisPlayerData[1]) || !pattern.test(tempTennisPlayerData[2])) {
                    proveraIgraca = true;
                    console.log('Ime, Prezime i Drzava moraju biti uneti kao tekst')
                }

                else {
                    //Provera da li se poklapa ranking 
                    tennisPlayers.forEach((player) => {
                        if (parseInt(tempTennisPlayerData[3]) == player.ranking) {
                            proveraIgraca = true;
                            console.log('Igrac sa ovim rankingom postoji.')
                        }

                    })
                }

            } while (proveraIgraca)


            tennisPlayers.push({
                firstName: tempTennisPlayerData[0],
                lastName: tempTennisPlayerData[1],
                country: tempTennisPlayerData[2],
                ranking: parseInt(tempTennisPlayerData[3]),
            });
        }

    }


    //CITANJE IZ DOKUMENTA
    if (izbor == 2) {
        const fs = require('fs')
        let rawdata = fs.readFileSync('igraci.json')
        tennisPlayers = JSON.parse(rawdata)
    }


    //BIRANJE IGRACA ZA PRVU RUNDU
    var parovi = []

    function shufle(listaIgraca) {
        pomLista = listaIgraca

        var indexes = [];

        do {
            let rndPlayer1 = Math.floor(Math.random() * pomLista.length)
            let rndPlayer2 = Math.floor(Math.random() * pomLista.length)

            if (!indexes.includes(rndPlayer1) && !indexes.includes(rndPlayer2) && rndPlayer1!=rndPlayer2) {
                if (pomLista[rndPlayer1].ranking + 1 != pomLista[rndPlayer2].ranking
                    && pomLista[rndPlayer1].ranking - 1 != pomLista[rndPlayer2].ranking) {

                    parovi.push([
                        pomLista[rndPlayer1],
                        pomLista[rndPlayer2]
                    ]);

                    indexes.push(rndPlayer1)
                    indexes.push(rndPlayer2)

                }
            }
        } while (pomLista.length != indexes.length)
    }

    shufle(tennisPlayers)

    //Funkcija za ispis
    function ispis(par, rezultat) {
        var array = []
        for (let igrac of par) {
            array.push(`${igrac.firstName.substring(0, 1)}. ${igrac.lastName} (${igrac.country}, ${igrac.ranking})`)
        }
        array.push(`${rezultat}`)
        console.log(array.join(' - '))

    }

    //Odabira nasumicnog pobednika sa rezultatom meca
    function rndWinner(par) {
        var rnd = Math.floor(Math.random() * 2)
        let rez1 = ["3:0", "3:1", "3:2"]
        let rez2 = ["0:3", "1:3", "2:3"]

        let rezultat
        if (rnd == 0) rezultat = rez1[Math.floor(Math.random() * 3)]
        else rezultat = rez2[Math.floor(Math.random() * 3)]

        var igrac = [par[rnd], rezultat]
        return igrac
    }


    //Nastavak turnira
    var runda = 1
    do {
        var paroviNastavak = []

        if (parovi.length == 2) {
            console.log(`Semifinal:`)
        }
        else {
            console.log(`Round ${runda}:`)
        }

        for (let i = 0; i < parovi.length; i += 2) {

            var pobednik1 = rndWinner(parovi[i])
            var pobednik2 = rndWinner(parovi[i + 1])

            ispis(parovi[i], pobednik1[1])
            ispis(parovi[i + 1], pobednik2[1])

            paroviNastavak.push([
                pobednik1[0],
                pobednik2[0]
            ])
        }

        console.log("")
        parovi = paroviNastavak
        runda++

    } while (parovi.length > 1)

    console.log('Final: ')
    let winner = rndWinner(parovi[0])
    ispis(parovi[0], winner[1])
    console.log(`
    !!!!!! Winner !!!!!!
      ${winner[0].firstName.substring(0, 1)}. ${winner[0].lastName} (${winner[0].country}, ${winner[0].ranking})`)



    /*
  
      Your program (assignment) should start here...
      Variables N and tennisPlayers are available to you.
  
      Feel free to create new methods, include new files, and change this project as you wish.
  
      Code above this comment is used to "standardize" input to the application,
      and should be changed (or built upon) only if you would like to add input validation,
      or if you have an idea that you would like to demonstrate.
  
      ...Good Luck and Happy Coding...
  
    */
};

main();
