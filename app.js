const inputMoto = document.getElementById('inputMoto')
const btnPalpite = document.getElementById('btnPalpite')

let listaMotos = []
let motoDia = []

async function carregarMotos() {
    try {
        const resposta = await fetch('motos.json')

        listaMotos = await resposta.json()

        !Array.isArray(listaMotos) ? console.error('erro no carregamento do json', error) : console.log('Base de motos carregada com sucesso!');

        const indiceDia = Math.floor(Math.random() * listaMotos.length)
        motoDia = listaMotos[indiceDia]

        console.log("A moto do dia é:", motoDia.modelo)

        const datalist = document.getElementById('sugestoes')
        listaMotos.forEach(moto => {
            const option = document.createElement('option')
            option.value = moto.modelo
            datalist.appendChild(option)
        });

    } catch (error) {
        console.error('Erro no carregamento das motos:', error)
    }
}

carregarMotos()

function criarCaixa(conteudo, classeCor ='') {
    const div = document.createElement('div')
    div.classList.add('caixa-atributo')

    if (classeCor) {
        div.classList.add(classeCor)
    }

    div.textContent = conteudo
    return div
}

function desenharTentativa(motoPalpite, motoAlvo) {
    const container = document.getElementById('containerTentativas')
    const linha = document.createElement('div')
    linha.classList.add('linhaa-tentativa')

    const classeModelo = (motoPalpite.modelo === motoAlvo.modelo ? 'correto' : '')
    const caixaModelo = criarCaixa('Modelo: '+ motoPalpite.modelo, classeModelo)
    linha.appendChild(caixaModelo)

    const classeEstilo = (motoPalpite.estilo === motoAlvo.estilo ? 'correto' : '')
    const caixaEstilo = criarCaixa('Estilo: '+motoPalpite.estilo,classeEstilo);
    linha.appendChild(caixaEstilo);

    let textoCC = 'Cilindradas: '+motoPalpite.cilindrada;
    let classeCC = '';

    if (motoPalpite.cilindrada === motoAlvo.cilindrada) {
        classeCC = 'correto'
    } else {
        textoCC += motoPalpite.cilindrada > motoAlvo.cilindrada ? ' ⬇️' : ' ⬆️';
    }

    const caixaCC = criarCaixa(textoCC, classeCC)
    linha.appendChild(caixaCC)

    let textoCilindros = 'Quantidade de cilindros: '+motoPalpite.cilindros;
    let classeCilindros = '';
    if(motoPalpite.cilindros === motoAlvo.cilindros){
        classeCilindros = 'correto';
    } else {
        textoCilindros += motoPalpite.cilindros > motoAlvo.cilindros ? ' ⬇️' : ' ⬆️';
    }
    const caixaCilindros = criarCaixa(textoCilindros, classeCilindros);
    linha.appendChild(caixaCilindros);

    let textoPeso = 'Peso seco:' + motoPalpite.peso_seco_kg;
    let classePeso = '';
    if(motoPalpite.peso_seco_kg === motoAlvo.peso_seco_kg){
        classePeso = 'correto';
    } else {
        textoPeso += motoPalpite.peso_seco_kg > motoAlvo.peso_seco_kg ? ' ⬇️ mais leve' : ' ⬆️ mais pesada';
    }
    const caixaPeso = criarCaixa(textoPeso, classePeso);
    linha.appendChild(caixaPeso);

    container.prepend(linha)
}

btnPalpite.addEventListener("click", () => {
    const palpiteTexto = inputMoto.value.trim().toLowerCase();

    if (palpiteTexto === "") {
        alert('Digite uma moto')
        return
    }

    const motoEncontrada = listaMotos.find(moto => moto.modelo.toLowerCase() === palpiteTexto)

    if (!motoEncontrada) {
        alert('Moto não encontrada no banco');
        return
    }

    console.log('Moto validada e encontrada:', motoEncontrada);

    desenharTentativa(motoEncontrada, motoDia)

    if (motoEncontrada.modelo === motoDia.modelo) {
        alert(`🟩 Você acertou! A moto era a ${motoDia.modelo}`);
        inputMoto.disabled = true;
        btnPalpite.disabled = true;
    }
    
    inputMoto.value = ""
});