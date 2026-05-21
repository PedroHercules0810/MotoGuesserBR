const fs = require('fs');

// A lista branca já com a Kawasaki incluída
const marcasPermitidas = ["honda", "yamaha", "suzuki", "bmw", "triumph", "kawasaki"];

// Dicionário para traduzir o estilo (coluna Category)
const traduzirEstilo = {
    "Sport": "Desportiva",
    "Naked bike": "Naked",
    "Enduro / offroad": "Trail/Off-road",
    "Custom / cruiser": "Custom/Cruiser",
    "Touring": "Turismo",
    "Sport touring": "Sport Touring",
    "Super motard": "Supermotard",
    "Cross / motocross": "Motocross",
    "Classic": "Clássica",
    "Scooter": "Scooter",
    "Allround": "Naked/City"
};

// Lê o ficheiro que enviaste
const csvBruto = fs.readFileSync('all_bikez_curated.csv', 'utf-8');
const linhas = csvBruto.split('\n');
const motosLimpas = [];

for (let i = 1; i < linhas.length; i++) {
    const colunas = linhas[i].split(',');

    // Prevenção caso a linha esteja vazia ou incompleta
    if (colunas.length < 19) continue; 

    const marca = colunas[0].trim().toLowerCase();
    
    if (marcasPermitidas.includes(marca)) {
        const categoriaIngles = colunas[3].trim();
        const estiloTraduzido = traduzirEstilo[categoriaIngles] || categoriaIngles;
        
        const cilindrada = parseFloat(colunas[5]);
        const peso = parseFloat(colunas[18]);

        // Só adiciona se tiver os números válidos para a matemática das setinhas (⬆️ ⬇️) funcionar
        if (!isNaN(cilindrada) && !isNaN(peso)) {
            motosLimpas.push({
                id: motosLimpas.length + 1,
                marca: marca.charAt(0).toUpperCase() + marca.slice(1), // Capitaliza a primeira letra
                modelo: colunas[1].trim(),
                estilo: estiloTraduzido,
                cilindrada: cilindrada,
                peso_seco_kg: peso
            });
        }
    }
}

fs.writeFileSync('motos_completo.json', JSON.stringify(motosLimpas, null, 2));
console.log(`Sucesso! Foram guardadas ${motosLimpas.length} motas limpas e traduzidas.`);